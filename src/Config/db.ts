import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

import logger from '../Utils/logger';

const mongoDB = () => {
  mongoose.connect(process.env.MONGO_URI!)
  .then(() => {
    logger.info("Mongo connected");
  })
  .catch((err) => {
    logger.error(err);
  });
};

export default mongoDB;
