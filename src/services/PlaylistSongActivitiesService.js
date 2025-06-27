import { nanoid } from 'nanoid';
import pool from '../utils/database.js';

class PlaylistSongActivitiesService {
  async addActivity({ playlistId, songId, userId, action }) {
    const id = `activity-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, playlistId, songId, userId, action],
    };

    const result = await pool.query(query);

    if (!result.rows[0].id) {
      throw new Error('Aktivitas gagal dicatat');
    }
  }

  async getActivities(playlistId) {
    const query = {
      text: `SELECT u.username, s.title, psa.action, psa.time 
             FROM playlist_song_activities psa
             LEFT JOIN users u ON u.id = psa.user_id
             LEFT JOIN songs s ON s.id = psa.song_id
             WHERE psa.playlist_id = $1
             ORDER BY psa.time ASC`,
      values: [playlistId],
    };

    const result = await pool.query(query);
    return result.rows;
  }
}

export default PlaylistSongActivitiesService;
