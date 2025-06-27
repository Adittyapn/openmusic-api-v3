import { nanoid } from 'nanoid';
import pool from '../utils/database.js';

class PlaylistsService {
  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const result = await pool.query(query);

    if (!result.rows[0].id) {
      throw new Error('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getPlaylistById(id) {
    const query = {
      text: 'SELECT id, name, owner FROM playlists WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    return result.rows[0];
  }

  async getPlaylists(owner) {
    const query = {
      text: `SELECT p.id, p.name, u.username FROM playlists p 
             LEFT JOIN users u ON u.id = p.owner 
             LEFT JOIN collaborations c ON c.playlist_id = p.id 
             WHERE p.owner = $1 OR c.user_id = $1
             GROUP BY p.id, p.name, u.username`,
      values: [owner],
    };

    const result = await pool.query(query);
    return result.rows;
  }

  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new Error('Playlist gagal dihapus. Id tidak ditemukan');
    }
  }

  async addSongToPlaylist(playlistId, songId) {
    const id = `ps-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await pool.query(query);

    if (!result.rows[0].id) {
      throw new Error('Lagu gagal ditambahkan ke playlist');
    }
  }

  async getPlaylistSongs(playlistId) {
    const query = {
      text: `SELECT p.id, p.name, u.username, s.id as song_id, s.title, s.performer 
             FROM playlists p
             LEFT JOIN users u ON u.id = p.owner
             LEFT JOIN playlist_songs ps ON ps.playlist_id = p.id
             LEFT JOIN songs s ON s.id = ps.song_id
             WHERE p.id = $1`,
      values: [playlistId],
    };

    const result = await pool.query(query);

    if (!result.rows.length) {
      throw new Error('Playlist tidak ditemukan');
    }

    const playlist = {
      id: result.rows[0].id,
      name: result.rows[0].name,
      username: result.rows[0].username,
      songs: result.rows[0].song_id
        ? result.rows.map((row) => ({
          id: row.song_id,
          title: row.title,
          performer: row.performer,
        }))
        : [],
    };

    return playlist;
  }

  async deleteSongFromPlaylist(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await pool.query(query);

    if (!result.rows.length) {
      throw new Error('Lagu gagal dihapus dari playlist');
    }
  }

  async verifyPlaylistOwner(playlistId, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const result = await pool.query(query);

    if (!result.rows.length) {
      throw new Error('Playlist tidak ditemukan');
    }

    const playlist = result.rows[0];

    if (playlist.owner !== owner) {
      throw new Error('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error.message === 'Playlist tidak ditemukan') {
        throw error;
      }

      try {
        const collaborationQuery = {
          text: 'SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
          values: [playlistId, userId],
        };
        const result = await pool.query(collaborationQuery);
        if (!result.rows.length) {
          throw new Error('Anda tidak berhak mengakses resource ini');
        }
      } catch (e) {
        throw error;
      }
    }
  }
}

export default PlaylistsService;
