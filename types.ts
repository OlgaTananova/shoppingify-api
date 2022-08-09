import {Error, Schema, Types} from 'mongoose';

// Shopping List

export interface IShoppingList {
    heading: string,
    date: string,
    owner: Types.ObjectId,
    categories?: [
        {
            itemId: string,
            quantity: number
        }
    ]
    status: 'completed' | 'cancelled' | 'active'
}

export interface IShoppingListByDate {
    [key: string]: IShoppingList[]
}

export interface IItem {
    name: string,
    note?: string,
    image?: string,
    categoryId: Types.ObjectId,
    owner: Types.ObjectId,
}

export interface ICategory {
    category: string,
    items: Types.ObjectId[]
    owner: Types.ObjectId,
}

export interface IUser {
    name: string,
    email: string,
    password: string,
}

// Errors

export interface ErrorWithStatus extends Error {
    statusCode: number,
    code?: number,
}
