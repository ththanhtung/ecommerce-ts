import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

class AuthController {
  async RefeshToken(req: Request, res: Response, next: NextFunction){
    try {
      res.status(200).send(await AuthService.refeshToken(req.body))
    } catch (error) {
      next(error)
    }
  };
  async Logout(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).send(await AuthService.Logout(req.keyStore));
    } catch (error) {
      next(error);
    }
  }
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).send(await AuthService.Login(req.body));
    } catch (error) {
      next(error);
    }
  }

  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(201).send(await AuthService.Signup(req.body));
    } catch (error) {
      next(error);
    }
  }
}

const authController = new AuthController();

export { authController };
