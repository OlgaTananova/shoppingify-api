import jwt from 'jsonwebtoken';
import UnauthorizedError from "../errors/UnauthorizedError";
import {unauthorizedMessage} from "../constants";
import {Response, Request, NextFunction} from "express";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;
    if (!token ) {
        return next(new UnauthorizedError(unauthorizedMessage));
    }
    req.user = jwt.verify(token, 'some-secret-key');
    next();
}
