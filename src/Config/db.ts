import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

import logger from '../Utils/logger';

const mongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    logger.info('[Database] connected 📊🔐');
  } catch (err) {
    throw new Error('Database error', { cause: err });
  }
};

export default mongoDB;
