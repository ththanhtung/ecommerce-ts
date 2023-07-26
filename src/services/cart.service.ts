import { FlattenMaps, Types } from 'mongoose';
import { CartDocs, cart } from '../models/cart.model';
import { InternalServerError } from '../errors/InternalServerError';
import {
  deleteProductInCart,
  updateCartQuantity,
} from '../models/repositories/cart.repo';

export class CartService {
  static async createCart(
    userId: string,
    product: {
      product_id: string;
      new_quantity: number;
      old_quantity: number;
      shop_id: string;
    }
  ) {
    const quantity = product.new_quantity - product.old_quantity;
    console.log('quantity:', product.new_quantity);

    return await cart.findOneAndUpdate(
      { cart_user_id: userId, cart_state: 'active' },
      {
        $set: {
          cart_user_id: userId,
        },
        $addToSet: {
          cart_products: product,
        },
        $inc: {
          cart_count_products: quantity,
        },
      },
      { upsert: true, new: true }
    );
  }

  static async updateCartQuantity(
    userId: string,
    product: {
      product_id: string;
      new_quantity: number;
      old_quantity: number;
      shop_id: string;
    }
  ) {
    try {
      return await updateCartQuantity(userId, product);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        throw new InternalServerError();
      }
    }
  }

  static async addToCart({
    userId,
    product,
  }: {
    userId: string;
    product: {
      product_id: string;
      new_quantity: number;
      old_quantity: number;
      shop_id: string;
    };
  }) {
    let foundCart: (FlattenMaps<CartDocs> & { _id: Types.ObjectId }) | null;

    foundCart = await cart.findOne({
      cart_user_id: userId,
      cart_state: 'active',
    });
    // cart doesn't exist
    if (!foundCart) {
      try {
        const cart = await this.createCart(userId, product);
        return {
          code: 200,
          metadat: {
            cart,
          },
        };
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
          throw new InternalServerError();
        }
      }
    }

    // cart existed but have no product
    if (!foundCart?.cart_products.length) {
      try {
        foundCart?.cart_products.push(product);
        await foundCart?.save();
        return {
          code: 200,
          metadata: {
            cart: foundCart,
          },
        };
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
          throw new InternalServerError();
        }
      }
    }

    // product quantity down to 0
    if (product.new_quantity - product.old_quantity < 1) {
      const cart = await deleteProductInCart(product.product_id, userId);
      return {
        code: 200,
        metadata: {
          cart,
        },
      };
    }

    // cart existed and have product
    try {
      const cart = await this.updateCartQuantity(userId, product);
      return {
        code: 200,
        metadata: {
          cart,
        },
      };
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        throw new InternalServerError();
      }
    }
  }

  static async deleteProductInCart(productId: string, userId: string) {
    try {
      return await deleteProductInCart(productId, userId);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        throw new InternalServerError();
      }
    }
  }

  static async getCartByUserID({ userId }: { userId: string }) {
    const userCart = await cart.findOne({ cart_user_id: userId });
    return {
      code: 200,
      metadata: {
        cart: userCart,
      },
    };
  }
}
