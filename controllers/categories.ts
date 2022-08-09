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
            return next(new ConflictError(conflictMessage('category')));
        }
        createdCategory = await CategoryModel.create({category, owner});
        res.send(createdCategory);
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
            return next(new NotFoundError(notFoundListMessage('categories')));
        }
        res.send(categories);
    } catch (err) {
        next(err);
    }
}


