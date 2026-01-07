require("dotenv").config();
const mongoose = require('mongoose');
const logger = require('../utils/log')

const dbUrl = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017";
const dbName = process.env.MONGODB_DB_NAME || "emo_db";

const connectDB = async () => {
  try {
    // Ensure no double slashes if dbUrl ends with /
    const cleanUrl = dbUrl.endsWith('/') ? dbUrl.slice(0, -1) : dbUrl;
    await mongoose.connect(`${cleanUrl}/${dbName}`);
    logger.info("Connected to Database");
  } catch (error) {
    logger.error("Failed to connect Database", error);
    process.exit(1);
  }
};

module.exports = { connectDB };
