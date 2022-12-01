import mongoose from "mongoose";
import {MONGO_URI_TEST} from "../../constants";
import {auth, createAnotherUser, item, category, item2 } from "../../fixtures/main";
import request from "supertest";
import app from "../../app";

let token: string;
let categoryId: string;
let itemId: string;
let itemId2: string;
let shoppingListId: string;
let cookie: {'Cookie': string};

describe('Testing shopping lists endpoints', ()=>{
    beforeAll(async () => {
        await mongoose.connect(MONGO_URI_TEST);
        const data = {name: 'user', email: "123@test.com", password: "123"};
        await createAnotherUser(data);
        token = await auth({email: data.email, password: data.password});
        cookie = {"Cookie": `jwt=${token}`};
        const response = await request(app).post('/categories').send(category).set(cookie);
        categoryId = response.body._id;
        item.categoryId = categoryId;
        item2.categoryId = categoryId;
        const requestFirstItem = await request(app).post('/items').send(item).set(cookie);
        itemId = requestFirstItem.body.item._id;
        const requestSecondItem = await request(app).post('/items').send(item2).set(cookie);
        itemId2 = requestSecondItem.body.item._id;
    });

    test('Throwing 400 error if a user tries to create a new shopping list with invalid itemId', async () => {
        const response = await request(app).post('/shoppinglists').send({itemId: 'jghghgh', categoryId: item.categoryId}).set(cookie);
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message');
    });

    test('Successfully create a new shopping list', async ()=>{
        const response = await request(app).post('/shoppinglists').send({itemId, categoryId: item.categoryId}).set(cookie);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('heading');
        shoppingListId = response.body._id;
    });

    test('Throwing 409 error if a user tries to create another active shopping list', async () => {
        const response = await request(app).post('/shoppinglists').send({itemId, categoryId: item.categoryId}).set(cookie);
        expect(response.status).toBe(409);
        expect(response.body).toEqual({message: `The active shopping list already exists.` });
    });

    test('Successfully getting all shopping lists', async ()=> {
        const response = await request(app).get('/shoppinglists').set(cookie);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    test('Successfully adding a new item to the active shopping list', async ()=>{
        const data = {shoppingListId: shoppingListId, categoryId: item2.categoryId, itemId: itemId2}
        const response = await request(app).put('/shoppinglists').send(data).set(cookie);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('items');
    });

    test('Throwing 409 error if the user tried to add already existed item to the SL ', async ()=>{
        const data = {shoppingListId: '62ec0d71a1e7179a512fc2fd', categoryId: item2.categoryId, itemId: itemId2};
        const response = await request(app).put('/shoppinglists').send(data).set(cookie);
        expect(response.status).toBe(409);
        expect(response.body).toEqual({message: 'You tried to add the item which is already in the shopping list.'});
    });

    test('Successfully changing quantity of the item in the shopping list', async ()=>{
        const data = {shoppingListId: shoppingListId, itemId: itemId, quantity: 3};
        const response = await request(app).patch('/shoppinglists/updqty').send(data).set(cookie);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('heading');
    });

    test('Throwing 404 error if a user tries to update the quantity of the item that is not in the SL', async ()=>{
        const data = {shoppingListId: shoppingListId, itemId: '62ec0d71a1e7179a512fc2fd', quantity: 2};
        const response = await request(app).patch('/shoppinglists/updqty').send(data).set(cookie);
        expect(response.status).toBe(404);
        expect(response.body).toEqual({message: 'The active shopping list or item is not found.'});
    });

    test('Successfully updating the status of the item in the SL', async ()=>{
        const data = {shoppingListId: shoppingListId, itemId: itemId, status: 'completed'};
        const response = await request(app).patch('/shoppinglists/updstatus').send(data).set(cookie);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('heading');
    });

    test('Throwing 400 error if the user tries to update the item in the SL with an invalid status', async ()=>{
        const data = {shoppingListId: shoppingListId, itemId: itemId, status: 'jghgh'};
        const response = await request(app).patch('/shoppinglists/updstatus').send(data).set(cookie);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: '"status" must be one of [pending, completed]' });
    });

    test('Successfully updating the active shopping list heading', async ()=>{
        const data = {shoppingListId: shoppingListId, heading: 'Grocery'};
        const response = await request(app).patch('/shoppinglists/updheading').send(data).set(cookie);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('heading');
    });

    test('Throwing 400 error if the user tries to update the SL with an invalid heading', async ()=>{
        const data = {shoppingListId: shoppingListId, heading: 'G'};
        const response = await request(app).patch('/shoppinglists/updheading').send(data).set(cookie);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: '"heading" length must be at least 2 characters long' });
    });

    test('Successfully deleting the item from the shopping list', async ()=>{
        const data = {shoppingListId: shoppingListId, itemId: itemId};
        const response = await request(app).delete('/shoppinglists').send(data).set(cookie);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id', shoppingListId);
    });

    test('Throwing 404 error if the user tries to delete the not existing item from the SL', async () =>{
        const data = {shoppingListId: shoppingListId, itemId: itemId};
        const response = await request(app).delete('/shoppinglists').send(data).set(cookie);
        expect(response.status).toBe(404);
        expect(response.body).toEqual( { message: 'The item is not found.' });
    });

    test('Successfully updating the shopping list status', async ()=>{
        const data = {shoppingListId: shoppingListId, status: 'completed'};
        const response = await request(app).patch('/shoppinglists/updslstatus').send(data).set(cookie);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('status', 'completed');
    });

    test('Throwing 404 error if the user tries to update the status of the non-active SL', async ()=>{
        const data = {shoppingListId: shoppingListId, status: 'completed'};
        const response = await request(app).patch('/shoppinglists/updslstatus').send(data).set(cookie);
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'The active shopping list is not found.' });
    });

    afterAll(async () => {
        await mongoose.connection.db.dropCollection('users');
        await mongoose.connection.db.dropCollection('categories');
        await mongoose.connection.db.dropCollection('items');
        await mongoose.connection.db.dropCollection('shoppinglists');
        await mongoose.disconnect();
    });
})

