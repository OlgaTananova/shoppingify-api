import {UserModel} from "../models/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export async function auth({email, password}: { email: string, password: string }) {
    const User = await UserModel.findUserByCredentials(email, password);
    const token = jwt.sign({_id: User._id}, 'some-secret-key', {expiresIn: '7d'});
    return token;
}

export async function createAnotherUser({name, email, password}: { name: string, email: string, password: string }) {
    const hash = await bcrypt.hash(password, 10);
    const anotherUser = UserModel.create({name, email, password: hash});
    return anotherUser;
}

interface Item {
    name: string,
    note?: string,
    image?: string,
    categoryId: string,
    _id?: string;
}

export let user = {name: 'user', email: "123@test.com", password: "123"};
export let category = {category: 'veggies'};
export let item: Item = {name: 'tomato', note: 'Tomato is actually a berry', image: 'none', categoryId: ''};
export let item2: Item = {name: 'Potato', categoryId: ''};
export let randomId = "62ec0d71a1e7179a512fc2fd";
export let invalidId = 'jggfgdffd';
