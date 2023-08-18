import mongoose, { Schema } from 'mongoose';

const COLLECTION_NAME = 'Shops';
const DOCUMENT_NAME = 'Shop';

interface ShopAttrs {
  email: string;
  password: string;
  name: string;
  status?: string;
  verify?: boolean;
  roles?: string[];
}

interface ShopDocs extends mongoose.Document {
  email: string;
  password: string;
  name: string;
  status: string;
  verify: boolean;
  roles: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface ShopModel extends mongoose.Model<ShopDocs> {
  build(attrs: ShopAttrs): ShopDocs;
}

const shopSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      maxLength: 150,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'unactive'],
      default: 'unactive',
    },
    verify: {
      type: Schema.Types.Boolean,
      default: false,
    },
    roles: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.verify;
        delete ret.status;
        delete ret.createdAt;
        delete ret.updatedAt;
        delete ret.__v;
      },
    },
  }
);


shopSchema.statics.build = (attrs: ShopAttrs): ShopDocs => {
  return new Shop(attrs);
};

const Shop = mongoose.model<ShopDocs, ShopModel>(DOCUMENT_NAME, shopSchema);

export { Shop };
