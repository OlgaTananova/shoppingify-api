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
exports.logout = exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../models/user");
const UnauthorizedError_1 = __importDefault(require("../errors/UnauthorizedError"));
const constants_1 = require("../constants");
const bcrypt_1 = __importDefault(require("bcrypt"));
const { NODE_ENV, JWT_SECRET } = process.env;
const secretKey = NODE_ENV === 'production' && JWT_SECRET || constants_1.publicKey;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield user_1.UserModel.findUserByCredentials(email, password);
        if (!user) {
            return next(new UnauthorizedError_1.default(constants_1.inCorrectEmailOrPasswordMessage));
        }
        const matched = yield bcrypt_1.default.compare(password, user.password);
        if (!matched) {
            return next(new UnauthorizedError_1.default(constants_1.inCorrectEmailOrPasswordMessage));
        }
        const token = jsonwebtoken_1.default.sign({ _id: user._id }, secretKey, { expiresIn: '7d' });
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 6.048e+8,
            sameSite: 'none',
            secure: true,
        });
        res.send({ message: constants_1.tokenSendMessage });
    }
    catch (err) {
        next(err);
    }
});
exports.login = login;
const logout = (req, res) => {
    res.clearCookie('jwt').send({ message: constants_1.tokenDeleted });
};
exports.logout = logout;
