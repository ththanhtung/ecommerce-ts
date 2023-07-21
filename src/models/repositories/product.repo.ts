import { Types } from 'mongoose';
import { product } from '../product.model';
import { getSelectData, unSelectData } from '../../helpers/selectData';

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

const searchForPublishedProducts = async (keyword: string) => {
  const regexSearch = new RegExp(`${keyword}`);
  console.log(regexSearch);

  return await product
    .find(
      {
        $text: {
          $search: regexSearch.source,
        },
        isPublished: true,
      },
      {
        score: {
          $meta: 'textScore',
        },
      }
    )
    .sort({
      score: {
        $meta: 'textScore',
      },
    })
    .lean();
};

const findAllProducts = async (
  filter: any,
  select: string[],
  sort: string,
  limit: number,
  page: number
) => {
  const sortBy: { [k: string]: any } =
    sort === 'ctime' ? { _id: -1 } : { _id: 1 };

  const skip = (page - 1) * limit;

  return await product
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();
};

const findProductByID = async (_id: string, unSelect: string[]) => {
  return await product
    .findOne({ _id, isPublished: true })
    .select(unSelectData(unSelect))
    .lean();
};

export {
  findProductByID,
  findAllProducts,
  findAllDraftsForShop,
  publishProductByShop,
  findAllPublishedForShop,
  draftProductByShop,
  searchForPublishedProducts,
};
