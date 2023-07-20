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
    } catch (error) {
      next(error);
    }
  }

  async findAllPublishedForShop(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { skip, limit } = req.query;

    try {
      res.status(200).send(
        await ProductFactory.findAllPublishedForShop({
          product_shop: req.user.userId,
        })
      );
    } catch (error) {
      next(error);
    }
  }

  async publishProductByShop(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      res.status(200).send(
        await ProductFactory.publishProductByShop({
          _id: id,
          product_shop: req.user.userId,
        })
      );
    } catch (error) {
      next(error);
    }
  
  }
  async draftProductByShop(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      res.status(200).send(
        await ProductFactory.draftProductByShop({
          _id: id,
          product_shop: req.user.userId,
        })
      );
    } catch (error) {
      next(error);
    }
  }
}

const productController = new ProductController();
export { productController };
