import {
  addSongHandler,
  getSongsHandler,
  getSongByIdHandler,
  editSongByIdHandler,
  deleteSongByIdHandler,
} from '../handlers/songs.js';
import { SongPayloadSchema } from '../validator/songs/schema.js';

const routes = [
  {
    method: 'POST',
    path: '/songs',
    handler: addSongHandler,
    options: {
      validate: {
        payload: SongPayloadSchema,
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
    path: '/songs',
    handler: getSongsHandler,
  },
  {
    method: 'GET',
    path: '/songs/{id}',
    handler: getSongByIdHandler,
  },
  {
    method: 'PUT',
    path: '/songs/{id}',
    handler: editSongByIdHandler,
    options: {
      validate: {
        payload: SongPayloadSchema,
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
    path: '/songs/{id}',
    handler: deleteSongByIdHandler,
  },
];

export default routes;
