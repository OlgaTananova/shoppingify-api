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
exports.item = exports.category = exports.createAnotherUser = exports.auth = void 0;
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
exports.category = { category: 'veggies' };
exports.item = { name: 'tomato', note: 'Tomato is actually a berry', image: 'none', categoryId: '' };
