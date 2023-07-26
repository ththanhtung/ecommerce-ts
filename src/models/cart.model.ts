import mongoose from 'mongoose';

const COLLECTION_NAME = 'Carts';
const DOCUMENT_NAME = 'Cart';

export interface CartAttrs {
  cart_state: string;
  cart_products: any[];
  cart_count_products: number;
  cart_user_id: string;
}

export interface CartDocs extends mongoose.Document {
  cart_state: string;
  cart_products: any[];
  cart_count_products: number;
  cart_user_id: string;
}

interface CartModel extends mongoose.Model<CartDocs> {
  build(attrs: CartAttrs): CartDocs;
}

const cartSchema = new mongoose.Schema(
  {
    cart_state: {
      type: String,
      required: true,
      enum: ['active', 'completed', 'pending', 'failed'],
      default: 'active',
    },
    cart_products: {
      type: Array,
      required: true,
      default: [],
    },
    cart_count_products: {
      type: Number,
      required: true,
    },
    cart_user_id: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

cartSchema.statics.build = (attrs: CartAttrs) => {
  return new cart(attrs);
};

const cart = mongoose.model<CartDocs, CartModel>(DOCUMENT_NAME, cartSchema);

export { cart };
