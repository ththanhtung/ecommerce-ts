import mongoose from 'mongoose';
import os from 'os';
import process from 'process';

const INTERVAL_CHECK = 5000;

export const countConnection = (): number => {
  const count = mongoose.connections.length;
  console.log('Number of connection:', count);
  return count;
};

export const OverloadCheck = () => {
  setInterval(() => {
    const dbConnections = countConnection();
    const cpuCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;
    const maxConnection = cpuCores * 2;
    console.log(`Active connection: ${dbConnections}`);

    console.log(`Memory usage: ${memoryUsage / 1024 / 1024}MB`);

    if (dbConnections > maxConnection) {
      console.log('connection overhead detected');
    }
  }, INTERVAL_CHECK);
};
