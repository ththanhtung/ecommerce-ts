import { CustomError } from './customError';

export class InternalServerError extends CustomError {
  statusCode: number = 500;

  constructor() {
    super('internal server error');
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }

  serializeErrors(): { message: string; field?: string[] | undefined }[] {
    return [
      {
        message: 'internal server error',
      },
    ];
  }
}
