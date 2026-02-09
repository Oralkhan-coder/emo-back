const mongoose = require('mongoose');
require('dotenv').config();
const Cart = require('./models/Cart');
const CartItem = require('./models/CartItem');
const Order = require('./models/Order');
const OrderItem = require('./models/OrderItem');

async function verifyModels() {
    console.log("Verifying models...");
    try {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/emo-back");
        console.log("Connected to DB");

        console.log("Checking model registrations...");
        if (mongoose.modelNames().includes('Cart')) console.log("Cart model registered");
        else console.error("Cart model MISSING");

        if (mongoose.modelNames().includes('CartItem')) console.log("CartItem model registered");
        else console.error("CartItem model MISSING");

        if (mongoose.modelNames().includes('Order')) console.log("Order model registered");
        else console.error("Order model MISSING");

        if (mongoose.modelNames().includes('OrderItem')) console.log("OrderItem model registered");
        else console.error("OrderItem model MISSING");

        console.log("Verification checks complete. (Not creating data to avoid clutter)");
        process.exit(0);
    } catch (error) {
        console.error("Verification failed:", error);
        process.exit(1);
    }
}

verifyModels();
