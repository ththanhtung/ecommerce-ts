import mongoose, { Schema } from "mongoose";

const COLLECTION_NAME = 'products';
const DOCUMENT_NAME = 'product';

interface ProductAttrs {
    product_name: string;
    product_desc: string;
    product_price: number;
    product_quantity: number;
    product_type: string;
    product_shop: string;
    product_attributes: any[]
}

interface ProductDocs extends mongoose.Document {
  product_name: string;
  product_desc: string;
  product_price: number;
  product_quantity: number;
  product_type: string;
  product_shop: string;
  product_attributes: any[];
}

interface ProductModel extends mongoose.Model<ProductDocs>{
    build(attrs: ProductAttrs):ProductDocs
}

const productSchema = new mongoose.Schema({
    product_name:{
        type: String,
        required: true
    },
    product_desc:{
        type: String,
    },
    product_price:{
        type: Number,
        required: true
    },
    product_quantity:{
        type: Number,
        required: true,
    },
    product_type:{
        type: String,
        required: true,
        enum:['Electronic','Clothing','Funiture']
    },
    product_shop:{
        type: Schema.Types.ObjectId,
        ref: "Shop",
        required: true
    },
    product_attributes:{
        type: Schema.Types.Mixed,
        required: true
    },
},{
    timestamps: true,
    collection: COLLECTION_NAME
})

productSchema.statics.build = (attrs: ProductAttrs)=>{
    return new product(attrs)
}

const product = mongoose.model<ProductDocs, ProductModel>(DOCUMENT_NAME, productSchema)

export {
    product
}