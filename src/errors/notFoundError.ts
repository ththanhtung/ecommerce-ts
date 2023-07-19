import { CustomError } from './customError';

export class NotFoundError extends CustomError {
  statusCode: number = 404;
  constructor() {
    super('error not found');
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
  
  serializeErrors(): { message: string; field?: string[] | undefined }[] {
    return [
      {
        message: 'error not found',
      },
    ];
  }
}
