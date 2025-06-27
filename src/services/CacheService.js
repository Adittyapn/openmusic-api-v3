import config from '../utils/config.js';
import redis from 'redis';

/**
 * Service untuk caching menggunakan Redis.
 */
class CacheService {
  constructor() {
    this._client = redis.createClient({
      url: config.redis.host,
    });

    this._client.on('error', (error) => {
      console.error('Redis Error:', error);
    });

    this._client.connect();
  }

  /**
   * Menyimpan data ke cache.
   * @param {string} key - Kunci cache.
   * @param {string} value - Nilai yang akan disimpan.
   * @param {number} expirationInSecond - Waktu kedaluwarsa dalam detik.
   */
  async set(key, value, expirationInSecond = 1800) {
    // Default 30 menit
    await this._client.set(key, value, {
      EX: expirationInSecond,
    });
  }

  /**
   * Mengambil data dari cache.
   * @param {string} key - Kunci cache.
   * @returns {Promise<string|null>} - Nilai dari cache.
   */
  async get(key) {
    const result = await this._client.get(key);
    if (result === null) throw new Error('Cache tidak ditemukan');
    return result;
  }

  /**
   * Menghapus data dari cache.
   * @param {string} key - Kunci cache yang akan dihapus.
   */
  delete(key) {
    return this._client.del(key);
  }
}

export default CacheService;
