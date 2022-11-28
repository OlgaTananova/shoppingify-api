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
    const responseFromCategory = yield (0, supertest_1.default)(app_1.default).post('/categories').send(main_1.category).set(cookies);
    main_1.item.categoryId = responseFromCategory.body._id;
}));
describe('Testing items endpoints', () => {
    test('Successfully create an item in the category', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).post('/items').send(main_1.item).set(cookies);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('item');
        expect(response.body).toHaveProperty('category');
        main_1.item._id = response.body.item._id;
    }));
    test('Throwing 409 error if a user tries to create an already existed item', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = { name: main_1.item.name, categoryId: main_1.item.categoryId };
        const response = yield (0, supertest_1.default)(app_1.default).post('/items').send(data).set(cookies);
        expect(response.status).toBe(409);
        expect(response.body).toEqual({ message: 'The item already exists.' });
    }));
    test('Throwing 404 error if a user tries to create an item with an invalid category', () => __awaiter(void 0, void 0, void 0, function* () {
        let invalidItem = {
            categoryId: main_1.randomId,
            name: 'Potato'
        };
        const response = yield (0, supertest_1.default)(app_1.default).post('/items').send(invalidItem).set(cookies);
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'The category is not found.' });
    }));
    test('Successfully getting items', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get('/items').set(cookies);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    }));
    test('Successfully uploading an item by id', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get(`/items/${main_1.item._id}`).set(cookies);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id', main_1.item._id);
    }));
    test('Throwing 404 error if a user tries to get an item with incorrect id', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get(`/items/${main_1.randomId}`).set(cookies);
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: `The item is not found.` });
    }));
    test('Throwing 400 error if a user tries to get an item with an invalid id', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get(`/items/${main_1.invalidId}`).set(cookies);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: '"id" must only contain hexadecimal characters' });
    }));
    test('Successfully deleting the item', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).del(`/items/${main_1.item._id}`).set(cookies);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('item._id', main_1.item._id);
    }));
    test('Throwing 404 error if a user tries to delete an item not found in the base', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).del(`/items/${main_1.randomId}`).set(cookies);
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'The item is not found.' });
    }));
});
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.db.dropCollection('users');
    yield mongoose_1.default.connection.db.dropCollection('categories');
    yield mongoose_1.default.connection.db.dropCollection('items');
    yield mongoose_1.default.disconnect();
}));
