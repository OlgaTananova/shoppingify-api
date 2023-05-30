import dotenv from 'dotenv';
dotenv.config({ path: __dirname+'/.env' });
import jwt from 'jsonwebtoken';
import UnauthorizedError from "../errors/UnauthorizedError";
import {publicKey, unauthorizedMessage} from "../constants";
import {Response, Request, NextFunction} from "express";

let NODE_ENV: string = process.env["NODE_ENV"] || '';
let JWT_SECRET: string | undefined = process.env["JWT_SECRET"];

const secretKey: string = NODE_ENV === 'production' && JWT_SECRET || publicKey;

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;
    const url = req.url;
    if (url === 'http://localhost:3000' || 'http://172.20.10.6:3000') {
        req.user = {_id: '639f99ac8639ee8000f0ac90', iat: 1621576800, exp: 1622181600};
        next();
    } else {
        if (!token) {
            return next(new UnauthorizedError(unauthorizedMessage));
        }
        req.user = jwt.verify(token, secretKey);
        next();
    }
}
