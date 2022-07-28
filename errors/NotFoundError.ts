import {notFoundErrorStatusCode} from "../constants";

class NotFoundError extends Error {
    statusCode: number

    constructor(message: string) {
        super(message);
        this.statusCode = notFoundErrorStatusCode;
    }
}

export default NotFoundError;
