import mongoose from 'mongoose';

const COLLECTION_NAME = 'Api_Keys';
const DOCUMENT_NAME = 'Api_Key';

interface ApiKeyAttrs {
  key: string;
  status?: boolean;
  permissions: string[];
}

interface ApiKeyDocs extends mongoose.Document {
  key: string;
  status: boolean;
  permissions: string[];
}

interface ApiModel extends mongoose.Model<ApiKeyDocs> {
  build(attrs: ApiKeyAttrs): ApiKeyDocs;
}

const apiKeySchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: mongoose.Schema.Types.Boolean,
      default: true,
    },
    permissions: {
      type: [String],
      required: true,
      enum: ['001', '002', '003', '004'],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

apiKeySchema.statics.build = (attrs: ApiKeyAttrs): ApiKeyDocs => {
  return new apiKey(attrs);
};

const apiKey = mongoose.model<ApiKeyDocs, ApiModel>(
  DOCUMENT_NAME,
  apiKeySchema
);


export { apiKey };
