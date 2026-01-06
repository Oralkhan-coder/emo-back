const logger = require("../utils/log");

const requestLogger = (req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);

  res.on("finish", () => {
    logger.info(`${req.method} ${req.originalUrl} → ${res.statusCode}`);
  });

  next();
};

const errorHandler = (err, req, res, next) => {
  logger.error(err.message, err);
  res.status(500).json({ message: "Internal Server Error" });
};

module.exports = { requestLogger, errorHandler };
