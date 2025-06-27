import {
  postPlaylistHandler,
  getPlaylistsHandler,
  deletePlaylistHandler,
  postSongToPlaylistHandler,
  getPlaylistSongsHandler,
  deleteSongFromPlaylistHandler,
  getPlaylistActivitiesHandler,
} from '../handlers/playlists.js';
import {
  PlaylistPayloadSchema,
  SongToPlaylistPayloadSchema,
} from '../validator/playlists/schema.js';

const routes = [
  {
    method: 'POST',
    path: '/playlists',
    handler: postPlaylistHandler,
    options: {
      auth: 'musicapp_jwt',
      validate: {
        payload: PlaylistPayloadSchema,
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
    path: '/playlists',
    handler: getPlaylistsHandler,
    options: {
      auth: 'musicapp_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}',
    handler: deletePlaylistHandler,
    options: {
      auth: 'musicapp_jwt',
    },
  },
  {
    method: 'POST',
    path: '/playlists/{id}/songs',
    handler: postSongToPlaylistHandler,
    options: {
      auth: 'musicapp_jwt',
      validate: {
        payload: SongToPlaylistPayloadSchema,
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
    path: '/playlists/{id}/songs',
    handler: getPlaylistSongsHandler,
    options: {
      auth: 'musicapp_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}/songs',
    handler: deleteSongFromPlaylistHandler,
    options: {
      auth: 'musicapp_jwt',
      validate: {
        payload: SongToPlaylistPayloadSchema,
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
    path: '/playlists/{id}/activities',
    handler: getPlaylistActivitiesHandler,
    options: {
      auth: 'musicapp_jwt',
    },
  },
];

export default routes;
