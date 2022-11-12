import mongoose from "mongoose";
import {MONGO_URI_TEST} from "../../constants";
import {auth, createAnotherUser, item, category, notFoundItemId, invalidItemId} from "../../fixtures/main";
import request from "supertest";
import app from "../../app";

let token: string;
let updatedCategory: { _id: string; };
let itemId: string;

beforeAll(async () => {
    await mongoose.connect(MONGO_URI_TEST);
    const data = {name: 'user', email: "123@test.com", password: "123"};
    await createAnotherUser(data);
    token = await auth({email: data.email, password: data.password});
});

describe('Testing /categories endpoints', () => {

    test('Successfully create a new category at /categories endpoint.', async () => {
        const response = await request(app).post('/categories').send(category).set({"Cookie": `jwt=${token}`})
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('category', category.category);
        updatedCategory = response.body;
    });

    test('Throwing 401 error if there is no valid token (the user is not authorized).', async () => {
        const response = await request(app).post('/categories').send(category)
        expect(response.status).toBe(401);
        expect(response.body).toEqual({message: 'Access is restricted. Please log in or sign up.'});
    });

    test('Throwing 400 error if the category name was not sent. ', async () => {
        const response = await request(app).post('/categories').set({"Cookie": `jwt=${token}`})
        expect(response.status).toBe(400);
        expect(response.body).toEqual({message: "\"category\" is required"});
    });

    test('Throwing 400 error if the category name is too short. ', async () => {
        const category = {category: 'v'}
        const response = await request(app).post('/categories').send(category).set({"Cookie": `jwt=${token}`})
        expect(response.status).toBe(400);
        expect(response.body).toEqual({message: "\"category\" length must be at least 2 characters long"});
    });

    test('Throwing 400 error if the category name is empty. ', async () => {
        const category = {category: ''}
        const response = await request(app).post('/categories').send(category).set({"Cookie": `jwt=${token}`})
        expect(response.status).toBe(400);
        expect(response.body).toEqual({message: "\"category\" is not allowed to be empty"});
    });

    test('Throwing 400 error if the category name is too long. ', async () => {
        const category = {category: 'khhfgffgfhgjghgfdfddmdkdjfhgfgbfnf'}
        const response = await request(app).post('/categories').send(category).set({"Cookie": `jwt=${token}`})
        expect(response.status).toBe(400);
        expect(response.body).toEqual({message: "\"category\" length must be less than or equal to 30 characters long"});
    });

    test('Successfully upload the categories', async () => {
        const response = await request(app).get('/categories').set({"Cookie": `jwt=${token}`})
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    test('Throwing 401 error if there is no valid token (the user is not authorized).', async () => {
        const response = await request(app).get('/categories')
        expect(response.status).toBe(401);
        expect(response.body).toEqual({message: 'Access is restricted. Please log in or sign up.'});
    });
    test('Successfully create an item in the category', async ()=> {
        item.categoryId = updatedCategory._id;
        const response = await request(app).post('/items').send(item).set({"Cookie": `jwt=${token}`});
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('item');
        expect(response.body).toHaveProperty('category');
    });
    test('Throwing 409 error if a user tries to create an already existed item', async ()=>{
        const response = await request(app).post('/items').send(item).set({"Cookie": `jwt=${token}`});
        expect(response.status).toBe(409);
        expect(response.body).toEqual({message: 'The item already exists.'});
    });
    test('Throwing 404 error if a user tries to create an item with an invalid category', async ()=>{
        let invalidItem = {
            categoryId: "62ec0d71a1e7179a512fc2fd",
            name: 'Potato'
        };
        const response = await request(app).post('/items').send(invalidItem).set({"Cookie": `jwt=${token}`});
        expect(response.status).toBe(404);
        expect(response.body).toEqual({message: 'The category is not found.'})
    });
    test('Successfully getting items', async ()=>{
        const response = await request(app).get('/items').set({"Cookie": `jwt=${token}`});
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        itemId = response.body[0]._id;
    });
    test('Successfully uploading an item by id', async ()=>{
        const response = await request(app).get(`/items/${itemId}`).set({"Cookie": `jwt=${token}`});
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('name');
    });
    test('Throwing 404 error if a user tries to get an item with incorrect id', async () => {
        const response = await request(app).get(`/items/${notFoundItemId}`).set({"Cookie": `jwt=${token}`});
        expect(response.status).toBe(404);
        expect(response.body).toEqual({message: `The item is not found.`});
    });
    test('Throwing 400 error if a user tries to get an item with an invalid id', async () => {
        const response = await request(app).get(`/items/${invalidItemId}`).set({"Cookie": `jwt=${token}`});
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message');
    });
    test('Successfully deleting the item', async ()=>{
        const response = await request(app).del(`/items/${itemId}`).set({"Cookie": `jwt=${token}`});
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('item');
    });
    test('Throwing 404 error if a user tries to delete an item not found in the base', async ()=>{
        const response = await request(app).del(`/items/${notFoundItemId}`).set({"Cookie": `jwt=${token}`});
        expect(response.status).toBe(404);
        expect(response.body).toEqual({message: 'The item is not found.'});
    });
});

afterAll(async () => {
    await mongoose.connection.db.dropCollection('users');
    await mongoose.connection.db.dropCollection('categories');
    await mongoose.connection.db.dropCollection('items');
    await mongoose.disconnect();
});

