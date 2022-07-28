import {badRequestStatusCode} from "../constants";

class BadRequestError extends Error {
    statusCode: number
    constructor(message: string) {
        super();
        this.message = message;
        this.statusCode = badRequestStatusCode;
    }
}
export default BadRequestError;
