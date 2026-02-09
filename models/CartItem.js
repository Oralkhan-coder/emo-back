const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
    {
        cart_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Cart",
            required: [true, "Cart ID is required"],
        },
        product_variant_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ProductVariant",
            required: [true, "Product Variant ID is required"],
        },
        quantity: {
            type: Number,
            required: [true, "Quantity is required"],
            min: [1, "Quantity must be at least 1"],
            default: 1,
        },
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
);

cartItemSchema.index({ cart_id: 1, product_variant_id: 1 }, { unique: true });

module.exports = mongoose.model("CartItem", cartItemSchema);
