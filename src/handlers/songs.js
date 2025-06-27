import SongService from '../services/SongService.js';

const songService = new SongService();

const addSongHandler = async (request, h) => {
  try {
    const { title, year, genre, performer, duration, albumId } =
      request.payload;

    const songId = await songService.addSong({
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    });

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan',
      data: {
        songId,
      },
    });
    response.code(201);
    return response;
  } catch (error) {
    if (error.isJoi) {
      const response = h.response({
        status: 'fail',
        message: error.details[0].message,
      });
      response.code(400);
      return response;
    }

    const response = h.response({
      status: 'error',
      message: error.message,
    });
    response.code(500);
    return response;
  }
};

const getSongsHandler = async (request, h) => {
  try {
    const { title = '', performer = '' } = request.query;

    const songs = await songService.getSongs(title, performer);

    return {
      status: 'success',
      data: {
        songs,
      },
    };
  } catch (error) {
    const response = h.response({
      status: 'error',
      message: error.message,
    });
    response.code(500);
    return response;
  }
};

const getSongByIdHandler = async (request, h) => {
  try {
    const { id } = request.params;

    const song = await songService.getSongById(id);

    return {
      status: 'success',
      data: {
        song,
      },
    };
  } catch (error) {
    const response = h.response({
      status: 'fail',
      message: error.message,
    });
    response.code(404);
    return response;
  }
};

const editSongByIdHandler = async (request, h) => {
  try {
    const { id } = request.params;
    const { title, year, genre, performer, duration, albumId } =
      request.payload;

    await songService.editSongById(id, {
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    });

    return {
      status: 'success',
      message: 'Lagu berhasil diperbarui',
    };
  } catch (error) {
    if (error.isJoi) {
      const response = h.response({
        status: 'fail',
        message: error.details[0].message,
      });
      response.code(400);
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

const deleteSongByIdHandler = async (request, h) => {
  try {
    const { id } = request.params;

    await songService.deleteSongById(id);

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus',
    };
  } catch (error) {
    const response = h.response({
      status: 'fail',
      message: error.message,
    });
    response.code(404);
    return response;
  }
};

export {
  addSongHandler,
  getSongsHandler,
  getSongByIdHandler,
  editSongByIdHandler,
  deleteSongByIdHandler,
};
