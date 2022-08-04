import {model, Schema} from "mongoose";
import {ICategory} from "../types";

const CategorySchema = new Schema<ICategory>({
    category: {
        type: String,
        required: true,
    },
    items: {
        type: [Schema.Types.ObjectId],
        ref: 'item',
        default: []
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    }
});

export const CategoryModel = model<ICategory>('category', CategorySchema);
