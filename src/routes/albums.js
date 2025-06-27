import {
  addAlbumHandler,
  getAlbumByIdHandler,
  editAlbumByIdHandler,
  deleteAlbumByIdHandler,
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
];

export default routes;
