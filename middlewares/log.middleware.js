const logger = require("../utils/log");

const requestLogger = (req, res, next) => {
    logger.info(`${req.method} ${req.originalUrl}`);

    res.on("finish", () => {
        logger.info(`${req.method} ${req.originalUrl} → ${res.statusCode}`);
    });

    next();
};

const errorHandler = (err, req, res, next) => {
    logger.error(`Global error: ${err.message}`, { stack: err.stack });

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal server error",
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
};

module.exports = { requestLogger, errorHandler };
