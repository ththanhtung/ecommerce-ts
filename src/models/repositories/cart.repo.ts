import { Types } from 'mongoose';
import { cart } from '../cart.model';

const deleteProductInCart = async (productId: string, userId: string) => {
    console.log('deleting product from cart', productId)
  return await cart
    .findOneAndUpdate(
      { cart_user_id: userId, cart_state: 'active' },
      {
        $set:{
            cart_count_products: 0,
        },
        $pull: {
          cart_products: {
            product_id: productId,
          },
        },
      }
    , {
        new: true
    })
    .lean();
};

const updateCartQuantity = async (
  userId: string,
  product: {
      product_id: string;
      new_quantity: number;
      old_quantity: number;
      shop_id: string;
    }
) => {
  return await cart
    .findOneAndUpdate(
      {
        cart_user_id: userId,
        cart_state: 'active',
        'cart_products.product_id': product.product_id,
      },
      {
        $set: {
          'cart_products.$.new_quantity': product.new_quantity,
          'cart_products.$.old_quantity': product.old_quantity,
        },
        $inc: {
          cart_count_products: product.new_quantity - product.old_quantity,
        },
      },
      {
        upsert: true,
        new: true,
      }
    )
    .lean();
};

export { deleteProductInCart, updateCartQuantity };
