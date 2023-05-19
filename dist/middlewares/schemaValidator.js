"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSLValidationSchema = exports.updateSalesTaxValidationSchema = exports.updateItemPriceInSLValidationSchema = exports.updateItemUnitsInSLValidationSchema = exports.mergeBillValidationSchema = exports.mergeSLValidationSchema = exports.updateSLStatusValidationSchema = exports.updateSLHeadingValidationSchema = exports.updateItemStatusInSLValidationSchema = exports.updateItemQtyInSLValidationSchema = exports.deleteItemFromSLValidationSchema = exports.addItemToShoppingListValidationSchema = exports.createShoppingListValidationSchema = exports.updateUserValidationSchema = exports.loginValidationSchema = exports.createUserValidationSchema = exports.deleteItemValidationSchema = exports.getItemByIdValidationSchema = exports.createItemValidationSchema = exports.createCategoryValidationSchema = void 0;
const celebrate_1 = require("celebrate");
exports.createCategoryValidationSchema = {
    body: celebrate_1.Joi.object().keys({
        category: celebrate_1.Joi.string().min(2).max(30).required()
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
exports.updateItemQtyInSLValidationSchema = {
    body: celebrate_1.Joi.object().keys({
        itemId: celebrate_1.Joi.string().hex().length(24).required(),
        shoppingListId: celebrate_1.Joi.string().hex().length(24).required(),
        quantity: celebrate_1.Joi.number().required(),
        pricePerUnit: celebrate_1.Joi.number().required(),
    })
};
exports.updateItemStatusInSLValidationSchema = {
    body: celebrate_1.Joi.object().keys({
        itemId: celebrate_1.Joi.string().hex().length(24).required(),
        shoppingListId: celebrate_1.Joi.string().hex().length(24).required(),
        status: celebrate_1.Joi.string().required().valid('pending', 'completed')
    })
};
exports.updateSLHeadingValidationSchema = {
    body: celebrate_1.Joi.object().keys({
        shoppingListId: celebrate_1.Joi.string().hex().length(24).required(),
        heading: celebrate_1.Joi.string().min(2).max(30).required(),
    })
};
exports.updateSLStatusValidationSchema = {
    body: celebrate_1.Joi.object().keys({
        shoppingListId: celebrate_1.Joi.string().hex().length(24).required(),
        status: celebrate_1.Joi.string().required().valid('completed', 'cancelled')
    })
};
exports.mergeSLValidationSchema = {
    body: celebrate_1.Joi.object().keys({
        items: celebrate_1.Joi.array().items(celebrate_1.Joi.object().keys({
            categoryId: celebrate_1.Joi.string().hex().length(24).required(),
            itemId: celebrate_1.Joi.string().hex().length(24).required(),
            quantity: celebrate_1.Joi.number().required(),
            status: celebrate_1.Joi.string().allow('pending', 'completed'),
            itemName: celebrate_1.Joi.string(),
            units: celebrate_1.Joi.string(),
            pricePerUnit: celebrate_1.Joi.number().required(),
            price: celebrate_1.Joi.number().required(),
            itemCategoryName: celebrate_1.Joi.string(),
        })),
        _id: celebrate_1.Joi.string().hex().length(24).required(),
        salesTax: celebrate_1.Joi.number().required(),
        date: celebrate_1.Joi.string().required(),
    })
};
exports.mergeBillValidationSchema = {
    body: celebrate_1.Joi.object().keys({
        items: celebrate_1.Joi.array().items(celebrate_1.Joi.object().keys({
            categoryId: celebrate_1.Joi.string().hex().length(24).required(),
            itemId: celebrate_1.Joi.string().hex().length(24).required(),
            itemName: celebrate_1.Joi.string(),
            quantity: celebrate_1.Joi.number().required(),
            status: celebrate_1.Joi.string().allow('pending', 'completed'),
            units: celebrate_1.Joi.string(),
            pricePerUnit: celebrate_1.Joi.number().required(),
            price: celebrate_1.Joi.number().required(),
        })),
        salesTax: celebrate_1.Joi.number().required(),
        date: celebrate_1.Joi.string().required(),
    })
};
exports.updateItemUnitsInSLValidationSchema = {
    body: celebrate_1.Joi.object().keys({
        itemId: celebrate_1.Joi.string().hex().length(24).required(),
        shoppingListId: celebrate_1.Joi.string().hex().length(24).required(),
        units: celebrate_1.Joi.string().required()
    })
};
exports.updateItemPriceInSLValidationSchema = {
    body: celebrate_1.Joi.object().keys({
        itemId: celebrate_1.Joi.string().hex().length(24).required(),
        shoppingListId: celebrate_1.Joi.string().hex().length(24).required(),
        pricePerUnit: celebrate_1.Joi.number().required(),
        quantity: celebrate_1.Joi.number().required(),
    })
};
exports.updateSalesTaxValidationSchema = {
    body: celebrate_1.Joi.object().keys({
        shoppingListId: celebrate_1.Joi.string().hex().length(24).required(),
        salesTax: celebrate_1.Joi.number().required(),
    })
};
exports.deleteSLValidationSchema = {
    body: celebrate_1.Joi.object().keys({
        id: celebrate_1.Joi.string().hex().length(24).required(),
    })
};
