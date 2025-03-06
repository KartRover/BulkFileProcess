import { Queue } from 'bullmq';
import { Redis } from 'ioredis';
import config from '../config';

export const connection = new Redis({
  host: config.REDIS_HOST,
  port: Number(config.REDIS_PORT),
});

const logProcessingQueue = new Queue('log-processing-queue', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
  },
});

export const getQueue = () => logProcessingQueue;

export default logProcessingQueue;