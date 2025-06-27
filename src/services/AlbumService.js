import { nanoid } from 'nanoid';
import pool from '../utils/database.js';

class AlbumService {
  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };

    const result = await pool.query(query);

    if (!result.rows[0].id) {
      throw new Error('Album gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getAlbumById(id) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);

    if (!result.rows.length) {
      throw new Error('Album tidak ditemukan');
    }

    return result.rows[0];
  }

  async getAlbumWithSongs(id) {
    const albumQuery = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };

    const songsQuery = {
      text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
      values: [id],
    };

    const albumResult = await pool.query(albumQuery);
    const songsResult = await pool.query(songsQuery);

    if (!albumResult.rows.length) {
      throw new Error('Album tidak ditemukan');
    }

    const album = albumResult.rows[0];
    const songs = songsResult.rows;

    return {
      ...album,
      songs,
    };
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };

    const result = await pool.query(query);

    if (!result.rows.length) {
      throw new Error('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await pool.query(query);

    if (!result.rows.length) {
      throw new Error('Album gagal dihapus. Id tidak ditemukan');
    }
  }
}

export default AlbumService;
