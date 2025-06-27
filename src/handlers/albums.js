import config from '../utils/config.js';
import path from 'path';
import { fileURLToPath } from 'url';
import AlbumService from '../services/AlbumService.js';
import StorageService from '../services/StorageService.js';
import CacheService from '../services/CacheService.js';

// Membuat __dirname yang andal untuk ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inisialisasi service dengan path yang benar
const albumService = new AlbumService();
const storageService = new StorageService(
  path.join(__dirname, '../uploads/images')
);
const cacheService = new CacheService();

const addAlbumHandler = async (request, h) => {
  try {
    const { name, year } = request.payload;
    const albumId = await albumService.addAlbum({ name, year });

    const response = h.response({
      status: 'success',
      message: 'Album berhasil ditambahkan',
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  } catch (error) {
    const response = h.response({
      status: 'error',
      message: error.message,
    });
    response.code(500);
    return response;
  }
};

const getAlbumByIdHandler = async (request, h) => {
  try {
    const { id } = request.params;

    const album = await albumService.getAlbumWithSongs(id);

    return {
      status: 'success',
      data: {
        album,
      },
    };
  } catch (error) {
    const response = h.response({
      status: 'fail',
      message: error.message,
    });
    response.code(404);
    return response;
  }
};

const editAlbumByIdHandler = async (request, h) => {
  try {
    const { id } = request.params;
    const { name, year } = request.payload;

    await albumService.editAlbumById(id, { name, year });

    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    };
  } catch (error) {
    const response = h.response({
      status: 'fail',
      message: error.message,
    });
    response.code(404);
    return response;
  }
};

const deleteAlbumByIdHandler = async (request, h) => {
  try {
    const { id } = request.params;

    await albumService.deleteAlbumById(id);

    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  } catch (error) {
    const response = h.response({
      status: 'fail',
      message: error.message,
    });
    response.code(404);
    return response;
  }
};
const postUploadCoverHandler = async (request, h) => {
  try {
    const { cover } = request.payload;
    const { id: albumId } = request.params;

    // URL untuk sampul harus relatif terhadap path yang disajikan oleh server
    const filename = await storageService.writeFile(cover, cover.hapi);
    const coverUrl = `http://${config.app.host}:${config.app.port}/albums/covers/${filename}`;

    await albumService.addCoverToAlbum(albumId, coverUrl);

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });
    response.code(201);
    return response;
  } catch (error) {
    const response = h.response({ status: 'fail', message: error.message });
    response.code(400); // Atau kode eror yang lebih sesuai
    return response;
  }
};

const postAlbumLikeHandler = async (request, h) => {
  try {
    const { id: albumId } = request.params;
    const { userId } = request.auth.credentials;

    await albumService.addAlbumLike(albumId, userId);
    await cacheService.delete(`album-likes:${albumId}`);

    const response = h.response({
      status: 'success',
      message: 'Berhasil menyukai album',
    });
    response.code(201);
    return response;
  } catch (error) {
    const response = h.response({ status: 'fail', message: error.message });
    response.code(error.message.includes('sudah') ? 400 : 404);
    return response;
  }
};

const deleteAlbumLikeHandler = async (request, h) => {
  try {
    const { id: albumId } = request.params;
    const { userId } = request.auth.credentials;

    await albumService.deleteAlbumLike(albumId, userId);
    await cacheService.delete(`album-likes:${albumId}`);

    return {
      status: 'success',
      message: 'Berhasil batal menyukai album',
    };
  } catch (error) {
    const response = h.response({ status: 'fail', message: error.message });
    response.code(404);
    return response;
  }
};

const getAlbumLikesHandler = async (request, h) => {
  try {
    const { id: albumId } = request.params;
    let likes;
    let source = 'server';

    try {
      const cachedLikes = await cacheService.get(`album-likes:${albumId}`);
      likes = JSON.parse(cachedLikes);
      source = 'cache';
    } catch (error) {
      likes = await albumService.getAlbumLikesCount(albumId);
      await cacheService.set(`album-likes:${albumId}`, JSON.stringify(likes));
    }

    const response = h.response({
      status: 'success',
      data: {
        likes,
      },
    });
    response.header('X-Data-Source', source);
    return response;
  } catch (error) {
    const response = h.response({ status: 'fail', message: error.message });
    response.code(404);
    return response;
  }
};

export {
  addAlbumHandler,
  getAlbumByIdHandler,
  editAlbumByIdHandler,
  deleteAlbumByIdHandler,
  postUploadCoverHandler,
  postAlbumLikeHandler,
  deleteAlbumLikeHandler,
  getAlbumLikesHandler,
};
