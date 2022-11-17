import jwt from 'jsonwebtoken';
import UnauthorizedError from "../errors/UnauthorizedError";
import {publicKey, unauthorizedMessage} from "../constants";
import {Response, Request, NextFunction} from "express";

const {NODE_ENV, JWT_SECRET} = process.env;
const secretKey: string = NODE_ENV === 'production' && JWT_SECRET || publicKey;

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;
    if (!token ) {
        return next(new UnauthorizedError(unauthorizedMessage));
    }
    req.user = jwt.verify(token, secretKey);
    next();
}
