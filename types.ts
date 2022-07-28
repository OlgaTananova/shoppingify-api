import {Types} from 'mongoose';

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
    _id: Types.ObjectId,
    name: string,
    note: string,
    image: string,
    categoryId: Types.ObjectId
}

export interface ICategory {
    category: string,
    _id: Types.ObjectId,
    items: IItem[]
}
