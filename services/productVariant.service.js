const ProductVariant = require("../models/ProductVariant");

class ProductVariantService {
    async createVariant(data) {
        const variant = new ProductVariant(data);
        return await variant.save();
    }

    async getVariantsByProductId(productId) {
        return await ProductVariant.find({ product_id: productId });
    }

    async getVariantById(id) {
        const variant = await ProductVariant.findById(id);
        if (!variant) {
            throw new Error("Variant not found");
        }
        return variant;
    }

    async updateVariant(id, data) {
        const variant = await ProductVariant.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });

        if (!variant) {
            throw new Error("Variant not found");
        }
        return variant;
    }

    async deleteVariant(id) {
        const variant = await ProductVariant.findByIdAndDelete(id);
        if (!variant) {
            throw new Error("Variant not found");
        }
        return variant;
    }
}

module.exports = new ProductVariantService();
