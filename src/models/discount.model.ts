import mongoose, { Schema, Types } from 'mongoose';

const COLLECTION_NAME = 'Discounts';
const DOCUMENT_NAME = 'Discount';

export interface DiscountAttrs {
  discount_name: string;
  discount_code: string;
  discount_desc: string;
  discount_type: string;
  discount_value: number;
  discount_start_date: Date;
  discount_end_date: Date;
  discount_max_uses: number;
  discount_uses_count: number;
  discount_users_use: any[];
  discount_max_uses_per_user: number;
  discount_min_order_value: number;
  discount_shop_id: string;
  discount_is_active: boolean;
  discount_applies_to: string;
  discount_product_ids: string[];
}

export interface DiscountDocs extends mongoose.Document {
  discount_name: string;
  discount_code: string;
  discount_desc: string;
  discount_type: string;
  discount_value: number;
  discount_start_date: Date;
  discount_end_date: Date;
  discount_max_uses: number;
  discount_uses_count: number;
  discount_users_use: any[];
  discount_max_uses_per_user: number;
  discount_min_order_value: number;
  discount_shop_id: string;
  discount_is_active: boolean;
  discount_applies_to: string;
  discount_product_ids: string[];
}

interface DiscountModel extends mongoose.Model<DiscountDocs> {
  build(attrs: DiscountAttrs): DiscountDocs;
}

const discountSchema = new mongoose.Schema(
  {
    discount_name: {
      type: String,
      required: true,
    },
    discount_code: {
      type: String,
      required: true,
    },
    discount_desc: {
      type: String,
      required: true,
    },
    discount_type: {
      type: String,
      default: 'fixed_amount',
      enum: ['fixed_amount', 'percentage'],
    },
    discount_value: {
      type: Number,
      required: true,
    },
    discount_start_date: {
      type: Date,
      required: true,
    },
    discount_end_date: {
      type: Date,
      required: true,
    },
    discount_max_uses: {
      type: Number,
      required: true,
    },
    discount_uses_count: {
      type: Number,
      required: true,
    },
    discount_users_use: {
      type: Array,
      default: [],
    },
    discount_max_uses_per_user: {
      type: Number,
      required: true,
    },
    discount_min_order_value: {
      type: Number,
      required: true,
    },
    discount_shop_id: {
      type: Types.ObjectId,
      required: true,
      ref: 'Shop',
    },
    discount_is_active: {
      type: Schema.Types.Boolean,
      required: true,
    },
    discount_applies_to: {
      type: String,
      required: true,
      enum: ['all', 'specific'],
    },
    discount_product_ids: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

discountSchema.statics.build = (attrs: DiscountAttrs) => {
  return new discount(attrs);
};

const discount = mongoose.model<DiscountDocs, DiscountModel>(
  DOCUMENT_NAME,
  discountSchema
);

export { discount };
