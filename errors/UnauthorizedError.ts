import {unauthorizedStatusCode} from "../constants";

class UnauthorizedError extends Error {
    statusCode: number
    constructor(message: string) {
        super();
        this.message = message;
        this.statusCode =  unauthorizedStatusCode;
    }
}
export default UnauthorizedError;
