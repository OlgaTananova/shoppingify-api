"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemModel = exports.ItemSchema = void 0;
const mongoose_1 = require("mongoose");
exports.ItemSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    note: {
        type: String,
    },
    image: {
        type: String,
    },
    categoryId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'category',
        required: true,
    }
});
exports.ItemModel = (0, mongoose_1.model)('item', exports.ItemSchema);
