import {Response, Request, NextFunction} from "express";
import {ShoppingListModel} from '../models/shoppingList';
import ConflictError from "../errors/ConflictError";
import {conflictMessage, notFoundListMessage} from "../constants";
import NotFoundError from "../errors/NotFoundError";

export const getShoppingLists = async (req: Request, res: Response, next: NextFunction) => {
    const owner = (req.user && typeof req.user === 'object') && req.user._id;
    // const {owner } = req.body;
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
    // const owner = (req.user && typeof req.user === 'object') && req.user._id;
    const {categoryId, itemId, owner } = req.body;
    let activeShoppingList;
    try{
        activeShoppingList = await ShoppingListModel.findOne({status: 'active'});
        if (activeShoppingList) {
            return next(new ConflictError(conflictMessage('active shopping list')));
        }
        activeShoppingList = await  ShoppingListModel.create({
            owner: owner,
            categories: {
                categoryId: categoryId,
                items: [{
                    itemId: itemId
                }]
            }
        });
        res.send(activeShoppingList);
    } catch(err) {
        next(err);
    }
}

