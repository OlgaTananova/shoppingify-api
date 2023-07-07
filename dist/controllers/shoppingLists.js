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
exports.deleteShoppingList = exports.changeSalesTax = exports.changeItemPrice = exports.changeItemUnits = exports.uploadList = exports.mergeLists = exports.uploadBill = exports.changeSLStatus = exports.changeSLHeading = exports.changeItemStatus = exports.changeItemQuantity = exports.deleteItemFromShoppingList = exports.addItemToShoppingList = exports.createShoppingList = exports.getShoppingLists = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const shoppingList_1 = require("../models/shoppingList");
const ConflictError_1 = __importDefault(require("../errors/ConflictError"));
const constants_1 = require("../constants");
const NotFoundError_1 = __importDefault(require("../errors/NotFoundError"));
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const BadRequestError_1 = __importDefault(require("../errors/BadRequestError"));
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);
const getShoppingLists = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const owner = (req.user && typeof req.user === 'object') && req.user._id;
    let shoppingLists;
    try {
        shoppingLists = yield shoppingList_1.ShoppingListModel.find({ owner });
        if (!shoppingLists) {
            return next(new NotFoundError_1.default((0, constants_1.notFoundListMessage)('shopping lists')));
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
        activeShoppingList = yield shoppingList_1.ShoppingListModel.findOne({ owner: owner, status: 'active' });
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
        updatedShoppingList = yield shoppingList_1.ShoppingListModel.findOneAndUpdate({ _id: shoppingListId, status: 'active', owner: owner }, {
            $push: {
                items: {
                    itemId: itemId,
                    categoryId: categoryId,
                    quantity: quantity,
                    status: status
                }
            }
        }, { new: true });
        if (!updatedShoppingList) {
            return next(new NotFoundError_1.default((0, constants_1.notFoundMessage)('shopping list')));
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
    const { shoppingListId, _id } = req.body;
    let deletedItem;
    try {
        deletedItem = yield shoppingList_1.ShoppingListModel.findOneAndUpdate({
            _id: shoppingListId, status: 'active', owner: owner, 'items._id': { $eq: _id }
        }, {
            $pull: {
                items: {
                    _id: _id
                }
            }
        }, { new: true });
        if (!deletedItem) {
            return next(new NotFoundError_1.default((0, constants_1.notFoundMessage)('item')));
        }
        res.send(deletedItem);
    }
    catch (err) {
        next(err);
    }
});
exports.deleteItemFromShoppingList = deleteItemFromShoppingList;
const changeItemQuantity = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const owner = (req.user && typeof req.user === 'object') && req.user._id;
    let { shoppingListId, _id, quantity, pricePerUnit } = req.body;
    quantity = Number(quantity);
    pricePerUnit = Number(pricePerUnit);
    let updatedShoppingList;
    try {
        updatedShoppingList = yield shoppingList_1.ShoppingListModel.findOneAndUpdate({
            _id: shoppingListId, status: 'active', owner: owner, 'items._id': { $eq: _id }
        }, {
            $set: {
                'items.$.quantity': quantity,
                'items.$.price': pricePerUnit * quantity
            }
        }, {
            new: true
        });
        if (!updatedShoppingList) {
            return next(new NotFoundError_1.default((0, constants_1.notFoundMessage)('active shopping list or item')));
        }
        res.send(updatedShoppingList);
    }
    catch (err) {
        next(err);
    }
});
exports.changeItemQuantity = changeItemQuantity;
const changeItemStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const owner = (req.user && typeof req.user === 'object') && req.user._id;
    const { shoppingListId, _id, status } = req.body;
    let updatedShoppingList;
    try {
        updatedShoppingList = yield shoppingList_1.ShoppingListModel.findOneAndUpdate({
            _id: shoppingListId, status: 'active', owner: owner, 'items._id': { $eq: _id }
        }, {
            $set: {
                'items.$.status': status
            }
        }, {
            new: true
        });
        if (!updatedShoppingList) {
            return next(new NotFoundError_1.default((0, constants_1.notFoundMessage)('item')));
        }
        res.send(updatedShoppingList);
    }
    catch (err) {
        next(err);
    }
});
exports.changeItemStatus = changeItemStatus;
const changeSLHeading = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const owner = (req.user && typeof req.user === 'object') && req.user._id;
    const { shoppingListId, heading } = req.body;
    let updatedShoppingList;
    try {
        updatedShoppingList = yield shoppingList_1.ShoppingListModel.findOneAndUpdate({
            _id: shoppingListId, status: 'active', owner: owner
        }, {
            $set: {
                'heading': heading
            }
        }, {
            new: true
        });
        if (!updatedShoppingList) {
            return next(new NotFoundError_1.default((0, constants_1.notFoundMessage)('active shopping list')));
        }
        res.send(updatedShoppingList);
    }
    catch (err) {
        next(err);
    }
});
exports.changeSLHeading = changeSLHeading;
const changeSLStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const owner = (req.user && typeof req.user === 'object') && req.user._id;
    const { shoppingListId, status } = req.body;
    let updatedShoppingList;
    try {
        updatedShoppingList = yield shoppingList_1.ShoppingListModel.findOneAndUpdate({
            _id: shoppingListId, status: 'active', owner: owner
        }, {
            $set: { 'status': status }
        }, { new: true });
        if (!updatedShoppingList) {
            return next(new NotFoundError_1.default((0, constants_1.notFoundMessage)('active shopping list')));
        }
        res.send(updatedShoppingList);
    }
    catch (err) {
        next(err);
    }
});
exports.changeSLStatus = changeSLStatus;
const uploadBill = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const file = (_a = req.files) === null || _a === void 0 ? void 0 : _a.file;
    if (!file) {
        return next(new BadRequestError_1.default('No file uploaded'));
    }
    try {
        // @ts-ignore
        const response = yield (0, pdf_parse_1.default)(file);
        const requestToGPT = `Make a list of items from the bill: ${response.text}.
        The final list must contain item with the following properties: itemName 
        (only essential information, no brands), itemUnits without numbers (if the item is not weighted item, then replace it with pcs),
        itemQuantity, itemPricePerUnit, itemPrice. In a separate object within the list of items indicate the date of purchase (in the following format: May 31, 2023) and sales tax. The list must be in JSON format and must not contain any other information.`;
        const gptResponse = yield openai.createCompletion({
            model: "text-davinci-003",
            prompt: requestToGPT,
            max_tokens: 3000,
            temperature: 0,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
        });
        res.send(gptResponse.data.choices[0].text);
    }
    catch (err) {
        next(err);
    }
});
exports.uploadBill = uploadBill;
const mergeLists = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const owner = (req.user && typeof req.user === 'object') && req.user._id;
    const updatedSL = req.body.items;
    const salesTax = req.body.salesTax;
    const date = req.body.date;
    const shoppingListId = req.body._id;
    try {
        const mergeShoppingList = yield shoppingList_1.ShoppingListModel.findOneAndUpdate({
            _id: shoppingListId, status: 'active', owner: owner
        }, {
            $set: {
                'items': updatedSL.map((item) => {
                    return {
                        itemId: item.itemId,
                        categoryId: item.categoryId,
                        units: item.units,
                        quantity: item.quantity,
                        pricePerUnit: item.pricePerUnit,
                        price: item.price,
                        status: item.status
                    };
                }),
                'salesTax': salesTax,
                'date': Number.isNaN(new Date(date).getTime()) ? new Date().toISOString() : new Date(date).toISOString()
            }
        }, { new: true });
        if (!mergeShoppingList) {
            return next(new NotFoundError_1.default((0, constants_1.notFoundMessage)('active shopping list')));
        }
        res.send(mergeShoppingList);
    }
    catch (err) {
        next(err);
    }
});
exports.mergeLists = mergeLists;
const uploadList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const owner = (req.user && typeof req.user === 'object') && req.user._id;
    const { items, date, salesTax } = req.body;
    let activeShoppingList;
    try {
        activeShoppingList = yield shoppingList_1.ShoppingListModel.findOne({
            status: 'active', owner: owner
        });
        if (activeShoppingList) {
            return next(new ConflictError_1.default((0, constants_1.conflictMessage)('active shopping list')));
        }
        const newShoppingList = yield shoppingList_1.ShoppingListModel.create({
            owner: owner,
            salesTax: salesTax,
            date: Number.isNaN(new Date(date).getTime()) ? new Date().toISOString() : new Date(date).toISOString(),
            items: [...items]
        });
        res.send(newShoppingList);
    }
    catch (err) {
        next(err);
    }
});
exports.uploadList = uploadList;
const changeItemUnits = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const owner = (req.user && typeof req.user === 'object') && req.user._id;
    const { shoppingListId, _id, units } = req.body;
    let updatedShoppingList;
    try {
        updatedShoppingList = yield shoppingList_1.ShoppingListModel.findOneAndUpdate({
            _id: shoppingListId, status: 'active', owner: owner, 'items._id': { $eq: _id }
        }, {
            $set: {
                'items.$.units': units
            }
        }, {
            new: true
        });
        if (!updatedShoppingList) {
            return next(new NotFoundError_1.default((0, constants_1.notFoundMessage)('item')));
        }
        res.send(updatedShoppingList);
    }
    catch (err) {
        next(err);
    }
});
exports.changeItemUnits = changeItemUnits;
const changeItemPrice = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const owner = (req.user && typeof req.user === 'object') && req.user._id;
    let { shoppingListId, _id, pricePerUnit, quantity } = req.body;
    pricePerUnit = Number(pricePerUnit);
    quantity = Number(quantity);
    let updatedShoppingList;
    try {
        updatedShoppingList = yield shoppingList_1.ShoppingListModel.findOneAndUpdate({
            _id: shoppingListId, status: 'active', owner: owner, 'items._id': { $eq: _id },
        }, {
            $set: {
                'items.$.pricePerUnit': pricePerUnit,
                'items.$.price': pricePerUnit * quantity
            }
        }, {
            new: true
        });
        if (!updatedShoppingList) {
            return next(new NotFoundError_1.default((0, constants_1.notFoundMessage)('item')));
        }
        res.send(updatedShoppingList);
    }
    catch (err) {
        next(err);
    }
});
exports.changeItemPrice = changeItemPrice;
const changeSalesTax = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const owner = (req.user && typeof req.user === 'object') && req.user._id;
    const { shoppingListId, salesTax } = req.body;
    let updatedShoppingList;
    try {
        updatedShoppingList = yield shoppingList_1.ShoppingListModel.findOneAndUpdate({
            _id: shoppingListId, status: 'active', owner: owner
        }, {
            $set: { salesTax: salesTax }
        }, { new: true });
        if (!updatedShoppingList) {
            return next(new NotFoundError_1.default((0, constants_1.notFoundMessage)('active shopping list')));
        }
        res.send(updatedShoppingList);
    }
    catch (err) {
        next(err);
    }
});
exports.changeSalesTax = changeSalesTax;
const deleteShoppingList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const owner = (req.user && typeof req.user === 'object') && req.user._id;
    const { id } = req.body;
    let shoppingList;
    try {
        shoppingList = yield shoppingList_1.ShoppingListModel.findOneAndDelete({ owner: owner, _id: id });
        if (!shoppingList) {
            return next(new NotFoundError_1.default((0, constants_1.notFoundMessage)('shopping list')));
        }
        res.send({ message: "Shopping list deleted." });
    }
    catch (err) {
        next(err);
    }
});
exports.deleteShoppingList = deleteShoppingList;
