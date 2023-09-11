import { NextFunction, Request, Response } from 'express';
import { NotAuthorizeError } from '../errors/notAuthorizeError';
import { KeytokenService } from '../services/keyToken.service';
import jwt from 'jsonwebtoken';
import { ForbiddenError } from '../errors/forbiddenError';
import { CustomError } from '../errors/customError';

const HEADERS = {
  AUTH: 'authorization',
  CLIENT_ID: 'x-client-id',
  API_KEY: 'x-api-key',
};

declare global {
  namespace Express {
    interface Request {
      keyStore: any;
      user: {
        userId: string;
        email: string;
      };
    }
  }
}

export const authentication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userID = req.headers[HEADERS.CLIENT_ID] as string;
  console.log("user id:", userID);
  
  if (!userID) {
    next(new NotAuthorizeError());
  }

  const keyStore = await KeytokenService.findByUserID(userID);

  let accessToken = req.headers[HEADERS.AUTH] as string;
  accessToken = accessToken.replace('Bearer ', '');  

  try {
    const decodedUser = jwt.verify(
      accessToken,
      keyStore?.publicKey as string
    ) as { userId: string; email: string };
    req.keyStore = keyStore;
    req.user = decodedUser;

    if (decodedUser.userId !== userID) {
      next(new NotAuthorizeError());
    }
  } catch (error) {
    next(new ForbiddenError());
  }
  next();
};
