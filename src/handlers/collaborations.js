import CollaborationsService from '../services/CollaborationsService.js';
import PlaylistsService from '../services/PlaylistsService.js';
import UsersService from '../services/UsersService.js';

const collaborationsService = new CollaborationsService();
const playlistsService = new PlaylistsService();
const usersService = new UsersService();

const postCollaborationHandler = async (request, h) => {
  try {
    const { playlistId, userId } = request.payload;
    const { userId: credentialId } = request.auth.credentials;

    await playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await usersService.getUserById(userId);

    const collaborationId = await collaborationsService.addCollaboration(
      playlistId,
      userId
    );

    const response = h.response({
      status: 'success',
      message: 'Kolaborasi berhasil ditambahkan',
      data: {
        collaborationId,
      },
    });
    response.code(201);
    return response;
  } catch (error) {
    if (error.message === 'Anda tidak berhak mengakses resource ini') {
      const response = h.response({
        status: 'fail',
        message: error.message,
      });
      response.code(403);
      return response;
    }

    if (error.message.includes('tidak ditemukan')) {
      const response = h.response({
        status: 'fail',
        message: error.message,
      });
      response.code(404);
      return response;
    }

    const response = h.response({
      status: 'fail',
      message: error.message,
    });
    response.code(400);
    return response;
  }
};

const deleteCollaborationHandler = async (request, h) => {
  try {
    const { playlistId, userId } = request.payload;
    const { userId: credentialId } = request.auth.credentials;

    await playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await collaborationsService.deleteCollaboration(playlistId, userId);

    return {
      status: 'success',
      message: 'Kolaborasi berhasil dihapus',
    };
  } catch (error) {
    if (error.message === 'Anda tidak berhak mengakses resource ini') {
      const response = h.response({
        status: 'fail',
        message: error.message,
      });
      response.code(403);
      return response;
    }

    const response = h.response({
      status: 'fail',
      message: error.message,
    });
    response.code(400);
    return response;
  }
};

export { postCollaborationHandler, deleteCollaborationHandler };
