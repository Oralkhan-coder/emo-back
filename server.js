require("dotenv").config();
const express = require("express");
const cors = require("cors");
const logger = require("./utils/log");
const { connectDB } = require("./configs/database");
const { requestLogger, errorHandler } = require("./middlewares/log.middleware");
const userRoutes = require("./routes/user.router")

const PORT = process.env.PORT || 3000;
const app = express();

app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:4200",
    })
);

app.use(express.json());
app.use(requestLogger);
/* --- Routes --- */
app.use('/api/users', userRoutes);
/* --- --- */
app.use(errorHandler);

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            logger.info(`Server running on port ${PORT}`)
        });
    } catch (error) {
        logger.error("Failed to start server", error)
        process.exit(1);
    }
};

startServer();
