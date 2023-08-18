import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../errors/customError';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('kjlj', err instanceof CustomError);
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }
  res.status(400).send({
    errors: [
      {
        message: 'something went wrong',
      },
    ],
  });
};
