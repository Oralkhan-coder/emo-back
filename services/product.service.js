const Product = require("../models/Product");

class ProductService {
    async createProduct(data) {
        try {
            const product = new Product(data);
            return await product.save();
        } catch (error) {
            console.error("Error saving product:", error);
            throw error;
        }
    }

    async getAllProducts(query = {}) {
        return await Product.find(query)
            .populate("seller_id", "shop_name")
            .populate("category_id", "name"); // Assuming Category will have a name
    }

    async getProductById(id) {
        const product = await Product.findById(id)
            .populate("seller_id", "shop_name")
            .populate("category_id", "name");

        if (!product) {
            throw new Error("Product not found");
        }
        return product;
    }

    async updateProduct(id, data) {
        const product = await Product.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        })
            .populate("seller_id", "shop_name")
            .populate("category_id", "name");

        if (!product) {
            throw new Error("Product not found");
        }
        return product;
    }

    async deleteProduct(id) {
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            throw new Error("Product not found");
        }
        return product;
    }
}

module.exports = new ProductService();
