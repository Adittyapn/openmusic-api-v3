import { postExportPlaylistHandler } from '../handlers/exports.js';
import { ExportPlaylistPayloadSchema } from '../validator/exports/schema.js';

const routes = [
  {
    method: 'POST',
    path: '/export/playlists/{id}',
    handler: postExportPlaylistHandler,
    options: {
      auth: 'musicapp_jwt',
      validate: {
        payload: ExportPlaylistPayloadSchema,
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
];

export default routes;
