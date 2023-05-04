"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShoppingListModel = void 0;
const mongoose_1 = require("mongoose");
const shoppingListSchema = new mongoose_1.Schema({
    heading: {
        type: String,
        required: true,
        default: 'Shopping List'
    },
    date: {
        type: String,
        required: true,
        default: new Date(Date.now()).toISOString()
    },
    owner: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    items: [{
            itemId: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'item',
                required: true,
                unique: true,
            },
            categoryId: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'category',
                required: true,
            },
            quantity: {
                type: Number,
                default: 1,
                required: true
            },
            status: {
                type: String,
                enum: ['pending', 'completed'],
                default: 'pending'
            },
            units: {
                type: String,
                default: 'pcs',
            },
            pricePerUnit: {
                type: Number,
                default: 0,
            },
            price: {
                type: Number,
                default: 0,
            }
        }],
    status: {
        type: String,
        required: true,
        default: 'active',
    },
    salesTax: {
        type: Number,
        default: 0,
    },
});
exports.ShoppingListModel = (0, mongoose_1.model)('shoppingList', shoppingListSchema);
