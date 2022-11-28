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
let categoryId;
let itemId;
let itemId2;
let shoppingListId;
let cookie;
describe('Testing shopping lists endpoints', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connect(constants_1.MONGO_URI_TEST);
        const data = { name: 'user', email: "123@test.com", password: "123" };
        yield (0, main_1.createAnotherUser)(data);
        token = yield (0, main_1.auth)({ email: data.email, password: data.password });
        cookie = { "Cookie": `jwt=${token}` };
        const response = yield (0, supertest_1.default)(app_1.default).post('/categories').send(main_1.category).set(cookie);
        categoryId = response.body._id;
        main_1.item.categoryId = categoryId;
        main_1.item2.categoryId = categoryId;
        const requestFirstItem = yield (0, supertest_1.default)(app_1.default).post('/items').send(main_1.item).set(cookie);
        itemId = requestFirstItem.body.item._id;
        const requestSecondItem = yield (0, supertest_1.default)(app_1.default).post('/items').send(main_1.item2).set(cookie);
        itemId2 = requestSecondItem.body.item._id;
    }));
    test('Throwing 400 error if a user tries to create a new shopping list with invalid itemId', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).post('/shoppinglists').send({ itemId: 'jghghgh', categoryId: main_1.item.categoryId }).set(cookie);
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message');
    }));
    test('Successfully create a new shopping list', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).post('/shoppinglists').send({ itemId, categoryId: main_1.item.categoryId }).set(cookie);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('heading');
        shoppingListId = response.body._id;
    }));
    test('Throwing 409 error if a user tries to create another active shopping list', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).post('/shoppinglists').send({ itemId, categoryId: main_1.item.categoryId }).set(cookie);
        expect(response.status).toBe(409);
        expect(response.body).toEqual({ message: `The active shopping list already exists.` });
    }));
    test('Successfully getting all shopping lists', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get('/shoppinglists').set(cookie);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    }));
    test('Successfully adding a new item to the active shopping list', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = { shoppingListId: shoppingListId, categoryId: main_1.item2.categoryId, itemId: itemId2 };
        const response = yield (0, supertest_1.default)(app_1.default).put('/shoppinglists').send(data).set(cookie);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('items');
    }));
    test('Throwing 404 error if the active shopping list is not found', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = { shoppingListId: '62ec0d71a1e7179a512fc2fd', categoryId: main_1.item2.categoryId, itemId: itemId2 };
        const response = yield (0, supertest_1.default)(app_1.default).put('/shoppinglists').send(data).set(cookie);
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'The active shopping list is not found.' });
    }));
    test('Successfully changing quantity of the item in the shopping list', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = { shoppingListId: shoppingListId, itemId: itemId, quantity: 3 };
        const response = yield (0, supertest_1.default)(app_1.default).patch('/shoppinglists/updqty').send(data).set(cookie);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('heading');
    }));
    test('Throwing 404 error if a user tries to update the quantity of the item that is not in the SL', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = { shoppingListId: shoppingListId, itemId: '62ec0d71a1e7179a512fc2fd', quantity: 2 };
        const response = yield (0, supertest_1.default)(app_1.default).patch('/shoppinglists/updqty').send(data).set(cookie);
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'The active shopping list or item is not found.' });
    }));
    test('Successfully updating the status of the item in the SL', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = { shoppingListId: shoppingListId, itemId: itemId, status: 'completed' };
        const response = yield (0, supertest_1.default)(app_1.default).patch('/shoppinglists/updstatus').send(data).set(cookie);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('heading');
    }));
    test('Throwing 400 error if the user tries to update the item in the SL with an invalid status', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = { shoppingListId: shoppingListId, itemId: itemId, status: 'jghgh' };
        const response = yield (0, supertest_1.default)(app_1.default).patch('/shoppinglists/updstatus').send(data).set(cookie);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: '"status" must be one of [pending, completed]' });
    }));
    test('Successfully updating the active shopping list heading', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = { shoppingListId: shoppingListId, heading: 'Grocery' };
        const response = yield (0, supertest_1.default)(app_1.default).patch('/shoppinglists/updheading').send(data).set(cookie);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('heading');
    }));
    test('Throwing 400 error if the user tries to update the SL with an invalid heading', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = { shoppingListId: shoppingListId, heading: 'G' };
        const response = yield (0, supertest_1.default)(app_1.default).patch('/shoppinglists/updheading').send(data).set(cookie);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: '"heading" length must be at least 2 characters long' });
    }));
    test('Successfully deleting the item from the shopping list', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = { shoppingListId: shoppingListId, itemId: itemId };
        const response = yield (0, supertest_1.default)(app_1.default).delete('/shoppinglists').send(data).set(cookie);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id', shoppingListId);
    }));
    test('Throwing 404 error if the user tries to delete the not existing item from the SL', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = { shoppingListId: shoppingListId, itemId: itemId };
        const response = yield (0, supertest_1.default)(app_1.default).delete('/shoppinglists').send(data).set(cookie);
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'The item is not found.' });
    }));
    test('Successfully updating the shopping list status', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = { shoppingListId: shoppingListId, status: 'completed' };
        const response = yield (0, supertest_1.default)(app_1.default).patch('/shoppinglists/updslstatus').send(data).set(cookie);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('status', 'completed');
    }));
    test('Throwing 404 error if the user tries to update the status of the non-active SL', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = { shoppingListId: shoppingListId, status: 'completed' };
        const response = yield (0, supertest_1.default)(app_1.default).patch('/shoppinglists/updslstatus').send(data).set(cookie);
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'The active shopping list is not found.' });
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connection.db.dropCollection('users');
        yield mongoose_1.default.connection.db.dropCollection('categories');
        yield mongoose_1.default.connection.db.dropCollection('items');
        yield mongoose_1.default.connection.db.dropCollection('shoppinglists');
        yield mongoose_1.default.disconnect();
    }));
});
