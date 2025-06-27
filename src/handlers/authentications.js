// authentications.js

import AuthenticationsService from '../services/AuthenticationsService.js';
import UsersService from '../services/UsersService.js';
import TokenManager from '../tokenize/TokenManager.js';

const authenticationsService = new AuthenticationsService();
const usersService = new UsersService();

const postAuthenticationHandler = async (request, h) => {
  try {
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
  } catch (error) {
    // Check if it's an authentication error (invalid credentials)
    if (
      error.message.includes('Kredensial yang Anda berikan salah') ||
      error.message.includes('tidak ditemukan')
    ) {
      const response = h.response({
        status: 'fail',
        message: error.message,
      });
      response.code(401);
      return response;
    }

    const response = h.response({
      status: 'fail',
      message: error.message,
    });
    response.code(400);
    return response;
  }
};

const putAuthenticationHandler = async (request, h) => {
  try {
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
  } catch (error) {
    const response = h.response({
      status: 'fail',
      message: error.message,
    });
    response.code(400);
    return response;
  }
};

const deleteAuthenticationHandler = async (request, h) => {
  try {
    const { refreshToken } = request.payload;

    await authenticationsService.verifyRefreshToken(refreshToken);
    await authenticationsService.deleteRefreshToken(refreshToken);

    return {
      status: 'success',
      message: 'Refresh token berhasil dihapus',
    };
  } catch (error) {
    const response = h.response({
      status: 'fail',
      message: error.message,
    });
    response.code(400);
    return response;
  }
};

export {
  postAuthenticationHandler,
  putAuthenticationHandler,
  deleteAuthenticationHandler,
};
