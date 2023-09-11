import { Shop } from '../models/shop.model';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { KeytokenService } from './keyToken.service';
import { createTokensPair } from '../helpers/auth.helper';
import { ShopService } from './shop.service';
import { BadRequestError } from '../errors/badRequestError';
import { NotAuthorizeError } from '../errors/notAuthorizeError';
import jwt from 'jsonwebtoken';
import { InternalServerError } from '../errors/InternalServerError';
import { ForbiddenError } from '../errors/forbiddenError';

interface ISignupAttrs {
  name: string;
  email: string;
  password: string;
}
interface ILoginAttrs {
  email: string;
  password: string;
  refeshToken: string | null;
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
  static async refeshToken({ refeshToken }: { refeshToken: string }) {
    const isUsed = await KeytokenService.findByUsedRefeshToken(refeshToken);
    console.log('isUsed:', isUsed.length);
    console.log(refeshToken);
    
    if (isUsed.length > 0) {
      console.log("used token");
      
      throw new ForbiddenError();
    }

    const keyToken = await KeytokenService.findByRefeshToken(refeshToken);

    if (!keyToken) {
      console.log('cannot find key token');
      throw new ForbiddenError();
    }

    const decodedUser = jwt.verify(refeshToken, keyToken.publicKey) as {
      userId: string;
      email: string;
      roles: string[]
    };

    const tokens = await createTokensPair(
      {
        userId: decodedUser.userId,
        email: decodedUser.email,
        roles: decodedUser.roles
      },
      keyToken.privateKey,
      keyToken.publicKey
    );

    try {
      await keyToken.updateOne({
        $set: {
          refeshToken: tokens?.refeshToken,
        },
        $addToSet: {
          refeshTokensUsed: refeshToken,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalServerError();
      }
    }

    return {
      code: 200,
      metadata: {
        user: decodedUser,
        tokens,
      },
    };
  }

  static async Logout(keyStore: any) {
    const delKey = await KeytokenService.removeByID(keyStore._id);
    return delKey;
  }

  static async Login({ email, password, refeshToken = null }: ILoginAttrs) {
    const foundShop = await ShopService.findByEmail({ email });
    // const foundShop = await Shop.findOne({email})
    if (!foundShop) {
      throw new BadRequestError('shop not found');
    }

    const matchPassword = await bcrypt.compare(password, foundShop.password);
    if (!matchPassword) {
      throw new NotAuthorizeError();
    }

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

    const tokens = await createTokensPair(
      { userId: foundShop._id, email, roles: foundShop.roles},
      privateKey,
      publicKey
    );

    KeytokenService.createToken({
      userId: foundShop._id,
      publicKey,
      privateKey,
      refeshToken: tokens?.refeshToken as string,
    });

    return {
      code: 200,
      metadata: { shop: { id: foundShop._id, ...foundShop }, tokens },
    };
  }

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

      //   create tokens pair
      let tokens: { accessToken: string; refeshToken: string } | undefined;
      if (typeof publicKey === 'string') {
        tokens = await createTokensPair(
          { userId: newShop._id, email, roles: newShop.roles},
          privateKey,
          publicKey
        );
        console.log(tokens);
      }

      const publicKeyString = await KeytokenService.createToken({
        userId: newShop._id,
        publicKey,
        privateKey,
        refeshToken: tokens?.refeshToken as string,
      });

      if (!publicKeyString) {
        return {
          code: '500',
          message: 'cannot create public key',
          status: 'error',
        };
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
