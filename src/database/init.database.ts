import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { countConnection } from '../helpers/check.connection';
import config from '../config/config.mongodb';

dotenv.config();

class Database {
  private static instance: Database;
  static getInstance() {
    if (!Database.instance) {
      this.instance = new Database();
    }
    return this.instance;
  }

  constructor() {
    this.connect();
  }

  connect() {
    try {
      const { host, port, name } = config.database;
      mongoose.connect(`${host}:${port}/${name}`);
      console.log('connected to mongodb');
      countConnection();
    } catch (error) {
      console.log('error occurred while connecting to mongodb:', error);
    }
  }
}

const dbInstance = Database.getInstance();
export { dbInstance };
