import PlaylistsService from '../services/PlaylistsService.js';
import ProducerService from '../services/ProducerService.js';

const playlistsService = new PlaylistsService();

const postExportPlaylistHandler = async (request, h) => {
  const { id: playlistId } = request.params;
  const { userId } = request.auth.credentials;
  const { targetEmail } = request.payload;

  await playlistsService.verifyPlaylistOwner(playlistId, userId);

  const message = {
    playlistId,
    targetEmail,
  };

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
