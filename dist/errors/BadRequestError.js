"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
class BadRequestError extends Error {
    constructor(message) {
        super();
        this.message = message;
        this.statusCode = constants_1.badRequestStatusCode;
    }
}
exports.default = BadRequestError;
