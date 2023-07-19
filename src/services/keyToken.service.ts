import { Types } from 'mongoose';
import { Keytoken } from '../models/keyToken.model';
import { NotFoundError } from '../errors/notFoundError';
import { InternalServerError } from '../errors/InternalServerError';

interface IKeytokenAttrs {
  userId: string;
  publicKey: string;
  privateKey: string;
  refeshToken: string;
}

class KeytokenService {
  static createToken = async ({
    userId,
    publicKey,
    privateKey,
    refeshToken,
  }: IKeytokenAttrs) => {
    try {
      const refeshTokensUsed: string[] = [];

      const filter = { userId: new Types.ObjectId(userId) },
        update = { publicKey, privateKey, refeshTokensUsed, refeshToken },
        options = { upsert: true, new: true };
      const tokens = await Keytoken.findOneAndUpdate(filter, update, options);

      return tokens ? tokens.publicKey : null;
    } catch (error) {
      if (error instanceof Error) {
        return error;
      }
    }
  };

  static async removeByID(id: string) {
    try {
      return await Keytoken.findByIdAndRemove(id);
    } catch (error) {
      throw new InternalServerError();
    }
  }

  static async findByUserID(id: string) {
    try {
      return await Keytoken.findOne({ userId: new Types.ObjectId(id) }).lean();
    } catch (error) {
      if (error instanceof Error) {
        throw new NotFoundError();
      }
    }
  }

  static async findByRefeshToken(refeshToken: string) {
    return await Keytoken.findOne({ refeshToken });
  }

  static async findByUsedRefeshToken(usedRefeshToken: string) {
    return await Keytoken.find({
      refeshTokensUsed: { $in: [usedRefeshToken] },
    }).lean();
  }
}

export { KeytokenService };
