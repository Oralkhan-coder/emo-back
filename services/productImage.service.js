const ProductImage = require("../models/ProductImage");

class ProductImageService {
    async createImage(data) {
        const image = new ProductImage(data);
        return await image.save();
    }

    async getImagesByProductId(productId) {
        return await ProductImage.find({ product_id: productId }).sort({ sort_order: 1 });
    }

    async updateImage(id, data) {
        const image = await ProductImage.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });

        if (!image) {
            throw new Error("Image not found");
        }
        return image;
    }

    async deleteImage(id) {
        const image = await ProductImage.findByIdAndDelete(id);
        if (!image) {
            throw new Error("Image not found");
        }
        return image;
    }
}

module.exports = new ProductImageService();
