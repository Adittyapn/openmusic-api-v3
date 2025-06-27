import {
  addAlbumHandler,
  getAlbumByIdHandler,
  editAlbumByIdHandler,
  deleteAlbumByIdHandler,
  postUploadCoverHandler,
  postAlbumLikeHandler,
  deleteAlbumLikeHandler,
  getAlbumLikesHandler,
} from '../handlers/albums.js';
import { AlbumPayloadSchema } from '../validator/albums/schema.js';

const routes = [
  {
    method: 'POST',
    path: '/albums',
    handler: addAlbumHandler,
    options: {
      validate: {
        payload: AlbumPayloadSchema,
        failAction: (request, h, error) => {
          const response = h.response({
            status: 'fail',
            message: error.details[0].message,
          });
          response.code(400);
          return response.takeover();
        },
      },
    },
  },
  {
    method: 'GET',
    path: '/albums/{id}',
    handler: getAlbumByIdHandler,
  },
  {
    method: 'PUT',
    path: '/albums/{id}',
    handler: editAlbumByIdHandler,
    options: {
      validate: {
        payload: AlbumPayloadSchema,
        failAction: (request, h, error) => {
          const response = h.response({
            status: 'fail',
            message: error.details[0].message,
          });
          response.code(400);
          return response.takeover();
        },
      },
    },
  },
  {
    method: 'DELETE',
    path: '/albums/{id}',
    handler: deleteAlbumByIdHandler,
  },
  {
    method: 'POST',
    path: '/albums/{id}/covers',
    handler: postUploadCoverHandler,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        maxBytes: 512000,
      },
    },
  },
  {
    method: 'POST',
    path: '/albums/{id}/likes',
    handler: postAlbumLikeHandler,
    options: {
      auth: 'musicapp_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/albums/{id}/likes',
    handler: deleteAlbumLikeHandler,
    options: {
      auth: 'musicapp_jwt',
    },
  },
  {
    method: 'GET',
    path: '/albums/{id}/likes',
    handler: getAlbumLikesHandler,
  },
];

export default routes;
