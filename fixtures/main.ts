import {UserModel} from "../models/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export async function auth({email, password}: { email: string, password: string }) {
    const User = await UserModel.findUserByCredentials(email, password);
    const token = jwt.sign({_id: User._id}, 'some-secret-key', {expiresIn: '7d'});
    return token;
}

export async function createAnotherUser({name, email, password}: { name: string, email: string, password: string }) {
    const hash = await bcrypt.hash(password, 10);
    const anotherUser = UserModel.create({name, email, password: hash});
    return anotherUser;
}

interface Item {
    name: string,
    note?: string,
    image?: string,
    categoryId: string,
    _id?: string;
}

export let user = {name: 'user', email: "123@test.com", password: "123"};
export let category = {category: 'veggies'};
export let item: Item = {name: 'tomato', note: 'Tomato is actually a berry', image: 'none', categoryId: ''};
export let item2: Item = {name: 'Potato', categoryId: ''};
export let randomId = "62ec0d71a1e7179a512fc2fd";
export let invalidId = 'jggfgdffd';

export let uploadedBillText = 'Your order from Super King was placed on May 31st, 2023 and delivered on May\n' +
    '31st, 2023 at 12:10 PM\n' +
    '7 Items Found 1 Adjustment\n' +
    'ADJUST M ENTS (SUPER KING) 1\n' +
    'NOT CHARGED\n' +
    'The Honest Company Kids Super Fruit Punch Organic Fruit\n' +
    'Juice (8 x 6.75 fl oz)\n' +
    'Refunded 1\n' +
    '$0.00\n' +
    'ITE M S FOUND (SUPER KING) 7\n' +
    'BAKERY\n' +
    'Lord de Pastry Nazook Pastry (14 oz)\n' +
    '1 x $8.49\n' +
    '$8.49\n' +
    'BEVERAGES\n' +
    'The Honest Company Kids Appley Ever After Apple Organic\n' +
    'Fruit Juice (8 x 6.75 oz)\n' +
    '1 x $5.49\n' +
    '$5.49\n' +
    'Items Subtotal $72.17\n' +
    'Checkout Bag Fee $0.30\n' +
    'Tip $6.00\n' +
    'Service Fee $6.50\n' +
    'Total $84.97\n' +
    'Free Delivery!\n' +
    'American Express ending in 1007\n' +
    'Original Charge $84.97\n' +
    'Your ApplePay card was temporarily authorized for $95.18. You should see\n' +
    'the hold removed and a final charge reflected on your statement within 7\n' +
    'business days of order completion depending on your bank’s policies.\n' +
    'Learn more\n' +
    'Total Charged $84.97';

export let uploadedList = {
    "items": [
        {
            categoryId: '',
            itemId: '',
            itemName: '',
            quantity: 2,
            status: 'pending',
            units: 'pcs',
            pricePerUnit: 0.5,
            price: 1,
        }],
    'salesTax': 0.1,
    'date': 'May 31st, 2023',
}
