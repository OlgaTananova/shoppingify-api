import {model, Schema, Types, } from "mongoose";


interface Category extends Document {
    category: string,
    items?: Types.DocumentArray<Schema.Types.ObjectId>,

}

const CategorySchema = new Schema<Category>({
    category: {
        type: String,
        required: true,
        unique: true,
    },
    items: {
        type: [Schema.Types.ObjectId],
        ref: 'item',
        default: []
    }
});

export const CategoryModel = model<Category>('category', CategorySchema);
