import { Shop } from '../models/shop.model';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { KeytokenService } from './keyToken.service';
import { createTokensPair } from '../helpers/auth.helper';

interface ISignupAttrs {
  name: string;
  email: string;
  password: string;
}

interface IResponse {
  code: string;
  message: string;
  status: string;
}

enum Roles {
  SHOP = '001',
  WRITER = '002',
  EDITOR = '003',
  ADMIN = '004',
}

class AuthService {
  static Signup: (attrs: ISignupAttrs) => any = async ({
    name,
    email,
    password,
  }) => {
    try {
      // check if email is existed
      const isExisted = await Shop.findOne({
        email,
      }).lean();

      console.log(isExisted);

      if (isExisted) {
        return {
          code: '400',
          message: 'shop existed',
          status: 'error',
        };
      }
      // hash password
      const hashedPassword = await bcrypt.hash(password, 8);

      // create new shop
      const newShop = Shop.build({
        email,
        name,
        password: hashedPassword,
        roles: [Roles.SHOP],
      });

      await newShop.save();

      if (!newShop) {
        return {
          code: '500',
          message: 'cannot create new shop',
          status: 'error',
        };
      }

      // create private and public key
      const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem',
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem',
        },
      });

      const publicKeyString = await KeytokenService.createToken({
        userId: newShop._id,
        publicKey,
      });

      if (!publicKeyString) {
        return {
          code: '500',
          message: 'cannot create public key',
          status: 'error',
        };
      }

      //   create tokens pair
      let tokens: { accessToken: string; refeshToken: string } | undefined;
      if (typeof publicKeyString === 'string') {
        tokens = await createTokensPair(
          { userId: newShop._id, email },
          privateKey,
          publicKeyString
        );
        console.log(tokens);
      }

      // return response
      return {
        code: '201',
        metadata: {
          shop: newShop,
          tokens,
        },
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          code: '',
          message: error.message,
          status: 'error',
        };
      }
      return {
        code: '500',
        message: 'unexpected error',
        status: 'error',
      };
    }
  };
}

export { AuthService };
