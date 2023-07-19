import { CustomError } from "./customError";

export class NotAuthorizeError extends CustomError{
    statusCode: number = 401;
    constructor(){
        super('not authorize');
        Object.setPrototypeOf(this, NotAuthorizeError.prototype)
    }

    serializeErrors(): { message: string; field?: string[] | undefined; }[] {
        return [
            {
                message: 'not authorized'
            }
        ]
    }
}