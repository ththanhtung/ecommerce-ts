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

  async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      res.status(200).send(
        await ProductFactory.updateProduct(req.body.product_type, id, {
          ...req.body,
          product_shop: req.user.userId,
        })
      );
    } catch (error) {
      if(error instanceof Error){
        console.log(error.message);
        next(error);
        
      }
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

  async searchForPublishedProduct(
    req: Request<{}, {}, {}, { keyword: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { keyword } = req.query;

      res
        .status(200)
        .send(await ProductFactory.searchForPublishedProduct({ keyword }));
    } catch (error) {
      next(error);
    }
  }

  async findAllProducts(
    req: Request<{}, {}, {}, { page: number; limit: number; sortBy: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { page, limit, sortBy } = req.query;
      res.send(
        await ProductFactory.findAllProducts({ page, limit, sort: sortBy })
      );
    } catch (error) {
      next(error);
    }
  }

  async findProductByID(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      res.send(await ProductFactory.findProductByID(id));
    } catch (error) {
      next(error);
    }
  }
}

const productController = new ProductController();
export { productController };
