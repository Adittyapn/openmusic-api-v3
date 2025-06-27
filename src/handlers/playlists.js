import PlaylistsService from '../services/PlaylistsService.js';
import SongService from '../services/SongService.js';
import PlaylistSongActivitiesService from '../services/PlaylistSongActivitiesService.js';

const playlistsService = new PlaylistsService();
const songService = new SongService();
const activitiesService = new PlaylistSongActivitiesService();

const postPlaylistHandler = async (request, h) => {
  try {
    const { name } = request.payload;
    const { userId } = request.auth.credentials;

    const playlistId = await playlistsService.addPlaylist({
      name,
      owner: userId,
    });

    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  } catch (error) {
    const response = h.response({
      status: 'fail',
      message: error.message,
    });
    response.code(500);
    return response;
  }
};

const getPlaylistsHandler = async (request, h) => {
  try {
    const { userId } = request.auth.credentials;
    const playlists = await playlistsService.getPlaylists(userId);

    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  } catch (error) {
    const response = h.response({
      status: 'fail',
      message: error.message,
    });
    response.code(500);
    return response;
  }
};

const deletePlaylistHandler = async (request, h) => {
  try {
    const { id } = request.params;
    const { userId } = request.auth.credentials;

    await playlistsService.verifyPlaylistOwner(id, userId);
    await playlistsService.deletePlaylistById(id);

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
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
    response.code(404);
    return response;
  }
};

const postSongToPlaylistHandler = async (request, h) => {
  try {
    const { songId } = request.payload;
    const { id: playlistId } = request.params;
    const { userId } = request.auth.credentials;

    await songService.getSongById(songId);
    await playlistsService.verifyPlaylistAccess(playlistId, userId);
    await playlistsService.addSongToPlaylist(playlistId, songId);

    await activitiesService.addActivity({
      playlistId,
      songId,
      userId,
      action: 'add',
    });

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke playlist',
    });
    response.code(201);
    return response;
  } catch (error) {
    // Handle song not found error
    if (
      error.message.includes('Lagu tidak ditemukan') ||
      error.message.includes('Song tidak ditemukan')
    ) {
      const response = h.response({
        status: 'fail',
        message: error.message,
      });
      response.code(404);
      return response;
    }

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

const getPlaylistSongsHandler = async (request, h) => {
  try {
    const { id: playlistId } = request.params;
    const { userId } = request.auth.credentials;

    await playlistsService.verifyPlaylistAccess(playlistId, userId);
    const playlist = await playlistsService.getPlaylistSongs(playlistId);

    return {
      status: 'success',
      data: {
        playlist,
      },
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
    response.code(404);
    return response;
  }
};

const deleteSongFromPlaylistHandler = async (request, h) => {
  try {
    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    const { userId } = request.auth.credentials;

    await playlistsService.verifyPlaylistAccess(playlistId, userId);
    await playlistsService.deleteSongFromPlaylist(playlistId, songId);

    await activitiesService.addActivity({
      playlistId,
      songId,
      userId,
      action: 'delete',
    });

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
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

const getPlaylistActivitiesHandler = async (request, h) => {
  try {
    const { id: playlistId } = request.params;
    const { userId } = request.auth.credentials;

    await playlistsService.verifyPlaylistAccess(playlistId, userId);
    const activities = await activitiesService.getActivities(playlistId);

    return {
      status: 'success',
      data: {
        playlistId,
        activities,
      },
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
    response.code(404);
    return response;
  }
};

export {
  postPlaylistHandler,
  getPlaylistsHandler,
  deletePlaylistHandler,
  postSongToPlaylistHandler,
  getPlaylistSongsHandler,
  deleteSongFromPlaylistHandler,
  getPlaylistActivitiesHandler,
};
