// src/handlers/collaborations.js

import CollaborationsService from '../services/CollaborationsService.js';
import PlaylistsService from '../services/PlaylistsService.js';
import UsersService from '../services/UsersService.js';

const collaborationsService = new CollaborationsService();
const playlistsService = new PlaylistsService();
const usersService = new UsersService();

const postCollaborationHandler = async (request, h) => {
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
};

const deleteCollaborationHandler = async (request) => {
  const { playlistId, userId } = request.payload;
  const { userId: credentialId } = request.auth.credentials;

  await playlistsService.verifyPlaylistOwner(playlistId, credentialId);
  await collaborationsService.deleteCollaboration(playlistId, userId);

  return {
    status: 'success',
    message: 'Kolaborasi berhasil dihapus',
  };
};

export { postCollaborationHandler, deleteCollaborationHandler };
