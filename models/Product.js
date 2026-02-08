const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        seller_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Seller",
            required: [true, "Seller ID is required"],
        },
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        category_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: [true, "Category ID is required"],
        },
        brand: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: ["active", "draft", "banned"],
            default: "draft",
        },
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
);

module.exports = mongoose.model("Product", productSchema);
