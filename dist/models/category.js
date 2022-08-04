"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryModel = void 0;
const mongoose_1 = require("mongoose");
const CategorySchema = new mongoose_1.Schema({
    category: {
        type: String,
        required: true,
    },
    items: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: 'item',
        default: []
    },
    owner: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    }
});
exports.CategoryModel = (0, mongoose_1.model)('category', CategorySchema);
