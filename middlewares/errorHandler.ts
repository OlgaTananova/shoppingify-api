import {NextFunction, Request, Response} from "express";
import {badRequestStatusCode, serverErrorMessage, serverErrorStatusCode} from "../constants";
import {CelebrateError, isCelebrateError} from "celebrate";
import {Error} from "mongoose";

interface ErrorWithStatus extends Error {
    statusCode: number,
}

export const celebrateErrorHandler = (err: CelebrateError, req: Request, res: Response, next: NextFunction) => {
    if (isCelebrateError(err)) {
        const errorBody = err.details.get('body') || err.details.get('params');
        res.status(badRequestStatusCode).send(errorBody!.details[0].message);
    } else {
        next(err);
    }
};

export const generalErrorHandler = (err: ErrorWithStatus, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || serverErrorStatusCode;
    const message = statusCode === serverErrorStatusCode ? serverErrorMessage : err.message;
    res.status(statusCode).send(message);
    next();
};
