import {CategoryModel} from "../models/category";
import {Response, Request, NextFunction} from "express";
import ConflictError from "../errors/ConflictError";
import {conflictMessage, notFoundListMessage, notFoundMessage} from "../constants";
import NotFoundError from "../errors/NotFoundError";

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
    const {category} = req.body;
    let existingCategory;
    let createdCategory;
    try {
        existingCategory = await CategoryModel.findOne({category});
        if (existingCategory) {
            return next(new ConflictError(conflictMessage('category')))
        }
        createdCategory = await CategoryModel.create({category});
        res.send(createdCategory);
    } catch (e) {
        res.send(e);
    }
}

export const addItemToCategory = async (req: Request, res: Response, next: NextFunction) => {
    const {_id, categoryId} = req.body;
    let updatedCategory;

    try {
        updatedCategory = await CategoryModel.findByIdAndUpdate(categoryId,
            { $addToSet: { items: _id}}, { new: true })
        if (!updatedCategory) {
            return next(new NotFoundError(notFoundMessage('category')));
        }
        res.send(updatedCategory);
    } catch (e) {
        next(e);
    }
}

export const deleteItemFromCategory = async (req: Request, res: Response, next: NextFunction) => {
    const {_id, categoryId} = req.body;
    let updatedCategory;
    try {
        updatedCategory = await CategoryModel.findOneAndUpdate({'_id': categoryId},
            {$pull: {'items': _id}}, {new: true});
        if (!updatedCategory) {
            return next(new NotFoundError(notFoundMessage('category')));
        }
        res.send(updatedCategory);
    } catch (err) {
        next(err);
    }
}

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
    let categories;
    try {
        categories = await CategoryModel.find({})
        if (!categories) {
            return next(new NotFoundError(notFoundListMessage('categories')));
        }
        res.send(categories);
    } catch (err) {
        next(err);
    }
}


