import {Error, Schema, Types} from 'mongoose';

export interface IEditProfile {
    isEditProfile: boolean
}

export interface IItemInfo {
    isItemInfoOpen: boolean
}

export interface IShopping {
    isAddItemFormOpened: boolean,
    isEditShoppingList: boolean,
    isShoppingListEmpty: boolean,
}
export interface IShoppingCategory {
    name: string,
    items: [string, number][]
}
export interface IShoppingList {
    id: string,
    heading: string,
    date: Date,
    owner: string,
    categories: IShoppingCategory[],
    status: string
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
