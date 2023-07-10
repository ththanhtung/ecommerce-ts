import mongoose from 'mongoose';
import dotenv from 'dotenv'
import { countConnection } from '../helpers/check.connection';

dotenv.config()

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
    if (!process.env.MONGO_URI) {
      throw new Error('Mongo uri must be provided!');
    }
    if (!process.env.DB_NAME) {
      throw new Error('database name must be provided!');
    }
    try {
      mongoose.connect(process.env.MONGO_URI + '/' + process.env.DB_NAME);
      console.log('connected to mongodb');
      countConnection()
    } catch (error) {
      console.log('error occurred while connecting to mongodb:', error);
    }
  }
}

const dbInstance = Database.getInstance();
export { dbInstance };
