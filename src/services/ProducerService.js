import config from '../utils/config.js';
import amqplib from 'amqplib';

const ProducerService = {
  sendMessage: async (queue, message) => {
    const connection = await amqplib.connect(config.rabbitMq.server);
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, {
      durable: true,
    });

    await channel.sendToQueue(queue, Buffer.from(message));

    setTimeout(() => {
      connection.close();
    }, 1000);
  },
};

export default ProducerService;
