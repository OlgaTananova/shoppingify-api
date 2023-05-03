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
exports.mergeLists = exports.uploadBill = exports.changeSLStatus = exports.changeSLHeading = exports.changeItemStatus = exports.changeItemQuantity = exports.deleteItemFromShoppingList = exports.addItemToShoppingList = exports.createShoppingList = exports.getShoppingLists = void 0;
const shoppingList_1 = require("../models/shoppingList");
const ConflictError_1 = __importDefault(require("../errors/ConflictError"));
const constants_1 = require("../constants");
const NotFoundError_1 = __importDefault(require("../errors/NotFoundError"));
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const BadRequestError_1 = __importDefault(require("../errors/BadRequestError"));
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: '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'
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
        updatedShoppingList = yield shoppingList_1.ShoppingListModel.findOneAndUpdate({ _id: shoppingListId, status: 'active', owner: owner, 'items.itemId': { $ne: itemId } }, {
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
            return next(new ConflictError_1.default(constants_1.notUniqueItemErrorMessage));
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
            $pull: {
                items: {
                    itemId: itemId
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
    const { shoppingListId, itemId, quantity } = req.body;
    let updatedShoppingList;
    try {
        updatedShoppingList = yield shoppingList_1.ShoppingListModel.findOneAndUpdate({
            _id: shoppingListId, status: 'active', owner: owner, 'items.itemId': { $eq: itemId }
        }, {
            $set: {
                'items.$.quantity': quantity
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
    const { shoppingListId, itemId, status } = req.body;
    let updatedShoppingList;
    try {
        updatedShoppingList = yield shoppingList_1.ShoppingListModel.findOneAndUpdate({
            _id: shoppingListId, status: 'active', owner: owner, 'items.itemId': { $eq: itemId }
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
        itemQuantity, itemPricePerUnit, itemPrice. In a separate object within the list indicate the date of purchase and sales tax. The list must be in JSON format and must not contain any other information.`;
        const gptResponse = yield openai.createCompletion({
            model: "text-davinci-003",
            prompt: requestToGPT,
            max_tokens: 2048,
            temperature: 0,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
        });
        if (typeof JSON.parse(gptResponse.data.choices[0].text) !== 'object') {
            return next(new BadRequestError_1.default('The bill is not valid. Please try again.'));
        }
        res.send(gptResponse.data.choices[0].text);
    }
    catch (err) {
        next(err);
    }
});
exports.uploadBill = uploadBill;
const mergeLists = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const owner = (req.user && typeof req.user === 'object') && req.user._id;
    const updatedSL = req.body.list;
    try {
    }
    catch (err) {
        // next(err);
        console.log(err);
    }
});
exports.mergeLists = mergeLists;
