import mongoose from 'mongoose';

const COLLECTION_NAME = 'Clothing';
const DOCUMENT_NAME = 'Clothing';

export interface ClothingAttrs {
  product_shop: string;
  brand: string;
  size: string;
  material: string;
}

interface ClothingDocs extends mongoose.Document {
  product_shop: string;
  brand: string;
  size: string;
  material: string;
}

interface ClothingModel extends mongoose.Model<ClothingDocs> {
  build(attrs: ClothingAttrs): ClothingDocs;
}

const ClothingSchema = new mongoose.Schema(
  {
    product_shop:{
      type: mongoose.Types.ObjectId,
      require
    },
    brand: {
      type: String,
      required: true,
    },
    material: {
      type: String,
    },
    size: {
      type: String
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

ClothingSchema.statics.build = (attrs: ClothingAttrs) => {
  return new clothing(attrs);
};

const clothing = mongoose.model<ClothingDocs, ClothingModel>(
  DOCUMENT_NAME,
  ClothingSchema
);

export { clothing };
