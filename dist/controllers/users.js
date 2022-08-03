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
exports.updateUserProfile = exports.getCurrentUser = exports.createUser = void 0;
const user_1 = require("../models/user");
const bcrypt_1 = __importDefault(require("bcrypt"));
const constants_1 = require("../constants");
const ConflictError_1 = __importDefault(require("../errors/ConflictError"));
const NotFoundError_1 = __importDefault(require("../errors/NotFoundError"));
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    try {
        const hash = yield bcrypt_1.default.hash(password, 10);
        yield user_1.UserModel.create({ name, email, password: hash });
        res.status(constants_1.createdStatusCode).send({ name, email });
    }
    catch (err) {
        // @ts-ignore
        if (err.code === 11000) {
            return next(new ConflictError_1.default(JSON.stringify({ message: (0, constants_1.conflictMessage)('user') })));
        }
        next(err);
    }
});
exports.createUser = createUser;
const getCurrentUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = (req.user && typeof req.user === 'object') && req.user._id;
    let user;
    try {
        user = yield user_1.UserModel.findById(id);
        if (!user) {
            return next(new NotFoundError_1.default(JSON.stringify({ message: (0, constants_1.notFoundMessage)('user') })));
        }
        res.send({ name: user.name, email: user.email });
    }
    catch (err) {
        next(err);
    }
});
exports.getCurrentUser = getCurrentUser;
const updateUserProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = (req.user && typeof req.user === 'object') && req.user._id;
    const { name, email } = req.body;
    let updatedUser;
    try {
        updatedUser = yield user_1.UserModel.findByIdAndUpdate(id, { name, email }, { new: true });
        if (!updatedUser) {
            return next(new NotFoundError_1.default(JSON.stringify({ message: (0, constants_1.notFoundMessage)('user') })));
        }
        res.send({ message: constants_1.userProfileUpdated, name: updatedUser.name, email: updatedUser.email });
    }
    catch (err) {
        // @ts-ignore
        if (err.code === 11000) {
            return next(new ConflictError_1.default(JSON.stringify({ message: constants_1.notUniqueEmailConflictMessage })));
        }
        next(err);
    }
});
exports.updateUserProfile = updateUserProfile;
