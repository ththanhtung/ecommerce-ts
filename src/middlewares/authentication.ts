import { NextFunction, Request, Response } from 'express';
import { NotAuthorizeError } from '../errors/notAuthorizeError';
import { KeytokenService } from '../services/keyToken.service';
import jwt from 'jsonwebtoken';

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
        userId: string,
        email: string
      }
    }
  }
}

export const authentication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userID = req.headers[HEADERS.CLIENT_ID] as string;
  if (!userID) {
    throw new NotAuthorizeError();
  }

  const keyStore = await KeytokenService.findByUserID(userID);

  const accessToken = req.headers[HEADERS.AUTH] as string;
  const decodedUser = jwt.verify(
    accessToken,
    keyStore?.publicKey as string
  ) as { userId: string; email: string };

  req.keyStore = keyStore;
  req.user = decodedUser;

  if (decodedUser.userId !== userID) {
    throw new NotAuthorizeError();
  }

  next();
};
