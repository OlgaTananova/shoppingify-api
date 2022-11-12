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

describe('Testing shopping lists endpoints', ()=>{
    beforeAll(async () => {
        await mongoose.connect(MONGO_URI_TEST);
        const data = {name: 'user', email: "123@test.com", password: "123"};
        await createAnotherUser(data);
        token = await auth({email: data.email, password: data.password});
        const response = await request(app).post('/categories').send(category).set({"Cookie": `jwt=${token}`});
        categoryId = response.body._id;
        item.categoryId = categoryId;
        item2.categoryId = categoryId;
        const requestFirstItem = await request(app).post('/items').send(item).set({"Cookie": `jwt=${token}`});
        itemId = requestFirstItem.body.item._id;
        const requestSecondItem = await request(app).post('/items').send(item2).set({"Cookie": `jwt=${token}`});
        itemId2 = requestSecondItem.body.item._id;
    });

    test('Throwing 400 error if a user tries to create a new shopping list with invalid itemId', async () => {
        const response = await request(app).post('/shoppinglists').send({itemId: 'jghghgh', categoryId: item.categoryId}).set({"Cookie": `jwt=${token}`});
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message');
    });

    test('Successfully create a new shopping list', async ()=>{
        const response = await request(app).post('/shoppinglists').send({itemId, categoryId: item.categoryId}).set({"Cookie": `jwt=${token}`});
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('heading');
        shoppingListId = response.body._id;
    });

    test('Throwing 409 error if a user tries to create another active shopping list', async () => {
        const response = await request(app).post('/shoppinglists').send({itemId, categoryId: item.categoryId}).set({"Cookie": `jwt=${token}`});
        expect(response.status).toBe(409);
        expect(response.body).toEqual({message: `The active shopping list already exists.` });
    });

    test('Successfully getting the list of all the shopping lists', async ()=> {
        const response = await request(app).get('/shoppinglists').set({"Cookie": `jwt=${token}`});
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    test('Successfully adding a new item to the active shopping list', async ()=>{
        const response = await request(app).put('/shoppinglists').send({
            shoppingListId: shoppingListId, categoryId: item2.categoryId, itemId: itemId2}
        ).set({"Cookie": `jwt=${token}`});
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('items');
    })
    afterAll(async () => {
        await mongoose.connection.db.dropCollection('users');
        await mongoose.connection.db.dropCollection('categories');
        await mongoose.connection.db.dropCollection('items');
        await mongoose.connection.db.dropCollection('shoppinglists');
        await mongoose.disconnect();
    });
})

