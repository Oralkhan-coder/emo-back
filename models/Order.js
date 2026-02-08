const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"],
        },
        status: {
            type: String,
            enum: ["new", "paid", "shipped", "delivered", "canceled"],
            default: "new",
        },
        total_amount: {
            type: Number,
            required: [true, "Total amount is required"],
            min: 0,
        },
        currency: {
            type: String,
            default: "KZT",
        },
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
);

module.exports = mongoose.model("Order", orderSchema);
