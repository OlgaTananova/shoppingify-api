import {UserModel} from "../models/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export async function auth({email, password}: {email: string, password: string}) {
    const User = await UserModel.findUserByCredentials(email, password);
    const token = jwt.sign({_id: User._id}, 'some-secret-key', {expiresIn: '7d'});
    return token;
}
export async function createAnotherUser ({name, email, password}: {name: string, email: string, password: string}) {
    const hash = await bcrypt.hash(password, 10);
    const anotherUser = UserModel.create({name, email, password: hash});
    return anotherUser;
}

export let category = {category: 'veggies'};
export let item =  {name: 'tomato', note: 'Tomato is actually a berry', image: 'none', categoryId: ''};
export let item2 = {name: 'Potato', categoryId: '' };
export let notFoundItemId = "62ec0d71a1e7179a512fc2fd";
export let invalidItemId = 'jggfgdffd';
