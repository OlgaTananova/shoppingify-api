"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadedList = exports.uploadedBillText = exports.invalidId = exports.randomId = exports.item2 = exports.item = exports.category = exports.user = exports.createAnotherUser = exports.auth = void 0;
const user_1 = require("../models/user");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
function auth({ email, password }) {
    return __awaiter(this, void 0, void 0, function* () {
        const User = yield user_1.UserModel.findUserByCredentials(email, password);
        const token = jsonwebtoken_1.default.sign({ _id: User._id }, 'some-secret-key', { expiresIn: '7d' });
        return token;
    });
}
exports.auth = auth;
function createAnotherUser({ name, email, password }) {
    return __awaiter(this, void 0, void 0, function* () {
        const hash = yield bcrypt_1.default.hash(password, 10);
        const anotherUser = user_1.UserModel.create({ name, email, password: hash });
        return anotherUser;
    });
}
exports.createAnotherUser = createAnotherUser;
exports.user = { name: 'user', email: "123@test.com", password: "123" };
exports.category = { category: 'veggies' };
exports.item = { name: 'tomato', note: 'Tomato is actually a berry', image: 'none', categoryId: '' };
exports.item2 = { name: 'Potato', categoryId: '' };
exports.randomId = "62ec0d71a1e7179a512fc2fd";
exports.invalidId = 'jggfgdffd';
exports.uploadedBillText = 'Your order from Super King was placed on May 31st, 2023 and delivered on May\n' +
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
exports.uploadedList = {
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
        }
    ],
    'salesTax': 0.1,
    'date': 'May 31st, 2023',
};
