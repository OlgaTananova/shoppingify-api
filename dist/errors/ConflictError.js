"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
class ConflictError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = constants_1.conflictStatusCode;
    }
}
exports.default = ConflictError;
