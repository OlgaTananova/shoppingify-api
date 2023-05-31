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
exports.auth = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: __dirname + '/.env' });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UnauthorizedError_1 = __importDefault(require("../errors/UnauthorizedError"));
const constants_1 = require("../constants");
let NODE_ENV = process.env["NODE_ENV"] || '';
let JWT_SECRET = process.env["JWT_SECRET"];
const secretKey = NODE_ENV === 'production' && JWT_SECRET || constants_1.publicKey;
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.jwt;
    // console.log(token);
    // const url = req.url;
    // if (url === 'http://localhost:3000' || 'http://172.20.10.6:3000' || 'http://192.168.0.193:3000') {
    //     req.user = {_id: '639f99ac8639ee8000f0ac90', iat: 1621576800, exp: 1622181600};
    //     next();
    // } else {
    if (!token) {
        return next(new UnauthorizedError_1.default(constants_1.unauthorizedMessage));
    }
    req.user = jsonwebtoken_1.default.verify(token, secretKey);
    next();
    // }
});
exports.auth = auth;
