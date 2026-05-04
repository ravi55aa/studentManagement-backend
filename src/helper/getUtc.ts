import logger from "@Utils/logger";

export function getISTRange(date:string) {
    try{
        const start = new Date(`${date}T00:00:00.000+05:30`);
        const end = new Date(`${date}T23:59:59.999+05:30`);
    
        return {
            startUTC: start.toISOString(),
            endUTC: end.toISOString(),
        };
    } catch(error){
        logger.error('@getUTC conversion of date to iso',error);
        return null;
    }
}