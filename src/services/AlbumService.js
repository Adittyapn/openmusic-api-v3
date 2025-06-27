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
    // Query untuk mendapatkan detail album
    const albumQuery = {
      text: 'SELECT id, name, year, cover_url FROM albums WHERE id = $1',
      values: [id],
    };
    const albumResult = await pool.query(albumQuery);

    if (!albumResult.rows.length) {
      throw new Error('Album tidak ditemukan');
    }

    // Query untuk mendapatkan lagu-lagu dalam album
    const songsQuery = {
      text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
      values: [id],
    };
    const songsResult = await pool.query(songsQuery);

    const album = albumResult.rows[0];
    // Rename cover_url menjadi coverUrl
    album.coverUrl = album.cover_url;
    delete album.cover_url;

    return {
      ...album,
      songs: songsResult.rows,
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

  async addCoverToAlbum(albumId, coverUrl) {
    const query = {
      text: 'UPDATE albums SET cover_url = $1 WHERE id = $2 RETURNING id',
      values: [coverUrl, albumId],
    };
    const result = await pool.query(query);

    if (!result.rows.length) {
      throw new Error('Gagal menambahkan sampul. Id album tidak ditemukan.');
    }
  }

  async addAlbumLike(albumId, userId) {
    await this.getAlbumById(albumId); // Verifikasi album ada

    const checkQuery = {
      text: 'SELECT id FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };
    const checkResult = await pool.query(checkQuery);

    if (checkResult.rows.length > 0) {
      throw new Error('Album sudah Anda sukai');
    }

    const id = `like-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO user_album_likes (id, user_id, album_id) VALUES ($1, $2, $3)',
      values: [id, userId, albumId],
    };
    await pool.query(query);
  }

  async deleteAlbumLike(albumId, userId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
      values: [userId, albumId],
    };
    const result = await pool.query(query);

    if (!result.rows.length) {
      throw new Error('Gagal batal menyukai. Like tidak ditemukan.');
    }
  }

  async getAlbumLikesCount(albumId) {
    const query = {
      text: 'SELECT COUNT(id) FROM user_album_likes WHERE album_id = $1',
      values: [albumId],
    };
    const result = await pool.query(query);
    return parseInt(result.rows[0].count, 10);
  }
}

export default AlbumService;
