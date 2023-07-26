import { Types } from 'mongoose';
import { cart } from '../models/cart.model';
import { BadRequestError } from '../errors/badRequestError';
import { findSelectedProducts } from '../models/repositories/product.repo';
import { DiscountService } from './discount.service';

interface ShopDiscount {
  shopId: string;
  discountCode: string;
}

interface ItemProduct {
  price: number;
  quantity: number;
  productId: string;
}

interface shopOrder {
  shopId: string;
  shopDiscounts: ShopDiscount[];
  itemProducts: ItemProduct[];
}

export class CheckoutService {
  static async checkoutPreview({
    cart_id,
    user_id,
    shop_orders,
  }: {
    cart_id: string;
    user_id: string;
    shop_orders: shopOrder[];
  }) {
    const foundCart = await cart
      .findOne({
        _id: new Types.ObjectId(cart_id),
        cart_state: 'active',
      })
      .lean();

    if (!foundCart) {
      throw new BadRequestError('card does not exist!');
    }

    const checkoutOrder: {
      totalPriceBeforeDiscount: number;
      feeShip: number;
      totalDiscount: number;
      totalPriceAfterDiscount: number;
    } = {
      totalPriceBeforeDiscount: 0,
      feeShip: 0,
      totalDiscount: 0,
      totalPriceAfterDiscount: 0,
    };

    const shopOrderNew: any[] = []

    for (let i = 0; i < shop_orders.length; i++) {
      const { shopId, shopDiscounts, itemProducts } = shop_orders[i];

      const checkoutProductIds = itemProducts.map(
        (item) => new Types.ObjectId(item.productId)
      );

      const checkoutProducts = (await findSelectedProducts(
        checkoutProductIds
      )) as { price: number; quantity: number }[];

      for (let i = 0; i < checkoutProducts.length; i++){
        if (checkoutProducts[i].price !== itemProducts[i].price){
          throw new BadRequestError('price unmatch')
        }
      }

      // console.log(checkoutProducts);
      

      if (!checkoutProducts[0]) {
        throw new BadRequestError('order wrong!');
      }

      const checkoutPrice = itemProducts.reduce(
        (acc: number, product: { price: number; quantity: number }): number => {
          return acc + product.price * product.quantity;
        },
        0
      );

      checkoutOrder.totalPriceBeforeDiscount += checkoutPrice;

      const itemCheckout: {
        shop_id: string;
        shop_discounts: any[];
        priceBeforeDiscount: number;
        priceAfterDiscount: number;
        itemProducts: any[];
      } = {
        shop_id: shopId,
        shop_discounts: [],
        priceAfterDiscount: checkoutPrice,
        priceBeforeDiscount: checkoutPrice,
        itemProducts: [],
      };

      if (shopDiscounts.length > 0) {
        for (let i = 0; i < shopDiscounts.length; i++) {
          const {
            metadata: { totalAfterDiscount, totalBeforeDiscount, discount },
          } = await DiscountService.getDiscountAmount({
            discount_shop_id: shopId,
            userId: user_id,
            discount_code: shopDiscounts[i].discountCode,
            products: itemProducts,
          });
          checkoutOrder.totalDiscount += discount

          if (discount > 0){
            itemCheckout.priceAfterDiscount -= discount
          }
        }
      }
 
      checkoutOrder.totalPriceAfterDiscount += itemCheckout.priceAfterDiscount

      shopOrderNew.push(itemCheckout)
    }

    console.log(shopOrderNew);
    

    return {
      shop_orders,
      shopOrderNew,
      checkoutOrder
    }
  }
}
