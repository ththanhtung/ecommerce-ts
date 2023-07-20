import { NextFunction, Request, Response } from 'express';
import { ProductFactory } from '../services/product.service';

class ProductController {
  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(201).send(
        await ProductFactory.createProduct(req.body.product_type, {
          ...req.body,
          product_shop: req.user.userId,
        })
      );
    } catch (error) {
      next(error);
    }
  }

  async findAllDraftsForShop(req: Request, res: Response, next: NextFunction) {
    const { skip, limit } = req.query;

    try {
      res.status(200).send(
        await ProductFactory.findAllDraftsForShop({
          product_shop: req.user.userId,
        })
      );
    } catch (error) {}
  }
}

const productController = new ProductController();
export { productController };
