import mongoose from 'mongoose';

const COLLECTION_NAME = 'Clothing';
const DOCUMENT_NAME = 'Clothing';

interface ClothingAttrs {
  brand: string;
  size: string;
  material: string;
}

interface ClothingDocs extends mongoose.Document {
  brand: string;
  size: string;
  material: string;
}

interface ClothingModel extends mongoose.Model<ClothingDocs> {
  build(attrs: ClothingAttrs): ClothingDocs;
}

const ClothingSchema = new mongoose.Schema(
  {
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
  return new Clothing(attrs);
};

const Clothing = mongoose.model<ClothingDocs, ClothingModel>(
  DOCUMENT_NAME,
  ClothingSchema
);

export { Clothing };
