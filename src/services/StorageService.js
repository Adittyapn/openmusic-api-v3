import fs from 'fs';
import path from 'path';

/**
 * Service untuk menangani penyimpanan file lokal.
 */
class StorageService {
  constructor(folder) {
    this._folder = folder;

    // Membuat folder jika belum ada
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
  }

  /**
   * Menulis file ke dalam sistem penyimpanan.
   * @param {ReadableStream} file - Stream file yang akan ditulis.
   * @param {object} meta - Metadata file.
   * @returns {Promise<string>} - Nama file yang disimpan.
   */
  writeFile(file, meta) {
    const filename = +new Date() + meta.filename;
    const filePath = path.resolve(this._folder, filename);
    const fileStream = fs.createWriteStream(filePath);

    return new Promise((resolve, reject) => {
      fileStream.on('error', (error) => reject(error));
      file.pipe(fileStream);
      file.on('end', () => resolve(filename));
    });
  }
}

export default StorageService;
