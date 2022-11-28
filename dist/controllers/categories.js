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
exports.getCategories = exports.createCategory = void 0;
const category_1 = require("../models/category");
const ConflictError_1 = __importDefault(require("../errors/ConflictError"));
const constants_1 = require("../constants");
const NotFoundError_1 = __importDefault(require("../errors/NotFoundError"));
const createCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { category } = req.body;
    const owner = (req['user'] && typeof req['user'] === 'object') && req['user']._id;
    let existingCategory;
    let createdCategory;
    try {
        existingCategory = yield category_1.CategoryModel.findOne({ owner, category });
        if (existingCategory) {
            return next(new ConflictError_1.default((0, constants_1.conflictMessage)('category')));
        }
        createdCategory = yield category_1.CategoryModel.create({ category, owner });
        res.send(createdCategory);
    }
    catch (err) {
        next(err);
    }
});
exports.createCategory = createCategory;
const getCategories = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let categories;
    const owner = (req.user && typeof req.user === 'object') && req.user._id;
    try {
        categories = yield category_1.CategoryModel.find({ owner });
        if (!categories) {
            return next(new NotFoundError_1.default((0, constants_1.notFoundListMessage)('categories')));
        }
        res.send(categories);
    }
    catch (err) {
        next(err);
    }
});
exports.getCategories = getCategories;
