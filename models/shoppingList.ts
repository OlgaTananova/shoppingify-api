import {model, Schema} from 'mongoose';
import {IShoppingList} from '../types';

interface IShoppingListSchema extends IShoppingList, Document {

}
const shoppingListSchema = new Schema<IShoppingListSchema>({
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
       type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    items: [{
            itemId: {
                type: Schema.Types.ObjectId,
                ref: 'item',
                required: true,
                unique: true,
            },
            categoryId: {
                type: Schema.Types.ObjectId,
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

export const ShoppingListModel = model<IShoppingListSchema>('shoppingList', shoppingListSchema);
