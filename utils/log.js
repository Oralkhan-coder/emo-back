const winston = require("winston");
const { combine, timestamp, printf, colorize, errors } = winston.format;

const logFormat = printf(({ level, message, timestamp, stack, service }) => {
  return `${timestamp}  ${level}  [${service}]  ${stack || message}`;
});

const logger = winston.createLogger({
  level: "info",
  defaultMeta: { service: "emo-service" },
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), logFormat)
    }),
    new winston.transports.File({
      filename: "logs/application.log",
      format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), logFormat)
    }),
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        logFormat
      )
    }),
  ],
});

module.exports = logger;
