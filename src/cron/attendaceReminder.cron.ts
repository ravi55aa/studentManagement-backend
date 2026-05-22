import cron from "node-cron";
import logger from "@Utils/logger";

cron.schedule('0 18 * * *',()=>{
    logger.info('Running attendance reminder cron job at 6:00 PM every day');
});