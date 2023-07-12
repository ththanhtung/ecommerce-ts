import { Keytoken } from '../models/keyToken.model';

interface IKeytokenAttrs {
  userId: string;
  publicKey: string;
}

class KeytokenService {
  static createToken = async ({ userId, publicKey }: IKeytokenAttrs) => {
    try {
      const publicKeyString = publicKey;
      const tokens = Keytoken.build({ userId, publicKey: publicKeyString });
      await tokens.save();

      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };
}

export { KeytokenService };
