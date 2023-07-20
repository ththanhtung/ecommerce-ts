import mongoose, { Schema } from 'mongoose';
import slugify from 'slugify';

const COLLECTION_NAME = 'products';
const DOCUMENT_NAME = 'product';

export interface ProductAttrs {
  _id: string;
  product_name: string;
  product_desc: string;
  product_price: number;
  product_quantity: number;
  product_type: string;
  product_shop: string;
  product_attributes: any;
}

interface ProductDocs extends mongoose.Document {
  _id: string;
  product_name: string;
  product_desc: string;
  product_price: number;
  product_quantity: number;
  product_type: string;
  product_shop: string;
  product_attributes: any;
}

interface ProductModel extends mongoose.Model<ProductDocs> {
  build(attrs: ProductAttrs): ProductDocs;
}

const productSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    product_name: {
      type: String,
      required: true,
    },
    product_slug: {
      type: String,
    },
    product_desc: {
      type: String,
    },
    product_price: {
      type: Number,
      required: true,
    },
    product_quantity: {
      type: Number,
      required: true,
    },
    product_type: {
      type: String,
      required: true,
      enum: ['Electronic', 'Clothing', 'Funiture'],
    },
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
    },
    product_attributes: {
      type: Schema.Types.Mixed,
      required: true,
    },
    product_averageRating: {
      type: Number,
      default: 4.5,
      min: [1, 'rating cannot lower than 1'],
      max: [5, 'rating cannot greater than 5'],
      set: (val: number): number => Math.round(val),
    },
    isDraft: {
      type: Schema.Types.Boolean,
      default: true,
      index: true,
      select: false,
    },
    isPublished: {
      type: Schema.Types.Boolean,
      default: false,
      index: true,
      select: false,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

// indexing product name and description for full text search
productSchema.index({product_name: 'text', product_desc: 'text'})

productSchema.pre('save', function (next) {
  const product_slug = slugify(this.get('product_name'), { lower: true });
  this.set('product_slug', product_slug);
  next();
});


productSchema.statics.build = (attrs: ProductAttrs) => {
  return new product(attrs);
};

const product = mongoose.model<ProductDocs, ProductModel>(
  DOCUMENT_NAME,
  productSchema
);

export { product };