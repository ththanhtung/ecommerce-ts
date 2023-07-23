import { getSelectData, unSelectData } from '../../helpers/selectData';
import { discount } from '../discount.model';

const findOneDiscount = async (filter: { [key: string]: any }) => {
  return await discount.findOne(filter).lean();
};

const findAllDiscountCodeUnselect = async (
  filter: { [k: string]: any },
  model: any,
  unSelect: string[],
  sort: string,
  limit: number,
  page: number
) => {
  const sortBy: { [k: string]: any } =
    sort === 'ctime' ? { _id: -1 } : { _id: 1 };
  const skip = (page - 1) * limit;
  return await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(unSelectData(unSelect))
    .lean();
};

const findAllDiscountCodeSelect = async (
  filter: { [k: string]: any },
  model: any,
  select: string[],
  sort: string,
  limit: number,
  page: number
) => {
  const sortBy: { [k: string]: any } =
    sort === 'ctime' ? { _id: -1 } : { _id: 1 };
  const skip = (page - 1) * limit;
  return await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();
};

export {
  findOneDiscount,
  findAllDiscountCodeUnselect,
  findAllDiscountCodeSelect,
};
