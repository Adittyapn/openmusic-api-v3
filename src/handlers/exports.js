import PlaylistsService from '../services/PlaylistsService.js';
import ProducerService from '../services/ProducerService.js';

// Initialize services
const playlistsService = new PlaylistsService();

const postExportPlaylistHandler = async (request, h) => {
  const { id: playlistId } = request.params;
  const { userId } = request.auth.credentials;
  const { targetEmail } = request.payload;

  // Verify playlist ownership
  await playlistsService.verifyPlaylistOwner(playlistId, userId);

  const message = {
    playlistId,
    targetEmail,
  };

  // Send message to RabbitMQ queue
  await ProducerService.sendMessage(
    'export:playlists',
    JSON.stringify(message)
  );

  const response = h.response({
    status: 'success',
    message: 'Permintaan Anda sedang kami proses',
  });
  response.code(201);
  return response;
};

export { postExportPlaylistHandler };
