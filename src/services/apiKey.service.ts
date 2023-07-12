import { apiKey } from '../models/apiKey.model';

const findByID = async (key: string) => {
  const objKey = await apiKey.findOne({ key, status: true }).lean();
  return objKey;
};

export { findByID };
