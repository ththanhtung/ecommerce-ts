import { Shop } from '../models/shop.model';

type Select = {
  email: number;
  password: number;
  name: number;
  status: number;
  roles: number;
};

class ShopService {
  static async findByEmail({
    email,
    select = { email: 1, password: 2, name: 1, status: 1, roles: 1 },
  }: {
    email: string;
    select?: Select;
  }) {
    try {
      const shop = await Shop.findOne({ email }).select(select).lean();
      return shop;
    } catch (error) {
      if (error instanceof Error) {
      }
    }
  }
}

export { ShopService };
