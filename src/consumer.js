import 'dotenv/config';
import amqplib from 'amqplib';
import nodemailer from 'nodemailer';
import PlaylistsService from './src/services/PlaylistsService.js';

const init = async () => {
  const playlistsService = new PlaylistsService();
  const connection = await amqplib.connect(process.env.RABBITMQ_SERVER);
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
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          secure: true,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
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
