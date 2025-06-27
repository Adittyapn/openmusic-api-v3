import AuthenticationsService from '../services/AuthenticationsService.js';
import UsersService from '../services/UsersService.js';
import TokenManager from '../tokenize/TokenManager.js';

const authenticationsService = new AuthenticationsService();
const usersService = new UsersService();

const postAuthenticationHandler = async (request, h) => {
  const { username, password } = request.payload;
  const id = await usersService.verifyUserCredential(username, password);

  const accessToken = TokenManager.generateAccessToken({ userId: id });
  const refreshToken = TokenManager.generateRefreshToken({ userId: id });

  await authenticationsService.addRefreshToken(refreshToken);

  const response = h.response({
    status: 'success',
    message: 'Authentication berhasil ditambahkan',
    data: {
      accessToken,
      refreshToken,
    },
  });
  response.code(201);
  return response;
};

const putAuthenticationHandler = async (request) => {
  const { refreshToken } = request.payload;
  await authenticationsService.verifyRefreshToken(refreshToken);
  const { userId } = TokenManager.verifyRefreshToken(refreshToken);

  const accessToken = TokenManager.generateAccessToken({ userId });

  return {
    status: 'success',
    message: 'Access Token berhasil diperbarui',
    data: {
      accessToken,
    },
  };
};

const deleteAuthenticationHandler = async (request) => {
  const { refreshToken } = request.payload;
  await authenticationsService.verifyRefreshToken(refreshToken);
  await authenticationsService.deleteRefreshToken(refreshToken);

  return {
    status: 'success',
    message: 'Refresh token berhasil dihapus',
  };
};

export {
  postAuthenticationHandler,
  putAuthenticationHandler,
  deleteAuthenticationHandler,
};
