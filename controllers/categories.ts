import {CategoryModel} from "../models/category";
import {Response, Request, NextFunction} from "express";
import ConflictError from "../errors/ConflictError";
import {conflictMessage, notFoundListMessage, notFoundMessage} from "../constants";
import NotFoundError from "../errors/NotFoundError";

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
    const {category} = req.body;
    const owner = (req.user && typeof req.user === 'object') && req.user._id;
    let existingCategory;
    let createdCategory;
    try {
        existingCategory = await CategoryModel.findOne({owner, category});
        if (existingCategory) {
            return next(new ConflictError(JSON.stringify({message: conflictMessage('category')})));
        }
        createdCategory = await CategoryModel.create({category, owner});
        res.send(createdCategory);
    } catch (err) {
       next(err);
    }
}

export const addItemToCategory = async (req: Request, res: Response, next: NextFunction) => {
    const {_id, categoryId} = req.body;
    let updatedCategory;
    const owner = (req.user && typeof req.user === 'object') && req.user._id;
    try {
        updatedCategory = await CategoryModel.findOneAndUpdate({categoryId, owner},
            { $addToSet: { items: _id}}, { new: true })
        if (!updatedCategory) {
            return next(new NotFoundError(JSON.stringify({message: notFoundMessage('category')})));
        }
        res.send(updatedCategory);
    } catch (e) {
        next(e);
    }
}

export const deleteItemFromCategory = async (req: Request, res: Response, next: NextFunction) => {
    const {_id, categoryId} = req.body;
    const owner = (req.user && typeof req.user === 'object') && req.user._id;
    let updatedCategory;
    try {
        updatedCategory = await CategoryModel.findOneAndUpdate({'_id': categoryId, 'owner': owner},
            {$pull: {'items': _id}}, {new: true});
        if (!updatedCategory) {
            return next(new NotFoundError(JSON.stringify({message: notFoundMessage('category')})));
        }
        res.send(updatedCategory);
    } catch (err) {
        next(err);
    }
}

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
    let categories;
    const owner = (req.user && typeof req.user === 'object') && req.user._id;
    try {
        categories = await CategoryModel.find({owner})
        if (!categories) {
            return next(new NotFoundError(JSON.stringify({message: notFoundListMessage('categories')})));
        }
        res.send(categories);
    } catch (err) {
        next(err);
    }
}


