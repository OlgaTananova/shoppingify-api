"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteItemFromSLValidationSchema = exports.addItemToShoppingListValidationSchema = exports.createShoppingListValidationSchema = exports.updateUserValidationSchema = exports.loginValidationSchema = exports.createUserValidationSchema = exports.deleteItemValidationSchema = exports.getItemByIdValidationSchema = exports.createItemValidationSchema = exports.deleteItemFromCategoryValidationSchema = exports.addItemToCategoryValidationSchema = exports.createCategoryValidationSchema = void 0;
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
exports.createUserValidationSchema = {
    body: celebrate_1.Joi.object().keys({
        name: celebrate_1.Joi.string().required().min(2).max(30),
        email: celebrate_1.Joi.string().required().email(),
        password: celebrate_1.Joi.string().required()
    })
};
exports.loginValidationSchema = {
    body: celebrate_1.Joi.object().keys({
        email: celebrate_1.Joi.string().required(),
        password: celebrate_1.Joi.string().required()
    })
};
exports.updateUserValidationSchema = {
    body: celebrate_1.Joi.object().keys({
        name: celebrate_1.Joi.string().required().min(2).max(30),
        email: celebrate_1.Joi.string().required().email()
    })
};
exports.createShoppingListValidationSchema = {
    body: celebrate_1.Joi.object().keys({
        categoryId: celebrate_1.Joi.string().hex().length(24).required(),
        itemId: celebrate_1.Joi.string().hex().length(24).required(),
    })
};
exports.addItemToShoppingListValidationSchema = {
    body: celebrate_1.Joi.object().keys({
        categoryId: celebrate_1.Joi.string().hex().length(24).required(),
        itemId: celebrate_1.Joi.string().hex().length(24).required(),
        shoppingListId: celebrate_1.Joi.string().hex().length(24).required(),
        quantity: celebrate_1.Joi.number(),
        status: celebrate_1.Joi.string().allow('pending', 'completed'),
    })
};
exports.deleteItemFromSLValidationSchema = {
    body: celebrate_1.Joi.object().keys({
        itemId: celebrate_1.Joi.string().hex().length(24).required(),
        shoppingListId: celebrate_1.Joi.string().hex().length(24).required(),
    })
};
