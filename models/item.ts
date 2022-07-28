import {Document,  Schema, Types, model} from "mongoose";

export interface Item extends Document {
    name: string,
    note?: string,
    image?: string,
    categoryId: Schema.Types.ObjectId
}

export const ItemSchema: Schema = new Schema<Item>({
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
    }
})

export const ItemModel = model<Item>('item', ItemSchema);
