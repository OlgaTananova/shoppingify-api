import mongoose from "mongoose";
import {UserModel} from "../../models/user";
import request from 'supertest';
import {MONGO_URI_TEST} from "../../constants";
import app from '../../app';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

async function auth({email, password}: {email: string, password: string}) {
    const User = await UserModel.findUserByCredentials(email, password);
    const token = jwt.sign({_id: User._id}, 'some-secret-key', {expiresIn: '7d'});
    return token;
}
async function createAnotherUser ({name, email, password}: {name: string, email: string, password: string}) {
    const hash = await bcrypt.hash(password, 10);
    const anotherUser = UserModel.create({name, email, password: hash});
    return anotherUser;
}
beforeAll(async ()=>{
    await mongoose.connect(MONGO_URI_TEST)
});

describe('Testing user\'s \signup endpoint', ()=>{
    test('Signing up a new user with the correct user data at /signup route', async ()=>{
    const data = {name: 'User', email: '123@test.com', password: '123'};
    await request(app).post('/signup').send(data).expect(201)
        .then((res)=>{
            expect(res.body.name).toBe(data.name)
            expect(res.body.email).toBe(data.email)
        })
    });

    test('Throwing 409 error if a new user tries to register with an email that already exists at /signup route', async ()=>{
        const data = {name: 'User', email: '123@test.com', password: '123'};
        const response = await request(app).post('/signup').send(data).expect(409)
        expect(response.body).toEqual({message: 'The user already exists.'});
    })

    test('Throwing 400 error if a new user tries to register with a not valid name at /signup route', async ()=>{
        const data = {name: 'g', email: '123@test.com', password: "123"};
        const response = await request(app).post('/signup').send(data).expect(400);
        expect(response.body).toEqual({message: "\"name\" length must be at least 2 characters long"})
    });

    test('Throwing 400 error if a new user tries to register with a not valid email at /signup route', async ()=>{
        const data = {name: 'User', email: '123@test', password: "123"};
        const response = await request(app).post('/signup').send(data).expect(400);
        expect(response.body).toEqual({message: "\"email\" must be a valid email"});
    });

    test('Throwing 400 error if a new user tries to register with an empty password at /signup route', async ()=>{
        const data = {name: 'User', email: '123@test.com', password: ""};
        const response = await request(app).post('/signup').send(data);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({message: "\"password\" is not allowed to be empty"});
    });

    test('Throwing 400 error if a new user tries to register with an empty name at /signup route', async ()=>{
        const data = {name: '', email: '123@test.com', password: "123"};
        const response = await request(app).post('/signup').send(data);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({message: "\"name\" is not allowed to be empty"});
    });

    test('Throwing 400 error if a new user tries to register with an empty email at /signup route', async ()=>{
        const data = {name: 'User', email: '', password: "123"};
        const response = await request(app).post('/signup').send(data);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({message: "\"email\" is not allowed to be empty"});
    });

    test('Throwing 400 error if a new user tries to register without a name at /signup route', async ()=>{
        const data = { email: '123@test.com', password: "123"};
        const response = await request(app).post('/signup').send(data);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({message: "\"name\" is required"});
    });

    test('Throwing 400 error if a new user tries to register without an email at /signup route', async ()=>{
        const data = {name: 'User', password: "123"};
        const response = await request(app).post('/signup').send(data);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({message: "\"email\" is required"});
    });

    test('Throwing 400 error if a new user tries to register without a password at /signup route', async ()=>{
        const data = {name: 'User', email: '123@test.com'};
        const response = await request(app).post('/signup').send(data);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({message: "\"password\" is required"});
    });
});

describe('Testing user\'s \login endpoint', ()=>{
    test('Successfully login into the system with the given email and password', async ()=>{
        const data = {email: '123@test.com', password: '123'};
        const response = await request(app).post('/login').send(data);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({message: "Token was sent to cookie."})
    });

    test('Throwing 401 error if the user enters incorrect email', async ()=>{
        const data = {email: "1234@test.com", password: "123"};
        const response = await request(app).post('/login').send(data);
        expect(response.status).toBe(401)
        expect(response.body).toEqual({message: "You typed incorrect email or password. Please, try again."});
    });

    test('Throwing 401 error if the user enters incorrect password', async ()=>{
        const data = {email: "123@test.com", password: "12"};
        const response = await request(app).post('/login').send(data);
        expect(response.status).toBe(401)
        expect(response.body).toEqual({message: "You typed incorrect email or password. Please, try again."});
    })
})

describe('Testing user\'s /users/me endpoints', ()=>{
    let token: string;
    const data = {name: 'User', email: "123@test.com", password: "123"};

    beforeAll(async ()=>{
        token = await auth({email: data.email, password: data.password});
    });

    test('Successfully getting the current user at /users/me endpoint', async ()=>{
        const response = await request(app).get("/users/me").set({"Cookie": `jwt=${token}`})
        expect(response.status).toBe(200)
        expect(response.body).toEqual({name: data.name, email: data.email})
    });

    test('Successfully updating the user\'s name and email at /users/me endpoint', async ()=>{
        const data = {name: "User1", email: "1235@test.com"};
        const response = await request(app).patch('/users/me').send(data).set({"Cookie": `jwt=${token}`})
        expect(response.status).toBe(200);
        expect(response.body).toEqual({message: 'User\'s profile was successfully updated.',
        name: data.name, email: data.email});
    });

    test('Throwing 409 error if the user tries to update his email with another not unique email', async () => {
        const data = {name: "User", email: "1234@test.com"};
        await createAnotherUser({name: "User2", email: "1234@test.com", password: "123"});
        const response = await request(app).patch("/users/me").send(data).set({"Cookie": `jwt=${token}`});
        expect(response.status).toBe(409);
        expect(response.body).toEqual({message: 'User with this email already exists.'});
    });

    test('Successfully logging out at /logout endpoint', async () =>{
        const response = await request(app).post('/logout').set({"Cookie": `jwt=${token}` });
        expect(response.status).toBe(200);
        expect(response.body).toEqual({message: 'Token was deleted.'});
    });
})

afterAll(async ()=> {
    await mongoose.connection.db.dropCollection('users')
    await mongoose.disconnect();
});
