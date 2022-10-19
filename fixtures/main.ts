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
