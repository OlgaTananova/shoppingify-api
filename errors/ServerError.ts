import {serverErrorStatusCode} from "../constants";

class serverError extends Error {
    statusCode: number;

    constructor(message: string) {
        super();
        this.statusCode = serverErrorStatusCode;
        this.message = message;
    }
}

export default serverError;
