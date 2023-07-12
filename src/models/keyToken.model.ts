import mongoose, { Schema } from 'mongoose';

const COLLECTION_NAME = 'key_tokens';
const DOCUMENT_NAME = 'key_token';

interface KeytokenAttrs {
  userId: string;
  publicKey: string;
  refeshToken?: string[];
}

interface KeytokenDocs extends mongoose.Document {
  userId: string;
  publicKey: string[];
  refeshToken: string[];
}

interface KeytokenModel extends mongoose.Model<KeytokenDocs> {
  build(attrs: KeytokenAttrs): KeytokenDocs;
}

const keytokenSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Shop',
    },
    publicKey: {
      type: String,
      required: true,
    },
    refeshToken: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

keytokenSchema.statics.build = (attrs: KeytokenAttrs): KeytokenDocs => {
  return new Keytoken(attrs);
};

const Keytoken = mongoose.model<KeytokenDocs, KeytokenModel>(
  DOCUMENT_NAME,
  keytokenSchema
);

export {
    Keytoken
}