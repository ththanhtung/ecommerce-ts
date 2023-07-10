import { app } from './src/app';
import dotenv from 'dotenv';
import config from './src/config/config.mongodb';

dotenv.config();

const start = () => {
  if (!process.env.PORT) {
    throw new Error('port must be provided');
  }

  const server = app.listen(config.app.port, () => {
    console.log('server is running on port', process.env.PORT);
  });

  process.on('SIGINT', () => {
    server.close(() => {
      console.log('server is closing');
    });
  });
  process.on('SIGTERM', () => {
    server.close(() => {
      console.log('server is closing');
    });
  });
};

start();
