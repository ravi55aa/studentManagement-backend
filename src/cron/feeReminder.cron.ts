import logger from "@Utils/logger";
import cron from "node-cron";

cron.schedule('0 9 * * *', () => {
    logger.info('Running fee reminder cron job at 9:00 AM every day');
}); 

