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
const mongoose_1 = __importDefault(require("mongoose"));
const constants_1 = require("../../constants");
const main_1 = require("../../fixtures/main");
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../app"));
let token;
let cookies;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connect(constants_1.MONGO_URI_TEST);
    yield (0, main_1.createAnotherUser)(main_1.user);
    token = yield (0, main_1.auth)({ email: main_1.user.email, password: main_1.user.password });
    cookies = { "Cookie": `jwt=${token}` };
}));
describe('Testing /categories endpoints', () => {
    test('Successfully create a new category at /categories endpoint.', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).post('/categories').send(main_1.category).set(cookies);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('category', main_1.category.category);
    }));
    test('Throwing 401 error if there is no valid token (the user is not authorized).', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).post('/categories').send(main_1.category);
        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: 'Access is restricted. Please log in or sign up.' });
    }));
    test('Throwing 400 error if the category name was not sent. ', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).post('/categories').set(cookies);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: "\"category\" is required" });
    }));
    test('Throwing 400 error if the category name is too short. ', () => __awaiter(void 0, void 0, void 0, function* () {
        const category = { category: 'v' };
        const response = yield (0, supertest_1.default)(app_1.default).post('/categories').send(category).set(cookies);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: "\"category\" length must be at least 2 characters long" });
    }));
    test('Throwing 400 error if the category name is empty. ', () => __awaiter(void 0, void 0, void 0, function* () {
        const category = { category: '' };
        const response = yield (0, supertest_1.default)(app_1.default).post('/categories').send(category).set(cookies);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: "\"category\" is not allowed to be empty" });
    }));
    test('Throwing 400 error if the category name is too long. ', () => __awaiter(void 0, void 0, void 0, function* () {
        const category = { category: 'khhfgffgfhgjghgfdfddmdkdjfhgfgbfnf' };
        const response = yield (0, supertest_1.default)(app_1.default).post('/categories').send(category).set(cookies);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: "\"category\" length must be less than or equal to 30 characters long" });
    }));
    test('Successfully upload the categories', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get('/categories').set(cookies);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    }));
    test('Throwing 401 error if there is no valid token (the user is not authorized).', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get('/categories');
        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: 'Access is restricted. Please log in or sign up.' });
    }));
});
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.db.dropCollection('users');
    yield mongoose_1.default.connection.db.dropCollection('categories');
    yield mongoose_1.default.connection.db.dropCollection('items');
    yield mongoose_1.default.disconnect();
}));
