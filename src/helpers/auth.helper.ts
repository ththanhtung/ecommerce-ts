import jwt from 'jsonwebtoken';

interface IPayloadAttrs {
  userId: string;
  email: string;
  roles: string[]
}

const createTokensPair = async (
  payload: IPayloadAttrs,
  privateKey: string,
  publicKey: string
) => {
  try {
    const accessToken = await jwt.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '5 hours',
    });
    const refeshToken = await jwt.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '2 days',
    });

    jwt.verify(accessToken, publicKey, (err: Error | null, decoded: any) => {
      if (err instanceof Error) {
        console.log('error verify token', err);
        return;
      }
      console.log('decode verify:', decoded);
    });

    return {
      accessToken,
      refeshToken,
    };
  } catch (error) {}
};

export { createTokensPair };
