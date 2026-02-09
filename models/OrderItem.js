const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
    {
        order_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: [true, "Order ID is required"],
        },
        seller_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Seller",
            required: [true, "Seller ID is required"],
        },
        product_variant_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ProductVariant",
            required: [true, "Product Variant ID is required"],
        },
        price: {
            type: Number,
            required: [true, "Price is required"], // Price at the time of order
            min: 0,
        },
        quantity: {
            type: Number,
            required: [true, "Quantity is required"],
            min: 1,
        },
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
);

module.exports = mongoose.model("OrderItem", orderItemSchema);
