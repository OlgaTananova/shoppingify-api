"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteItemFromShoppingList = exports.addItemToShoppingList = exports.createShoppingList = exports.getShoppingLists = void 0;
const shoppingList_1 = require("../models/shoppingList");
const ConflictError_1 = __importDefault(require("../errors/ConflictError"));
const constants_1 = require("../constants");
const NotFoundError_1 = __importDefault(require("../errors/NotFoundError"));
const getShoppingLists = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const owner = (req.user && typeof req.user === 'object') && req.user._id;
    let shoppingLists;
    try {
        shoppingLists = yield shoppingList_1.ShoppingListModel.find({ owner });
        if (!shoppingLists) {
            return next(new NotFoundError_1.default((0, constants_1.notFoundListMessage)('shoppingLists')));
        }
        res.send(shoppingLists);
    }
    catch (err) {
        next(err);
    }
});
exports.getShoppingLists = getShoppingLists;
const createShoppingList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const owner = (req.user && typeof req.user === 'object') && req.user._id;
    const { categoryId, itemId } = req.body;
    let activeShoppingList;
    try {
        activeShoppingList = yield shoppingList_1.ShoppingListModel.findOne({ status: 'active' });
        if (activeShoppingList) {
            return next(new ConflictError_1.default((0, constants_1.conflictMessage)('active shopping list')));
        }
        activeShoppingList = yield shoppingList_1.ShoppingListModel.create({
            owner: owner,
            items: {
                itemId: itemId,
                categoryId: categoryId,
            }
        });
        res.send(activeShoppingList);
    }
    catch (err) {
        next(err);
    }
});
exports.createShoppingList = createShoppingList;
const addItemToShoppingList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const owner = (req.user && typeof req.user === 'object') && req.user._id;
    const { shoppingListId, categoryId, itemId, quantity = 1, status = 'pending' } = req.body;
    let updatedShoppingList;
    try {
        updatedShoppingList = yield shoppingList_1.ShoppingListModel.findOneAndUpdate({ _id: shoppingListId, status: 'active', owner: owner, 'items.itemId': { $ne: itemId } }, {
            $push: { items: {
                    itemId: itemId,
                    categoryId: categoryId,
                    quantity: quantity,
                    status: status
                }
            }
        }, { new: true });
        if (!updatedShoppingList) {
            return next(new NotFoundError_1.default(constants_1.incorrectValueForShoppingListMessage));
        }
        res.send(updatedShoppingList);
    }
    catch (err) {
        next(err);
    }
});
exports.addItemToShoppingList = addItemToShoppingList;
const deleteItemFromShoppingList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const owner = (req.user && typeof req.user === 'object') && req.user._id;
    const { shoppingListId, itemId } = req.body;
    let deletedItem;
    try {
        deletedItem = yield shoppingList_1.ShoppingListModel.findOneAndUpdate({
            _id: shoppingListId, status: 'active', owner: owner, 'items.itemId': { $eq: itemId }
        }, {
            $pull: { items: {
                    itemId: itemId
                }
            }
        }, { new: true });
        res.send(deletedItem);
    }
    catch (err) {
        next(err);
    }
});
exports.deleteItemFromShoppingList = deleteItemFromShoppingList;
