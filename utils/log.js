const winston = require("winston");
const { combine, timestamp, printf, colorize, errors } = winston.format;

// Define log format
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
    // File for errors
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), logFormat)
    }),
    // File for general logs
    new winston.transports.File({
      filename: "logs/application.log",
      format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), logFormat)
    }),
    // Console logs
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
