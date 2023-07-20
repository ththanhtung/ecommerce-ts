import { product } from '../product.model';

const findAllDraftsForShop = async (
  query: any,
  limit: number,
  skip: number
) => {
  return await product
    .find(query)
    .populate('product_shop', 'name email -_id')
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};

export { findAllDraftsForShop };
