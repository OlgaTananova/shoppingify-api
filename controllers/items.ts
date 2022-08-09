import {Response, Request, NextFunction} from "express";
import {ItemModel} from "../models/item";
import ConflictError from "../errors/ConflictError";
import {conflictMessage, notFoundListMessage, notFoundMessage} from "../constants";
import NotFoundError from "../errors/NotFoundError";
import {CategoryModel} from "../models/category";

export const createItem = async (req:Request, res: Response, next: NextFunction)=> {
    const {name, note, image, categoryId} = req.body;
    const owner = (req.user && typeof req.user === 'object') && req.user._id;
    let existingItem;
    let createdItem;
    let updatedCategory;
    try {
        existingItem = await ItemModel.findOne({name, owner})
        if (existingItem) {
            return next(new ConflictError(JSON.stringify({message: conflictMessage('item')})));
        }
        createdItem = await ItemModel.create({
            name, note, image, categoryId, owner
        })
        updatedCategory = await CategoryModel.findOneAndUpdate({_id: createdItem.categoryId, owner},
            { $addToSet: { items: createdItem._id}}, { new: true })
        if (!updatedCategory) {
            return next(new NotFoundError(JSON.stringify({message: notFoundMessage('category')})));
        }
        res.send({item: createdItem, category: updatedCategory});
    } catch (err) {
        next(err);
    }
}

export const getItems = async (req: Request, res: Response, next: NextFunction) => {
    let items;
    const owner = (req.user && typeof req.user === 'object') && req.user._id;
    try {
        items = await ItemModel.find({owner});
        if (!items) {
            return next (new NotFoundError(JSON.stringify({message: notFoundListMessage('items')})));
        }
        res.send(items);
    } catch (err) {
        next(err);
    }
}

export const getItemById = async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;
    const owner = (req.user && typeof req.user === 'object') && req.user._id;
    let displayedItem;
    try {
        displayedItem = await ItemModel.findOne({_id: id, owner});
        if (!displayedItem) {
            return next(new NotFoundError(JSON.stringify({message: notFoundMessage('item')})));
        }
        res.send(displayedItem);
    } catch (err) {
        next(err);
    }
}

export const deleteItem = async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;
    const owner = (req.user && typeof req.user === 'object') && req.user._id;
    let deletedItem;
    let updatedCategory;
    try {
       deletedItem = await ItemModel.findOneAndDelete({_id: id, owner});
        if (!deletedItem) {
            return next(new NotFoundError(JSON.stringify({message: notFoundMessage('item')})));
        }
        updatedCategory = await CategoryModel.findOneAndUpdate({'_id': deletedItem.categoryId, 'owner': deletedItem.owner},
            {$pull: {'items': deletedItem._id}}, {new: true});
        if (!updatedCategory) {
            return next(new NotFoundError(JSON.stringify({message: notFoundMessage('category')})));
        }
        res.send({item: deletedItem, category: updatedCategory});
    } catch (err) {
        next(err);
    }
}
