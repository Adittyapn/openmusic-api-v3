import config from './utils/config.js';
import amqplib from 'amqplib';
import nodemailer from 'nodemailer';
import PlaylistsService from './src/services/PlaylistsService.js';

const init = async () => {
  const playlistsService = new PlaylistsService();
  const connection = await amqplib.connect(config.rabbitMq.server);
  const channel = await connection.createChannel();

  const queue = 'export:playlists';
  await channel.assertQueue(queue, {
    durable: true,
  });

  console.log(`[*] Menunggu pesan di antrian: ${queue}`);

  channel.consume(queue, async (message) => {
    if (message !== null) {
      try {
        const { playlistId, targetEmail } = JSON.parse(
          message.content.toString()
        );

        console.log(
          `[x] Menerima tugas untuk playlist ${playlistId} ke ${targetEmail}`
        );

        const playlist = await playlistsService.getPlaylistSongs(playlistId);
        const result = {
          playlist: {
            id: playlist.id,
            name: playlist.name,
            songs: playlist.songs,
          },
        };

        const transporter = nodemailer.createTransport({
          host: config.smtp.host,
          port: config.smtp.port,
          secure: true,
          auth: {
            user: config.smtp.user,
            pass: config.smtp.pass,
          },
        });

        const mailOptions = {
          from: '"OpenMusic API" <no-reply@openmusic.com>',
          to: targetEmail,
          subject: 'Ekspor Lagu dari Playlist',
          text: 'Terlampir adalah hasil ekspor lagu dari playlist Anda.',
          attachments: [
            {
              filename: `playlist-${playlistId}.json`,
              content: JSON.stringify(result, null, 2),
              contentType: 'application/json',
            },
          ],
        };

        await transporter.sendMail(mailOptions);
        console.log(`[v] Email ekspor berhasil dikirim ke ${targetEmail}`);
      } catch (error) {
        console.error(`[!] Gagal memproses pesan: ${error.message}`);
      } finally {
        channel.ack(message);
      }
    }
  });
};

init();
