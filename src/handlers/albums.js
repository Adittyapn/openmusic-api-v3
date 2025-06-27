import AlbumService from '../services/AlbumService.js';

const albumService = new AlbumService();

const addAlbumHandler = async (request, h) => {
  try {
    const { name, year } = request.payload;
    const albumId = await albumService.addAlbum({ name, year });

    const response = h.response({
      status: 'success',
      message: 'Album berhasil ditambahkan',
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  } catch (error) {
    const response = h.response({
      status: 'error',
      message: error.message,
    });
    response.code(500);
    return response;
  }
};

const getAlbumByIdHandler = async (request, h) => {
  try {
    const { id } = request.params;

    const album = await albumService.getAlbumWithSongs(id);

    return {
      status: 'success',
      data: {
        album,
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

const editAlbumByIdHandler = async (request, h) => {
  try {
    const { id } = request.params;
    const { name, year } = request.payload;

    await albumService.editAlbumById(id, { name, year });

    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
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

const deleteAlbumByIdHandler = async (request, h) => {
  try {
    const { id } = request.params;

    await albumService.deleteAlbumById(id);

    return {
      status: 'success',
      message: 'Album berhasil dihapus',
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
  addAlbumHandler,
  getAlbumByIdHandler,
  editAlbumByIdHandler,
  deleteAlbumByIdHandler,
};
