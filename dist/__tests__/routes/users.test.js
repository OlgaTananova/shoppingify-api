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
const supertest_1 = __importDefault(require("supertest"));
const constants_1 = require("../../constants");
const app_1 = __importDefault(require("../../app"));
const main_1 = require("../../fixtures/main");
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connect(constants_1.MONGO_URI_TEST);
}));
describe('Testing users endpoints', () => {
    describe('Testing user\'s \signup endpoint', () => {
        test('Signing up a new user with the correct user data', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default).post('/signup').send(main_1.user).expect(201);
            expect(response.body.name).toBe(main_1.user.name);
            expect(response.body.email).toBe(main_1.user.email);
        }));
        test('Throwing 409 error if a new user tries to register with an email that already exists', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default).post('/signup').send(main_1.user).expect(409);
            expect(response.body).toEqual({ message: 'The user already exists.' });
        }));
        test('Throwing 400 error if a new user tries to register with a not valid name', () => __awaiter(void 0, void 0, void 0, function* () {
            const data = { name: 'g', email: '123@test.com', password: "123" };
            const response = yield (0, supertest_1.default)(app_1.default).post('/signup').send(data).expect(400);
            expect(response.body).toEqual({ message: "\"name\" length must be at least 2 characters long" });
        }));
        test('Throwing 400 error if a new user tries to register with a not valid email at /signup route', () => __awaiter(void 0, void 0, void 0, function* () {
            const data = { name: 'User', email: '123@test', password: "123" };
            const response = yield (0, supertest_1.default)(app_1.default).post('/signup').send(data).expect(400);
            expect(response.body).toEqual({ message: "\"email\" must be a valid email" });
        }));
        test('Throwing 400 error if a new user tries to register with an empty password at /signup route', () => __awaiter(void 0, void 0, void 0, function* () {
            const data = { name: 'User', email: '123@test.com', password: "" };
            const response = yield (0, supertest_1.default)(app_1.default).post('/signup').send(data);
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ message: "\"password\" is not allowed to be empty" });
        }));
        test('Throwing 400 error if a new user tries to register with an empty name', () => __awaiter(void 0, void 0, void 0, function* () {
            const data = { name: '', email: '123@test.com', password: "123" };
            const response = yield (0, supertest_1.default)(app_1.default).post('/signup').send(data);
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ message: "\"name\" is not allowed to be empty" });
        }));
        test('Throwing 400 error if a new user tries to register with an empty email', () => __awaiter(void 0, void 0, void 0, function* () {
            const data = { name: 'User', email: '', password: "123" };
            const response = yield (0, supertest_1.default)(app_1.default).post('/signup').send(data);
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ message: "\"email\" is not allowed to be empty" });
        }));
        test('Throwing 400 error if a new user tries to register without a name', () => __awaiter(void 0, void 0, void 0, function* () {
            const data = { email: '123@test.com', password: "123" };
            const response = yield (0, supertest_1.default)(app_1.default).post('/signup').send(data);
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ message: "\"name\" is required" });
        }));
        test('Throwing 400 error if a new user tries to register without an email', () => __awaiter(void 0, void 0, void 0, function* () {
            const data = { name: 'User', password: "123" };
            const response = yield (0, supertest_1.default)(app_1.default).post('/signup').send(data);
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ message: "\"email\" is required" });
        }));
        test('Throwing 400 error if a new user tries to register without a password', () => __awaiter(void 0, void 0, void 0, function* () {
            const data = { name: 'User', email: '123@test.com' };
            const response = yield (0, supertest_1.default)(app_1.default).post('/signup').send(data);
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ message: "\"password\" is required" });
        }));
    });
    describe('Testing user\'s \login endpoint', () => {
        test('Successfully login into the system with the given email and password', () => __awaiter(void 0, void 0, void 0, function* () {
            const data = { email: '123@test.com', password: '123' };
            const response = yield (0, supertest_1.default)(app_1.default).post('/login').send(data);
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: "Token was sent to cookie." });
        }));
        test('Throwing 401 error if the user enters incorrect email', () => __awaiter(void 0, void 0, void 0, function* () {
            const data = { email: "1234@test.com", password: "123" };
            const response = yield (0, supertest_1.default)(app_1.default).post('/login').send(data);
            expect(response.status).toBe(401);
            expect(response.body).toEqual({ message: "You typed incorrect email or password. Please, try again." });
        }));
        test('Throwing 401 error if the user enters incorrect password', () => __awaiter(void 0, void 0, void 0, function* () {
            const data = { email: "123@test.com", password: "12" };
            const response = yield (0, supertest_1.default)(app_1.default).post('/login').send(data);
            expect(response.status).toBe(401);
            expect(response.body).toEqual({ message: "You typed incorrect email or password. Please, try again." });
        }));
    });
    describe('Testing user\'s /users/me endpoints', () => {
        const data = { name: 'user', email: "123@test.com", password: "123" };
        let token;
        let cookies;
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            token = yield (0, main_1.auth)({ email: data.email, password: data.password });
            cookies = { "Cookie": `jwt=${token}` };
        }));
        test('Successfully getting the current user at /users/me endpoint', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default).get("/users/me").set(cookies);
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ name: data.name, email: data.email });
        }));
        test('Successfully updating the user\'s name and email', () => __awaiter(void 0, void 0, void 0, function* () {
            const data = { name: "User1", email: "1235@test.com" };
            const response = yield (0, supertest_1.default)(app_1.default).patch('/users/me').send(data).set(cookies);
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                message: 'User\'s profile was successfully updated.',
                name: data.name, email: data.email
            });
        }));
        test('Throwing 409 error if the user tries to update his email with another not unique email', () => __awaiter(void 0, void 0, void 0, function* () {
            const data = { name: "User", email: "1234@test.com" };
            yield (0, main_1.createAnotherUser)({ name: "User2", email: "1234@test.com", password: "123" });
            const response = yield (0, supertest_1.default)(app_1.default).patch("/users/me").send(data).set(cookies);
            expect(response.status).toBe(409);
            expect(response.body).toEqual({ message: 'User with this email already exists.' });
        }));
        test('Successfully logging out at /logout endpoint', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default).post('/logout').set(cookies);
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: 'Token was deleted.' });
        }));
    });
});
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.db.dropCollection('users');
    yield mongoose_1.default.disconnect();
}));
