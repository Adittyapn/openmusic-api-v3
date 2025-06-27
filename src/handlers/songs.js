// src/handlers/songs.js

import SongService from '../services/SongService.js';

const songService = new SongService();

const addSongHandler = async (request, h) => {
  const { title, year, genre, performer, duration, albumId } = request.payload;
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
};

const getSongsHandler = async (request) => {
  const { title = '', performer = '' } = request.query;
  const songs = await songService.getSongs(title, performer);

  return {
    status: 'success',
    data: {
      songs,
    },
  };
};

const getSongByIdHandler = async (request) => {
  const { id } = request.params;
  const song = await songService.getSongById(id);

  return {
    status: 'success',
    data: {
      song,
    },
  };
};

const editSongByIdHandler = async (request) => {
  const { id } = request.params;
  const { title, year, genre, performer, duration, albumId } = request.payload;
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
};

const deleteSongByIdHandler = async (request) => {
  const { id } = request.params;
  await songService.deleteSongById(id);

  return {
    status: 'success',
    message: 'Lagu berhasil dihapus',
  };
};

export {
  addSongHandler,
  getSongsHandler,
  getSongByIdHandler,
  editSongByIdHandler,
  deleteSongByIdHandler,
};
