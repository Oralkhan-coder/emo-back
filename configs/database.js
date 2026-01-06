require("dotenv").config();
const mongoose = require('mongoose');
const logger = require('../utils/log')

const dbUrl = process.env.MONGODB_URL;
const dbName = process.env.MONGODB_DB_NAME;

const connectDB = async () => {
  try {
    await mongoose.connect(`${dbUrl}/${dbName}`);
    logger.info("Connected to Database")
  } catch (error) {
    logger.error("Failed to connect Database")
    process.exit(1);
  }
};

module.exports = { connectDB };
