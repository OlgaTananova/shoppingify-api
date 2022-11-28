import dotenv from 'dotenv';
dotenv.config({ path: __dirname+'/.env' });
import jwt from 'jsonwebtoken';
import {UserModel} from "../models/user";
import {Response, Request, NextFunction} from "express";
import UnauthorizedError from "../errors/UnauthorizedError";
import {
    inCorrectEmailOrPasswordMessage,
    publicKey,
    tokenDeleted,
    tokenSendMessage
} from "../constants";
import bcrypt from "bcrypt";

let NODE_ENV: string = process.env["NODE_ENV"] || '';
let JWT_SECRET: string | undefined = process.env["JWT_SECRET"];

const secretKey: string = NODE_ENV === 'production' && JWT_SECRET || publicKey;

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const {email, password} = req.body;
    try {
        const user = await UserModel.findUserByCredentials(email, password);
        if (!user) {
            return next(new UnauthorizedError(inCorrectEmailOrPasswordMessage));
        }
        const matched = await bcrypt.compare(password, user.password);
        if (!matched) {
            return next(new UnauthorizedError(inCorrectEmailOrPasswordMessage));
        }
        const token = jwt.sign({_id: user._id}, secretKey, {expiresIn: '7d'})
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 6.048e+8,
            sameSite: 'none',
            secure: false,
        });
        res.send({message: tokenSendMessage});
    } catch (err) {
        next(err);
    }
};

export const logout = (req: Request, res: Response) => {
    res.clearCookie('jwt').send({message: tokenDeleted});
}
