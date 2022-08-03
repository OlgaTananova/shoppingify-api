"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
class UnauthorizedError extends Error {
    constructor(message) {
        super();
        this.message = message;
        this.statusCode = constants_1.unauthorizedStatusCode;
    }
}
exports.default = UnauthorizedError;
