import { nanoid } from 'nanoid';
import pool from '../utils/database.js';

class SongService {
  async addSong({ title, year, genre, performer, duration, albumId }) {
    const id = `song-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, genre, performer, duration, albumId],
    };

    const result = await pool.query(query);

    if (!result.rows[0].id) {
      throw new Error('Lagu gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getSongs(title = '', performer = '') {
    let query = 'SELECT id, title, performer FROM songs WHERE 1=1';
    const values = [];
    let paramCount = 0;

    if (title) {
      paramCount++;
      query += ` AND title ILIKE $${paramCount}`;
      values.push(`%${title}%`);
    }

    if (performer) {
      paramCount++;
      query += ` AND performer ILIKE $${paramCount}`;
      values.push(`%${performer}%`);
    }

    const result = await pool.query({
      text: query,
      values,
    });

    return result.rows;
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);

    if (!result.rows.length) {
      throw new Error('Lagu tidak ditemukan');
    }

    const song = result.rows[0];

    return {
      id: song.id,
      title: song.title,
      year: song.year,
      performer: song.performer,
      genre: song.genre,
      duration: song.duration,
      albumId: song.album_id,
    };
  }

  async editSongById(id, { title, year, genre, performer, duration, albumId }) {
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING id',
      values: [title, year, genre, performer, duration, albumId, id],
    };

    const result = await pool.query(query);

    if (!result.rows.length) {
      throw new Error('Gagal memperbarui lagu. Id tidak ditemukan');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await pool.query(query);

    if (!result.rows.length) {
      throw new Error('Lagu gagal dihapus. Id tidak ditemukan');
    }
  }
}

export default SongService;
