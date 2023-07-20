import { Types } from 'mongoose';
import { product } from '../product.model';

const findAllDraftsForShop = async (
  product_shop: string,
  limit: number,
  skip: number
) => {
  return await product
    .find({ product_shop: new Types.ObjectId(product_shop), isDraft: true })
    .populate('product_shop', 'name email -_id')
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};

const findAllPublishedForShop = async (
  product_shop: string,
  limit: number,
  skip: number
) => {
  return await product
    .find({ product_shop: new Types.ObjectId(product_shop), isPublished: true })
    .populate('product_shop', 'name email -_id')
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};

const publishProductByShop = async (_id: string, product_shop: string) => {
  return await product
    .findOneAndUpdate(
      {
        _id: new Types.ObjectId(_id),
        product_shop: new Types.ObjectId(product_shop),
      },
      { $set: { isPublished: true, isDraft: false } }
    )
    .lean();
};

const draftProductByShop = async (_id: string, product_shop: string) => {
  return await product
    .findOneAndUpdate(
      {
        _id: new Types.ObjectId(_id),
        product_shop: new Types.ObjectId(product_shop),
      },
      { $set: { isPublished: false, isDraft: true } }
    )
    .lean();
};

export {
  findAllDraftsForShop,
  publishProductByShop,
  findAllPublishedForShop,
  draftProductByShop,
};
