import 'dotenv/config';
import Hapi from '@hapi/hapi';
import Jwt from '@hapi/jwt';
import Inert from '@hapi/inert';
import path from 'path';
import { fileURLToPath } from 'url'; // <-- Impor fungsi ini

// Import semua rute
import albumRoutes from './routes/albums.js';
import songRoutes from './routes/songs.js';
import userRoutes from './routes/users.js';
import authenticationRoutes from './routes/authentications.js';
import playlistRoutes from './routes/playlists.js';
import collaborationRoutes from './routes/collaborations.js';

// Membuat __dirname yang andal untuk ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 5000,
    host: process.env.HOST || 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // Registrasi plugin eksternal
  await server.register([{ plugin: Jwt }, { plugin: Inert }]);

  // Definisi strategi autentikasi JWT
  server.auth.strategy('musicapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        userId: artifacts.decoded.payload.userId,
      },
    }),
  });

  // Daftarkan semua rute dari aplikasi
  server.route(albumRoutes);
  server.route(songRoutes);
  server.route(userRoutes);
  server.route(authenticationRoutes);
  server.route(playlistRoutes);
  server.route(collaborationRoutes);

  // Rute untuk menyajikan file sampul album dari direktori yang benar
  server.route({
    method: 'GET',
    path: '/albums/covers/{param*}',
    handler: {
      directory: {
        path: path.join(__dirname, 'uploads/images'), // <-- Gunakan path.join
      },
    },
  });

  // Penanganan eror global
  server.ext('onPreResponse', (request, h) => {
    const { response } = request;
    if (response.isBoom) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.output.statusCode);
      return newResponse;
    }
    return response.continue || response;
  });

  await server.start();
  console.log(`Server berjalan di ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  console.error(err);
  process.exit(1);
});

init();
