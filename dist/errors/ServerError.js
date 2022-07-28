"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
class serverError extends Error {
    constructor(message) {
        super();
        this.statusCode = constants_1.serverErrorStatusCode;
        this.message = message;
    }
}
exports.default = serverError;
