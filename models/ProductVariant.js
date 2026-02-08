const mongoose = require("mongoose");

const productVariantSchema = new mongoose.Schema(
    {
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: [true, "Product ID is required"],
        },
        sku_code: {
            type: String,
            required: [true, "SKU code is required"],
            unique: true,
            trim: true,
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
            min: 0,
        },
        currency: {
            type: String,
            default: "KZT",
            trim: true,
        },
        stock_quantity: {
            type: Number,
            default: 0,
            min: 0,
        },
        attributes: {
            type: Map,
            of: mongoose.Schema.Types.Mixed,
            default: {},
        },
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
);

module.exports = mongoose.model("ProductVariant", productVariantSchema);
