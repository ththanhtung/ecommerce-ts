import { NextFunction, Request, Response } from "express";
import { CartService } from "../services/cart.service";

class CartController {
  async addToCart(req: Request, res: Response, next: NextFunction) {
    try {
      res.send(await CartService.addToCart(req.body));
    } catch (error) {
      next(error);
    }
  }
  async getCartByUserID(req: Request, res: Response, next: NextFunction){
    try {
        res.send(await CartService.getCartByUserID(req.body))
    } catch (error) {
        next(error)
    }
  };
}

const cartController = new CartController()
export {
    cartController
}