import {Response, Request, NextFunction} from "express";
import {ItemModel} from "../models/item";
import ConflictError from "../errors/ConflictError";
import {conflictMessage, notFoundListMessage, notFoundMessage} from "../constants";
import NotFoundError from "../errors/NotFoundError";
import {CategoryModel} from "../models/category";
import {ShoppingListModel} from "../models/shoppingList";

export const createItem = async (req: Request, res: Response, next: NextFunction) => {
    const {name, note, image, categoryId} = req.body;
    const owner = (req.user && typeof req.user === 'object') && req.user._id;
    let existingItem;
    let createdItem;
    let updatedCategory;
    try {
        updatedCategory = await CategoryModel.findOne({_id: categoryId, owner});
        if (!updatedCategory) {
            return next(new NotFoundError(notFoundMessage('category')));
        }
        existingItem = await ItemModel.findOne({name, owner})

        if (existingItem) {
            return next(new ConflictError(conflictMessage('item')));
        }

        createdItem = await ItemModel.create({
            name, note, image, categoryId, owner
        });
        updatedCategory = await CategoryModel.findOneAndUpdate({_id: createdItem.categoryId, owner},
            {$addToSet: {items: createdItem._id}}, {new: true});
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
            return next(new NotFoundError(notFoundListMessage('items')));
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
            return next(new NotFoundError(notFoundMessage('item')));
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
            return next(new NotFoundError(notFoundMessage('item')));
        }
        updatedCategory = await CategoryModel.findOneAndUpdate({
                '_id': deletedItem.categoryId,
                'owner': deletedItem.owner
            },
            {$pull: {'items': deletedItem._id}}, {new: true});

        if (!updatedCategory) {
            return next(new NotFoundError(notFoundMessage('category')));
        }
        res.send({item: deletedItem, category: updatedCategory});
    } catch (err) {
        next(err);
    }
}

export const updateItem = async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;
    const owner = (req.user && typeof req.user === 'object') && req.user._id;
    const {name, note, image, categoryId} = req.body;
    let updatedItem;
    let deleteFromCategory;
    let addToCategory;
    let updatedShoppingLists;
    try {
        updatedItem = await ItemModel.findOne({_id: id, owner: owner})
        const oldCategory = updatedItem? updatedItem!.categoryId.toString() : '';
        updatedItem = await ItemModel.findOneAndUpdate({_id: id, owner: owner }, {
            $set: {
                name: name,
                note: note,
                image: image,
                categoryId: categoryId
            }
        },
            {
                new: true
            });
        if (!updatedItem) {
            return new NotFoundError(notFoundMessage('item'))
        }
        if (oldCategory !== categoryId) {
            deleteFromCategory = await CategoryModel.findOneAndUpdate({
              _id: oldCategory,
              owner: owner
          }, {
              $pull: { items:  id }
          }, {
              new: true
          });
            addToCategory = await CategoryModel.findOneAndUpdate({
                _id: categoryId,
                owner: owner,
            }, {
                $addToSet: { items: id}
            }, {
                new: true
            });
            await ShoppingListModel.updateMany({
                owner: owner,
                'items.itemId': updatedItem._id
            }, {
                $set: {
                    'items.$[elem].categoryId': categoryId
                }
            }, {
                arrayFilters: [{'elem.itemId': updatedItem._id}],
                multi: true
            })
            updatedShoppingLists = await ShoppingListModel.find({
                owner: owner
            })
        }
        res.send({updatedItem, deleteFromCategory, addToCategory, updatedShoppingLists});
    } catch (err) {
        next(err);
    }
}
