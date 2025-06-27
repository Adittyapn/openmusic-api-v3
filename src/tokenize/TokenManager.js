import config from '../utils/config.js';
import Jwt from '@hapi/jwt';
import ClientError from '../exceptions/ClientError.js';

const TokenManager = {
  generateAccessToken: (payload) =>
    Jwt.token.generate(payload, config.jwt.accessTokenKey),
  generateRefreshToken: (payload) =>
    Jwt.token.generate(payload, config.jwt.refreshTokenKey),
  verifyRefreshToken: (refreshToken) => {
    try {
      const artifacts = Jwt.token.decode(refreshToken);
      Jwt.token.verifySignature(artifacts, config.jwt.refreshTokenKey);
      const { payload } = artifacts.decoded;
      return payload;
    } catch (error) {
      throw new ClientError('Refresh token tidak valid');
    }
  },
};

export default TokenManager;
