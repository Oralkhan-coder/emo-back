const mongoose = require("mongoose");

const productImageSchema = new mongoose.Schema(
    {
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: [true, "Product ID is required"],
        },
        image_url: {
            type: String,
            required: [true, "Image URL is required"],
            trim: true,
        },
        sort_order: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: false,
    }
);

module.exports = mongoose.model("ProductImage", productImageSchema);
