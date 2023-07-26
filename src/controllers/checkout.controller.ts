import { NextFunction, Request, Response } from 'express';
import { CheckoutService } from '../services/checkout.service';

class CheckoutController {
  async checkoutPreview(req: Request, res: Response, next: NextFunction) {
    try {
        res.send(await CheckoutService.checkoutPreview(req.body))
    } catch (error) {
        next(error)
    }
  }
}

const checkoutController = new CheckoutController

export {
    checkoutController
}