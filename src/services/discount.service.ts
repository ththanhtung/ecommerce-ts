import { FlattenMaps, Types } from 'mongoose';
import { InternalServerError } from '../errors/InternalServerError';
import { BadRequestError } from '../errors/badRequestError';
import { NotFoundError } from '../errors/notFoundError';
import {
  DiscountAttrs,
  DiscountDocs,
  discount,
} from '../models/discount.model';
import {
  findAllDiscountCodeSelect,
  findAllDiscountCodeUnselect,
  findOneDiscount,
} from '../models/repositories/discount.repo';
import { findAllProducts } from '../models/repositories/product.repo';

export class DiscountService {
  static async createNewDiscount(attrs: DiscountAttrs) {
    try {
      const foundDiscount = await findOneDiscount({
        discount_code: attrs.discount_code,
        discount_shop_id: attrs.discount_shop_id,
        discount_is_active: attrs.discount_is_active,
      });
      if (foundDiscount) {
        throw new BadRequestError('discount existed');
      }

      if (attrs.discount_end_date < new Date()) {
        throw new BadRequestError('discount end date cannot be in the past');
      }

      const newDiscount = discount.build(attrs);
      await newDiscount.save();

      return {
        code: 201,
        metadata: {
          discount: newDiscount,
        },
      };
    } catch (error) {
      throw new InternalServerError();
    }
  }

  static async getProductsByDiscount(
    sort: string = 'ctime',
    limit: number = 50,
    page: number = 1,
    attrs: { discount_code: string; discount_shop_id: string }
  ) {
    try {
      const { discount_code, discount_shop_id } = attrs;
      const foundDiscount = await findOneDiscount({
        discount_code,
        discount_shop_id: new Types.ObjectId(discount_shop_id),
      });

      if (!foundDiscount || !foundDiscount.discount_is_active) {
        throw new NotFoundError();
      }

      if (foundDiscount.discount_applies_to === 'all') {
        const products = await findAllProducts(
          {
            product_shop: discount_shop_id,
            isPublished: true,
          },
          ['product_name'],
          sort,
          limit,
          page
        );
        return {
          code: 200,
          metadata: {
            products,
          },
        };
      }

      if (foundDiscount.discount_applies_to === 'specific') {
        try {
          const products = await findAllProducts(
            {
              _id: {
                $in: foundDiscount.discount_product_ids,
              },
              product_shop: discount_shop_id,
              isPublished: true,
            },
            ['product_name'],
            sort,
            limit,
            page
          );
          console.log(foundDiscount.discount_product_ids);
  
          return {
            code: 200,
            metadata: {
              products,
            },
          };
        } catch (error) {
          if (error instanceof Error){
            console.log(error.message);
            
          }
        }
      }
    } catch (error) {
      throw new InternalServerError();
    }
  }

  static async getAllDiscountByShopID(
    page: number,
    limit: number,
    shopId: string
  ) {
    try {
      const products = await findAllDiscountCodeSelect(
        { discount_shop_id: shopId, discount_is_active: true },
        discount,
        [
          'discount_desc',
          'discount_code',
          'discount_is_active',
          'discount_applies_to',
        ],
        'ctime',
        limit,
        page
      );

      return {
        code: 200,
        metadata: {
          products,
        },
      };
    } catch (error) {
      throw new InternalServerError();
    }
  }

  static async getDiscountAmount({
    discount_shop_id,
    userId,
    discount_code,
    products,
  }: {
    discount_shop_id: string;
    userId: string;
    discount_code: string;
    products: {
      price: number,
      quantity: number
    }[];
  }) {
    let foundDiscount:
      | (FlattenMaps<DiscountDocs> & {
          _id: Types.ObjectId;
        })
      | null;
    try {
      foundDiscount = await findOneDiscount({
        discount_shop_id,
        discount_code,
      });
    } catch (error) {
      throw new InternalServerError();
    }

    if (!foundDiscount || foundDiscount.discount_is_active === false) {
      throw new NotFoundError(); 
    }

    const {
      discount_max_uses,
      discount_users_use,
      discount_min_order_value,
      discount_type,
      discount_value,
      discount_start_date,
      discount_end_date,
    } = foundDiscount;

    if (new Date() < discount_start_date) {
      throw new BadRequestError('discount have not start');
    }

    if (new Date() > discount_end_date) {
      throw new BadRequestError('discount end');
    }

    if (discount_max_uses < 1) {
      throw new BadRequestError('discount run out');
    }

    const isUserUsedDiscount = discount_users_use.find(
      (user) => user.userId === userId
    );

    if (isUserUsedDiscount) {
      throw new BadRequestError('user already use the discount');
    }

    if (discount_min_order_value < 0) {
      throw new InternalServerError();
    }
    

    const totalBeforeDiscount = products.reduce((acc: number, product: any) => {
      return acc + (product.price * product.quantity);
    },0);

    let discountAmount: number = 0;

    if (discount_type === 'fixed_amount') {
      discountAmount = discount_value;
    }

    if (discount_type === 'percentage') {
      discountAmount = totalBeforeDiscount * (discount_value/100);
    }

    return {
      code: 200,
      metadata: {
        totalBeforeDiscount: totalBeforeDiscount,
        discount: discountAmount,
        totalAfterDiscount: totalBeforeDiscount - discountAmount,
      },
    };
  }

  static async deleteDiscount({
    shopId,
    discountId,
  }: {
    shopId: string;
    discountId: string;
  }) {
    let deletedDiscount:
      | (FlattenMaps<DiscountDocs> & {
          _id: Types.ObjectId;
        })
      | null;
    try {
      deletedDiscount = await discount.findOneAndDelete({
        discount_shop_id: shopId,
        _id: discountId,
      });
    } catch (error) {
      throw new InternalServerError();
    }
    return {
      code: 200,
      metadata: {
        discount: deletedDiscount,
      },
    };
  }

  static async cancelDiscount({
    shopId,
    discountId,
    userId,
  }: {
    shopId: string;
    discountId: string;
    userId: string;
  }) {
    const foundDiscount = await findOneDiscount({
      discount_shop_id: shopId,
      _id: discountId,
    });

    if (!foundDiscount || foundDiscount.discount_is_active === false) {
      throw new BadRequestError('discount do not exist');
    }

    const result = discount.findOneAndUpdate(
      { _id: discountId },
      {
        $pull: {
          discount_users_use: userId,
        },
        $inc: {
          discount_max_uses: 1,
          discount_uses_count: -1,
        },
      }
    );

    return {
      code: 200,
      metadata: {
        discount: result,
      },
    };
  }
}
