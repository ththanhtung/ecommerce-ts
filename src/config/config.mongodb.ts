import dotenv from 'dotenv';

dotenv.config();

interface IConfig {
  [key: string]: {
    app: {
      port: string;
    };
    database: {
      port: string;
      host: string;
      name: string;
    };
  };
}

if (!process.env.PORT) {
  throw new Error('application port must be provided');
}
if (!process.env.DB_PORT) {
  throw new Error('database port must be provided');
}
if (!process.env.DB_HOST) {
  throw new Error('database host must be provided');
}
if (!process.env.DB_NAME) {
  throw new Error('database name must be provided');
}
if (!process.env.PROD_PORT) {
  throw new Error('application port must be provided');
}
if (!process.env.PROD_DB_PORT) {
  throw new Error('database port must be provided');
}
if (!process.env.PROD_DB_HOST) {
  throw new Error('database host must be provided');
}
if (!process.env.PROD_DB_NAME) {
  throw new Error('database name must be provided');
}
const dev = {
  app: {
    port: process.env.PORT,
  },
  database: {
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    name: process.env.DB_NAME,
  },
};
const prod = {
  app: {
    port: process.env.PROD_PORT,
  },
  database: {
    port: process.env.PROD_DB_PORT,
    host: process.env.PROD_DB_HOST,
    name: process.env.PROD_DB_NAME,
  },
};

const config: IConfig = {
  dev,
  prod,
};

const env: string = process.env.NODE_ENV || 'dev';

export default config[env];
