import path from 'path';
import { fileURLToPath } from 'url';
import AlbumService from '../services/AlbumService.js';
import StorageService from '../services/StorageService.js';
import CacheService from '../services/CacheService.js';
import ClientError from '../exceptions/ClientError.js';
import config from '../utils/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const albumService = new AlbumService();
const storageService = new StorageService(
  path.join(__dirname, '../uploads/images')
);
const cacheService = new CacheService();

const addAlbumHandler = async (request, h) => {
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
};

const getAlbumByIdHandler = async (request) => {
  const { id } = request.params;
  const album = await albumService.getAlbumWithSongs(id);
  return {
    status: 'success',
    data: {
      album,
    },
  };
};

const editAlbumByIdHandler = async (request) => {
  const { id } = request.params;
  const { name, year } = request.payload;
  await albumService.editAlbumById(id, { name, year });
  return {
    status: 'success',
    message: 'Album berhasil diperbarui',
  };
};

const deleteAlbumByIdHandler = async (request) => {
  const { id } = request.params;
  await albumService.deleteAlbumById(id);
  return {
    status: 'success',
    message: 'Album berhasil dihapus',
  };
};

const postUploadCoverHandler = async (request, h) => {
  const { cover } = request.payload;
  const { id: albumId } = request.params;

  // Validasi jika file tidak diunggah atau tipe filenya salah
  if (!cover) {
    throw new ClientError('Tidak ada gambar yang diunggah');
  }

  const { headers } = cover.hapi;
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (!allowedMimeTypes.includes(headers['content-type'])) {
    throw new ClientError(
      'Tipe file tidak valid. Hanya gambar yang diperbolehkan.'
    );
  }

  const filename = await storageService.writeFile(cover, cover.hapi);
  const coverUrl = `http://${config.app.host}:${config.app.port}/albums/covers/${filename}`;

  await albumService.addCoverToAlbum(albumId, coverUrl);

  const response = h.response({
    status: 'success',
    message: 'Sampul berhasil diunggah',
  });
  response.code(201);
  return response;
};

const postAlbumLikeHandler = async (request, h) => {
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
};

const deleteAlbumLikeHandler = async (request) => {
  const { id: albumId } = request.params;
  const { userId } = request.auth.credentials;

  await albumService.deleteAlbumLike(albumId, userId);
  await cacheService.delete(`album-likes:${albumId}`);

  return {
    status: 'success',
    message: 'Berhasil batal menyukai album',
  };
};

const getAlbumLikesHandler = async (request, h) => {
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
