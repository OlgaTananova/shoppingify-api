import {Response, Request, NextFunction} from "express";
import {ItemModel} from "../models/item";
import ConflictError from "../errors/ConflictError";
import {conflictMessage, notFoundListMessage, notFoundMessage} from "../constants";
import NotFoundError from "../errors/NotFoundError";

export const createItem = async (req:Request, res: Response, next: NextFunction)=> {
    const {name, note, image, categoryId} = req.body;
    let existingItem;
    let createdItem;
    try {
        existingItem = await ItemModel.findOne({name})
        if (existingItem) {
            return next(new ConflictError(conflictMessage('item')));
        }
        createdItem = await ItemModel.create({
            name, note, image, categoryId
        })
        res.send(createdItem);
    } catch (e) {
        res.send(e)
    }
}

export const getItems = async (req: Request, res: Response, next: NextFunction) => {
    let items;

    try {
        items = await ItemModel.find({});
        if (!items) {
            return next (new NotFoundError(notFoundListMessage('items')));
        }
        res.send(items);
    } catch (err) {
        next(err);
    }
}

export const getItemById = async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;
    let displayedItem;
    try {
        displayedItem = await ItemModel.findById(id);
        if (!displayedItem) {
            return next(new NotFoundError(notFoundMessage('item')));
        }
        res.send(displayedItem);
    } catch (err) {
        next(err);
    }
}

export const deleteItem = async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;
    let deletedItem;
    try {
       deletedItem = await ItemModel.findByIdAndDelete(id);
        if (!deletedItem) {
            return next(new NotFoundError(notFoundMessage('item')));
        }
        res.send(deletedItem);
    } catch (err) {
        next(err);
    }
}

