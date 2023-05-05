import dotenv from 'dotenv';
dotenv.config();
import {Response, Request, NextFunction} from "express";
import {ShoppingListModel} from '../models/shoppingList';
import ConflictError from "../errors/ConflictError";
import {
    conflictMessage,
    notFoundListMessage, notFoundMessage, notUniqueItemErrorMessage,
} from "../constants";
import NotFoundError from "../errors/NotFoundError";
import pdfParse from 'pdf-parse';
import BadRequestError from "../errors/BadRequestError";

const {Configuration, OpenAIApi} = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

export const getShoppingLists = async (req: Request, res: Response, next: NextFunction) => {
    const owner = (req.user && typeof req.user === 'object') && req.user._id;
    let shoppingLists;
    try {
        shoppingLists = await ShoppingListModel.find({owner});
        if (!shoppingLists) {
            return next(new NotFoundError(notFoundListMessage('shopping lists')));
        }
        res.send(shoppingLists)
    } catch (err) {
        next(err);
    }
}

export const createShoppingList = async (req: Request, res: Response, next: NextFunction) => {
    const owner = (req.user && typeof req.user === 'object') && req.user._id;
    const {categoryId, itemId} = req.body;
    let activeShoppingList;
    try {
        activeShoppingList = await ShoppingListModel.findOne({owner: owner, status: 'active'});
        if (activeShoppingList) {
            return next(new ConflictError(conflictMessage('active shopping list')));
        }
        activeShoppingList = await ShoppingListModel.create({
            owner: owner,
            items: {
                itemId: itemId,
                categoryId: categoryId,
            }
        });
        res.send(activeShoppingList);
    } catch (err) {
        next(err);
    }
}

export const addItemToShoppingList = async (req: Request, res: Response, next: NextFunction) => {
    const owner = (req.user && typeof req.user === 'object') && req.user._id;
    const {shoppingListId, categoryId, itemId, quantity = 1, status = 'pending'} = req.body;
    let updatedShoppingList;
    try {
        updatedShoppingList = await ShoppingListModel.findOneAndUpdate(
            {_id: shoppingListId, status: 'active', owner: owner, 'items.itemId': {$ne: itemId}},
            {
                $push: {
                    items: {
                        itemId: itemId,
                        categoryId: categoryId,
                        quantity: quantity,
                        status: status
                    }
                }
            },
            {new: true});
        if (!updatedShoppingList) {
            return next(new ConflictError(notUniqueItemErrorMessage));
        }
        res.send(updatedShoppingList);
    } catch (err) {
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
        }, {
            $pull: {
                items: {
                    itemId: itemId
                }
            }
        }, {new: true});
        if (!deletedItem) {
            return next(new NotFoundError(notFoundMessage('item')));
        }
        res.send(deletedItem);
    } catch (err) {
        next(err);
    }
}

export const changeItemQuantity = async (req: Request, res: Response, next: NextFunction) => {
    const owner = (req.user && typeof req.user === 'object') && req.user._id;
    const {shoppingListId, itemId, quantity} = req.body;
    let updatedShoppingList;
    try {
        updatedShoppingList = await ShoppingListModel.findOneAndUpdate({
            _id: shoppingListId, status: 'active', owner: owner, 'items.itemId': {$eq: itemId}
        }, {
            $set: {
                'items.$.quantity': quantity
            }
        }, {
            new: true
        })
        if (!updatedShoppingList) {
            return next(new NotFoundError(notFoundMessage('active shopping list or item')));
        }
        res.send(updatedShoppingList);

    } catch (err) {
        next(err);
    }
}

export const changeItemStatus = async (req: Request, res: Response, next: NextFunction) => {
    const owner = (req.user && typeof req.user === 'object') && req.user._id;
    const {shoppingListId, itemId, status} = req.body;
    let updatedShoppingList;
    try {
        updatedShoppingList = await ShoppingListModel.findOneAndUpdate({
            _id: shoppingListId, status: 'active', owner: owner, 'items.itemId': {$eq: itemId}
        }, {
            $set: {
                'items.$.status': status
            }
        }, {
            new: true
        })
        if (!updatedShoppingList) {
            return next(new NotFoundError(notFoundMessage('item')));
        }
        res.send(updatedShoppingList);

    } catch (err) {
        next(err);
    }
}

