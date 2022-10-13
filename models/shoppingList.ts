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
                default: 'pending'
            }
        }],
    status: {
       type: String,
        required: true,
        default: 'active',
    }
});

export const ShoppingListModel = model<IShoppingListSchema>('shoppingList', shoppingListSchema);
