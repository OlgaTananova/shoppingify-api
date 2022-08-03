"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generalErrorHandler = exports.celebrateErrorHandler = void 0;
const constants_1 = require("../constants");
const celebrate_1 = require("celebrate");
const celebrateErrorHandler = (err, req, res, next) => {
    if ((0, celebrate_1.isCelebrateError)(err)) {
        const errorBody = err.details.get('body') || err.details.get('params');
        res.status(constants_1.badRequestStatusCode).send({ message: errorBody.details[0].message });
    }
    else {
        next(err);
    }
};
exports.celebrateErrorHandler = celebrateErrorHandler;
const generalErrorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || constants_1.serverErrorStatusCode;
    const message = statusCode === constants_1.serverErrorStatusCode ? constants_1.serverErrorMessage : err.message;
    res.status(statusCode).send({ message: message });
    next();
};
exports.generalErrorHandler = generalErrorHandler;
