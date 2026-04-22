import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const transport = new DailyRotateFile({
  //combined error
  filename: 'logs/app-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '7d', //  retention: keep logs for 7 days
  zippedArchive: true, // compress old logs
});

const errorTransport = new DailyRotateFile({
  filename: 'logs/error.log',
  level: 'error',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '7d', //  retention: keep logs for 7 days
  zippedArchive: true, // compress old logs
});

const infoTransport = new DailyRotateFile({
  filename: 'logs/info.log',
  level: 'info',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '7d', //  retention: keep logs for 7 days
  zippedArchive: true, // compress old logs
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console(),
    infoTransport,
    errorTransport,
    transport, //combined log
  ],
});

export default logger;