export const changeSLHeading = async (req: Request, res: Response, next: NextFunction) => {
    const owner = (req.user && typeof req.user === 'object') && req.user._id;
    const {shoppingListId, heading} = req.body;
    let updatedShoppingList;
    try {
        updatedShoppingList = await ShoppingListModel.findOneAndUpdate({
            _id: shoppingListId, status: 'active', owner: owner
        }, {
            $set: {
                'heading': heading
            }
        }, {
            new: true
        })
        if (!updatedShoppingList) {
            return next(new NotFoundError(notFoundMessage('active shopping list')));
        }
        res.send(updatedShoppingList);

    } catch (err) {
        next(err);
    }
}

export const changeSLStatus = async (req: Request, res: Response, next: NextFunction) => {
    const owner = (req.user && typeof req.user === 'object') && req.user._id;
    const {shoppingListId, status} = req.body;
    let updatedShoppingList;
    try {
        updatedShoppingList = await ShoppingListModel.findOneAndUpdate({
            _id: shoppingListId, status: 'active', owner: owner
        }, {
            $set: {'status': status}
        }, {new: true});
        if (!updatedShoppingList) {
            return next(new NotFoundError(notFoundMessage('active shopping list')));
        }
        res.send(updatedShoppingList);
    } catch (err) {

        next(err);
    }
}

export const uploadBill = async (req: Request, res: Response, next: NextFunction) => {
    const file = req.files?.file;
    if (!file) {
        return next(new BadRequestError('No file uploaded'));
    }
    try {
        // @ts-ignore
        const response = await pdfParse(file);
        const requestToGPT = `Make a list of items from the bill: ${response.text}.
        The final list must contain item with the following properties: itemName 
        (only essential information, no brands), itemUnits without numbers (if the item is not weighted item, then replace it with pcs),
        itemQuantity, itemPricePerUnit, itemPrice. In a separate object within the list indicate the date of purchase and sales tax. The list must be in JSON format and must not contain any other information.`;
        const gptResponse = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: requestToGPT,
            max_tokens: 2048,
            temperature: 0,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
        });

        if (typeof JSON.parse(gptResponse.data.choices[0].text) !== 'object') {
            return next(new BadRequestError('The bill is not valid. Please try again.'));
        }
        res.send(gptResponse.data.choices[0].text);
    } catch (err) {
        next(err);
    }
}

export const mergeLists = async (req: Request, res: Response, next: NextFunction) => {
    const owner = (req.user && typeof req.user === 'object') && req.user._id;
    const updatedSL = req.body.items;
    const salesTax = req.body.salesTax;
    const date = req.body.date;
    const shoppingListId = req.body._id;
    try {
       const mergeShoppingList = await ShoppingListModel.findOneAndUpdate({
            _id: shoppingListId, status: 'active', owner: owner
        }, {
            $set: {
                'items': updatedSL.map((item: any) => {
                    return {
                        itemId: item.itemId,
                        categoryId: item.categoryId,
                        units: item.units,
                        quantity: item.quantity,
                        pricePerUnit: item.pricePerUnit,
                        price: item.price,
                        status: item.status
                    }
                }),
                'salesTax': salesTax,
                'date': new Date(date).toISOString()
            }
        }, {new: true});
        if (!mergeShoppingList) {
            return next(new NotFoundError(notFoundMessage('active shopping list')));
        }
        res.send(mergeShoppingList);
    } catch (err) {
        next(err);
    }
}

export const uploadList = async (req: Request, res: Response, next: NextFunction) => {
    const owner = (req.user && typeof req.user === 'object') && req.user._id;
    const {items, date, salesTax} = req.body;
    let activeShoppingList;
    try {
        activeShoppingList = await ShoppingListModel.findOne({
            status: 'active', owner: owner
        });
        if (activeShoppingList) {
            return next(new ConflictError(conflictMessage('active shopping list')));
        }
        const newShoppingList = await ShoppingListModel.create({
            owner: owner,
            salesTax: salesTax,
            date: date,
            items: [...items]
        });
        res.send(newShoppingList)
    } catch(err) {
        next(err);
    }
}

export const changeItemUnits = async (req: Request, res: Response, next: NextFunction) => {
    const owner = (req.user && typeof req.user === 'object') && req.user._id;
    const {shoppingListId, itemId, units} = req.body;
    let updatedShoppingList;
    try {
        updatedShoppingList = await ShoppingListModel.findOneAndUpdate({
            _id: shoppingListId, status: 'active', owner: owner, 'items.itemId': {$eq: itemId}
        }, {
            $set: {
                'items.$.units': units
            }
        }, {
            new: true
        })
        if (!updatedShoppingList) {
            return next(new NotFoundError(notFoundMessage('item')));
        }
        res.send(updatedShoppingList);

    } catch (err) {
        next(err);
    }
}
