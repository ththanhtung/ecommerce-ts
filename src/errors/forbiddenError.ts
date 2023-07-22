import { CustomError } from "./customError";

export class ForbiddenError extends CustomError{
    statusCode: number = 403;

    constructor(){
        super('forbidden error')
        Object.setPrototypeOf(this, ForbiddenError.prototype)
    }

    serializeErrors(): { message: string; field?: string[] | undefined; }[] {
        return [
            {
                message: 'forbidden error'
            }
        ]
    }
}