import logger from '@Utils/logger';
import { createClient } from 'redis';

import env from './env.config';

const redisClient = createClient({
  url: env.REDIS_URL!,
}) as ReturnType<typeof createClient>;

redisClient.on('error', (err) => logger.warn('Redis Client Connect Error', err));

export const connectRedisClient = async () => {
  try {
    await redisClient.connect();
    logger.info('Redis connected👍🏾');
  } catch (error) {
    logger.error('Redis Connect Error:', error);
  }
};

export default redisClient;
