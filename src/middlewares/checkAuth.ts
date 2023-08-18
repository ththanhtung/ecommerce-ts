import { NextFunction, Request, Response } from 'express';
import { findByID } from '../services/apiKey.service';
import { ForbiddenError } from '../errors/forbiddenError';

const HEADER = {
  apiKey: 'x-api-key',
  authorization: 'Authorization',
};

declare global {
  namespace Express {
    interface Request {
      objKey: {
        key: string;
        status: boolean;
        permissions: string[];
      };
    }
  }
}

const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const key = req.headers[HEADER.apiKey]?.toString();
    if (!key) {
      return res.status(403).send({
        message: 'Forbidden error',
      });
    }
    const objKey = await findByID(key);
    if (!objKey) {
      return res.status(403).send({
        message: 'Forbidden error',
      });
    }
    req.objKey = objKey;
    next();
  } catch (error) {
    throw new ForbiddenError();
  }
};

const permission = (permission: string) => {
  return function (req: Request, res: Response, next: NextFunction) {
    if (!req.objKey.permissions) {
      return res.status(403).send({
        message: 'permission denied',
      });
    }
    const validPermission = req.objKey.permissions.includes(permission);
    if (!validPermission) {
      return res.status(403).send({
        message: 'permission denied',
      });
    }
    next();
  };
};

export { checkAuth, permission };
