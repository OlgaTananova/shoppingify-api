import {Response, Request, NextFunction} from "express";
import {ShoppingListModel} from '../models/shoppingList';
import ConflictError from "../errors/ConflictError";
import {
    conflictMessage,
    incorrectValueForShoppingListMessage,
    notFoundListMessage,
    notFoundMessage
} from "../constants";
import NotFoundError from "../errors/NotFoundError";
import notFoundError from "../errors/NotFoundError";

export const getShoppingLists = async (req: Request, res: Response, next: NextFunction) => {
    const owner = (req.user && typeof req.user === 'object') && req.user._id;
   let shoppingLists;
   try {
       shoppingLists = await ShoppingListModel.find({owner});
       if (!shoppingLists) {
           return next(new NotFoundError(notFoundListMessage('shoppingLists')));
       }
       res.send(shoppingLists)
   } catch(err) {
       next(err);
   }
}

export const createShoppingList = async (req: Request, res: Response, next: NextFunction)=>{
    const owner = (req.user && typeof req.user === 'object') && req.user._id;
    const {categoryId, itemId} = req.body;
    let activeShoppingList;
    try{
        activeShoppingList = await ShoppingListModel.findOne({status: 'active'});
        if (activeShoppingList) {
            return next(new ConflictError(conflictMessage('active shopping list')));
        }
        activeShoppingList = await  ShoppingListModel.create({
            owner: owner,
            items: {
                itemId: itemId,
                categoryId: categoryId,
            }
        });
        res.send(activeShoppingList);
    } catch(err) {
        next(err);
    }
}

export const addItemToShoppingList = async (req: Request, res: Response, next: NextFunction) =>  {
    const owner = (req.user && typeof req.user === 'object') && req.user._id;
    const {shoppingListId, categoryId, itemId, quantity = 1, status = 'pending'} = req.body;
    let updatedShoppingList;
    try{
        updatedShoppingList = await ShoppingListModel.findOneAndUpdate(
            {_id: shoppingListId, status: 'active', owner: owner, 'items.itemId': {$ne: itemId}},
            {
                $push: {items: {
                        itemId: itemId,
                        categoryId: categoryId,
                        quantity: quantity,
                        status: status
                    }
                }
            },
            {new: true});
        if (!updatedShoppingList) {
            return next (new NotFoundError(incorrectValueForShoppingListMessage));
        }
        res.send(updatedShoppingList);
    } catch(err) {
       next(err);
    }
}

export const deleteItemFromShoppingList = async (req: Request, res: Response, next: NextFunction) => {
    const owner = (req.user && typeof req.user === 'object') && req.user._id;
    const {shoppingListId, itemId} = req.body;
    let deletedItem;
    try {
        deletedItem = await ShoppingListModel.findOneAndUpdate({
            _id: shoppingListId, status: 'active', owner: owner, 'items.itemId': {$eq: itemId}
        },{
            $pull: {items: {
                    itemId: itemId
                }
            }
        }, {new: true});
        res.send(deletedItem);
    } catch(err) {
        next(err);
    }
}

