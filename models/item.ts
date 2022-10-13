import {Schema, model} from "mongoose";
import {IItem} from "../types";

export const ItemSchema: Schema = new Schema<IItem>({
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
        type: Schema.Types.ObjectId,
        ref: 'category',
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    }
})

export const ItemModel = model<IItem>('item', ItemSchema);
