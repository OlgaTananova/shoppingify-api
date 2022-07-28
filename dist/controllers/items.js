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
exports.deleteItem = exports.getItemById = exports.getItems = exports.createItem = void 0;
const item_1 = require("../models/item");
const ConflictError_1 = __importDefault(require("../errors/ConflictError"));
const constants_1 = require("../constants");
const NotFoundError_1 = __importDefault(require("../errors/NotFoundError"));
const createItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, note, image, categoryId } = req.body;
    let existingItem;
    let createdItem;
    try {
        existingItem = yield item_1.ItemModel.findOne({ name });
        if (existingItem) {
            return next(new ConflictError_1.default((0, constants_1.conflictMessage)('item')));
        }
        createdItem = yield item_1.ItemModel.create({
            name, note, image, categoryId
        });
        res.send(createdItem);
    }
    catch (e) {
        res.send(e);
    }
});
exports.createItem = createItem;
const getItems = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let items;
    try {
        items = yield item_1.ItemModel.find({});
        if (!items) {
            return next(new NotFoundError_1.default((0, constants_1.notFoundListMessage)('items')));
        }
        res.send(items);
    }
    catch (err) {
        next(err);
    }
});
exports.getItems = getItems;
const getItemById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    let displayedItem;
    try {
        displayedItem = yield item_1.ItemModel.findById(id);
        if (!displayedItem) {
            return next(new NotFoundError_1.default((0, constants_1.notFoundMessage)('item')));
        }
        res.send(displayedItem);
    }
    catch (err) {
        next(err);
    }
});
exports.getItemById = getItemById;
const deleteItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    let deletedItem;
    try {
        deletedItem = yield item_1.ItemModel.findByIdAndDelete(id);
        if (!deletedItem) {
            return next(new NotFoundError_1.default((0, constants_1.notFoundMessage)('item')));
        }
        res.send(deletedItem);
    }
    catch (err) {
        next(err);
    }
});
exports.deleteItem = deleteItem;
