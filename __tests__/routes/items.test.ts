import mongoose from "mongoose";
import {MONGO_URI_TEST} from "../../constants";
import {auth, createAnotherUser, user, item, category, randomId, invalidId} from "../../fixtures/main";
import request from "supertest";
import app from "../../app";

let token: string;
let cookies: { "Cookie": string };

beforeAll(async () => {
    await mongoose.connect(MONGO_URI_TEST);
    await createAnotherUser(user);
    token = await auth({email: user.email, password: user.password});
    cookies = {"Cookie": `jwt=${token}`};
    const responseFromCategory = await request(app).post('/categories').send(category).set(cookies);
    item.categoryId = responseFromCategory.body._id;
});

describe('Testing items endpoints', () => {

    test('Successfully create an item in the category', async () => {
        const response = await request(app).post('/items').send(item).set(cookies);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('item');
        expect(response.body).toHaveProperty('category');
        item._id = response.body.item._id;
    });

    test('Throwing 409 error if a user tries to create an already existed item', async () => {
        const data = {name: item.name, categoryId: item.categoryId}
        const response = await request(app).post('/items').send(data).set(cookies);
        expect(response.status).toBe(409);
        expect(response.body).toEqual({message: 'The item already exists.'});
    });

    test('Throwing 404 error if a user tries to create an item with an invalid category', async () => {
        let invalidItem = {
            categoryId: randomId,
            name: 'Potato'
        };
        const response = await request(app).post('/items').send(invalidItem).set(cookies);
        expect(response.status).toBe(404);
        expect(response.body).toEqual({message: 'The category is not found.'})
    });

    test('Successfully getting items', async () => {
        const response = await request(app).get('/items').set(cookies);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    test('Successfully uploading an item by id', async () => {
        const response = await request(app).get(`/items/${item._id}`).set(cookies);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id', item._id);
    });

    test('Throwing 404 error if a user tries to get an item with incorrect id', async () => {
        const response = await request(app).get(`/items/${randomId}`).set(cookies);
        expect(response.status).toBe(404);
        expect(response.body).toEqual({message: `The item is not found.`});
    });

    test('Throwing 400 error if a user tries to get an item with an invalid id', async () => {
        const response = await request(app).get(`/items/${invalidId}`).set(cookies);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({message: '"id" must only contain hexadecimal characters'});
    });

    test('Successfully deleting the item', async () => {
        const response = await request(app).del(`/items/${item._id}`).set(cookies);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('item._id', item._id);
    });

    test('Throwing 404 error if a user tries to delete an item not found in the base', async () => {
        const response = await request(app).del(`/items/${randomId}`).set(cookies);
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
