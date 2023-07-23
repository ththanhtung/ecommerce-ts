import { NextFunction, Request, Response } from 'express';
import { DiscountService } from '../services/discount.service';

class DiscountController {
  async createNewDiscount(req: Request, res: Response, next: NextFunction) {
    try {
      res.send(await DiscountService.createNewDiscount(req.body));
    } catch (error) {
      next(error);
    }
  }
  async getAllDiscountByShopID(
    req: Request<{}, {}, {}, { limit: string; sort: string; page: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { limit, sort, page } = req.query;
      res.send(
        await DiscountService.getAllDiscountByShopID(
          +page,
          +limit,
          req.user.userId
        )
      );
    } catch (error) {
      next(error);
    }
  }
  async getProductsByDiscount(
    req: Request<
      {},
      {},
      { discount_code: string; discount_shop_id: string },
      { limit: string; sort: string; page: string }
    >,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { limit, sort, page } = req.query;
      res.send(
        await DiscountService.getProductsByDiscount(
          sort,
          +limit,
          +page,
          req.body
        )
      );
    } catch (error) {
      next(error);
    }
  }
  async deleteDiscount(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      res.send(
        await DiscountService.deleteDiscount({
          discountId: id,
          shopId: req.user.userId,
        })
      );
    } catch (error) {
      next(error);
    }
  }
  async cancelDiscount(req: Request, res: Response, next: NextFunction) {
    try {
      res.send(await DiscountService.cancelDiscount(req.body));
    } catch (error) {
      next(error);
    }
  }
  async getDiscountAmount(req: Request, res: Response, next: NextFunction) {
    try {
      res.send(await DiscountService.getDiscountAmount(req.body));
    } catch (error) {
      next(error);
    }
  }
}

const discountController = new DiscountController();

export { discountController };
