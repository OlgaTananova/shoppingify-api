import mongoose from "mongoose";
import {MONGO_URI_TEST} from "../../constants";
import {auth, createAnotherUser, user, category} from "../../fixtures/main";
import request from "supertest";
import app from "../../app";

let token: string;
let cookies: { "Cookie": string };

beforeAll(async () => {
    await mongoose.connect(MONGO_URI_TEST);
    await createAnotherUser(user);
    token = await auth({email: user.email, password: user.password});
    cookies = {"Cookie": `jwt=${token}`};
});

describe('Testing /categories endpoints', () => {

    test('Successfully create a new category at /categories endpoint.', async () => {
        const response = await request(app).post('/categories').send(category).set(cookies);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('category', category.category);
    });

    test('Throwing 401 error if there is no valid token (the user is not authorized).', async () => {
        const response = await request(app).post('/categories').send(category)
        expect(response.status).toBe(401);
        expect(response.body).toEqual({message: 'Access is restricted. Please log in or sign up.'});
    });

    test('Throwing 400 error if the category name was not sent. ', async () => {
        const response = await request(app).post('/categories').set(cookies);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({message: "\"category\" is required"});
    });

    test('Throwing 400 error if the category name is too short. ', async () => {
        const category = {category: 'v'}
        const response = await request(app).post('/categories').send(category).set(cookies);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({message: "\"category\" length must be at least 2 characters long"});
    });

    test('Throwing 400 error if the category name is empty. ', async () => {
        const category = {category: ''}
        const response = await request(app).post('/categories').send(category).set(cookies);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({message: "\"category\" is not allowed to be empty"});
    });

    test('Throwing 400 error if the category name is too long. ', async () => {
        const category = {category: 'khhfgffgfhgjghgfdfddmdkdjfhgfgbfnf'}
        const response = await request(app).post('/categories').send(category).set(cookies);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({message: "\"category\" length must be less than or equal to 30 characters long"});
    });

    test('Successfully upload the categories', async () => {
        const response = await request(app).get('/categories').set(cookies);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    test('Throwing 401 error if there is no valid token (the user is not authorized).', async () => {
        const response = await request(app).get('/categories')
        expect(response.status).toBe(401);
        expect(response.body).toEqual({message: 'Access is restricted. Please log in or sign up.'});
    });

});

afterAll(async () => {
    await mongoose.connection.db.dropCollection('users');
    await mongoose.connection.db.dropCollection('categories');
    await mongoose.connection.db.dropCollection('items');
    await mongoose.disconnect();
});

