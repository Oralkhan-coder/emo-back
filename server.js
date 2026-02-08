require("dotenv").config();
const express = require("express");
const cors = require("cors");
const logger = require("./utils/log");
const { connectDB } = require("./configs/database");
const { requestLogger, errorHandler } = require("./middlewares/log.middleware");

const PORT = process.env.PORT || 3000;
const app = express();

app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:4200",
    })
);

app.use(express.json());
app.use(requestLogger);
app.use('/api/users', require("./routes/user.router"));
app.use('/api/auth', require("./routes/auth.router"));
app.use('/api/sellers', require("./routes/seller.router"));
app.use('/api/products', require("./routes/product.router"));
app.use('/api/categories', require("./routes/category.router"));
app.use('/api/variants', require("./routes/productVariant.router"));
app.use('/api/images', require("./routes/productImage.router"));
app.use('/api/cart', require("./routes/cart.router"));
app.use('/api/orders', require("./routes/order.router"));
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
