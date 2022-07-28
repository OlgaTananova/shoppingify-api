"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteItemValidationSchema = exports.getItemByIdValidationSchema = exports.createItemValidationSchema = exports.deleteItemFromCategoryValidationSchema = exports.addItemToCategoryValidationSchema = exports.createCategoryValidationSchema = void 0;
const celebrate_1 = require("celebrate");
exports.createCategoryValidationSchema = {
    body: celebrate_1.Joi.object().keys({
        category: celebrate_1.Joi.string().min(2).max(30).required()
    })
};
exports.addItemToCategoryValidationSchema = {
    body: celebrate_1.Joi.object().keys({
        _id: celebrate_1.Joi.string().hex().length(24).required(),
        categoryId: celebrate_1.Joi.string().hex().length(24).required()
    })
};
exports.deleteItemFromCategoryValidationSchema = {
    body: celebrate_1.Joi.object().keys({
        _id: celebrate_1.Joi.string().hex().length(24).required(),
        categoryId: celebrate_1.Joi.string().hex().length(24).required()
    })
};
exports.createItemValidationSchema = {
    body: celebrate_1.Joi.object().keys({
        name: celebrate_1.Joi.string().min(2).max(30).required(),
        note: celebrate_1.Joi.string().allow('', null),
        image: celebrate_1.Joi.string().allow('', null),
        categoryId: celebrate_1.Joi.string().hex().length(24).required()
    })
};
exports.getItemByIdValidationSchema = {
    params: celebrate_1.Joi.object().keys({
        id: celebrate_1.Joi.string().hex().length(24).required()
    })
};
exports.deleteItemValidationSchema = {
    params: celebrate_1.Joi.object().keys({
        id: celebrate_1.Joi.string().hex().length(24).required()
    })
};
