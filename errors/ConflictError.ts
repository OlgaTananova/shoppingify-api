import {conflictStatusCode} from "../constants";

class ConflictError extends Error {
    statusCode: number

    constructor(message: string) {
        super(message);
        this.statusCode = conflictStatusCode;
    }
}

export default ConflictError;


