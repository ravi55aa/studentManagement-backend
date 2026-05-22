import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

import logger from '../Utils/logger';

const mongoDB = () => {
  mongoose.connect(process.env.MONGO_URI!)
  .then(() => {
    console.log("Mongo connected");
  })
  .catch((err) => {
    console.error(err);
  });
};

export default mongoDB;
