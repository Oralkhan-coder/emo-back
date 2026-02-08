const Product = require("../models/Product");
const Category = require("../models/Category"); // Ensure Category model is registered

class ProductService {
    async createProduct(data) {
        const product = new Product(data);
        return await product.save();
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
