const productService = require("../services/product.service");
const logger = require("../utils/log");

class ProductController {
    async createProduct(req, res) {
        try {
            const product = await productService.createProduct(req.body);
            logger.info(`New product created: ${product.title}`);
            res.status(201).json(product);
        } catch (err) {
            logger.error("Failed to create product", err);
            res.status(400).json({ message: err.message });
        }
    }

    async getAllProducts(req, res) {
        try {
            const products = await productService.getAllProducts(req.query);
            res.json(products);
        } catch (err) {
            logger.error("Failed to fetch products", err);
            res.status(500).json({ message: err.message });
        }
    }

    async getProductById(req, res) {
        try {
            const product = await productService.getProductById(req.params.id);
            res.json(product);
        } catch (err) {
            logger.error(`Failed to fetch product with id ${req.params.id}`, err);
            const statusCode = err.message === "Product not found" ? 404 : 500;
            res.status(statusCode).json({ message: err.message });
        }
    }

    async updateProduct(req, res) {
        try {
            const product = await productService.updateProduct(req.params.id, req.body);
            logger.info(`Product updated: ${product.title}`);
            res.json(product);
        } catch (err) {
            logger.error(`Failed to update product with id ${req.params.id}`, err);
            const statusCode = err.message === "Product not found" ? 404 : 400;
            res.status(statusCode).json({ message: err.message });
        }
    }

    async deleteProduct(req, res) {
        try {
            await productService.deleteProduct(req.params.id);
            logger.info(`Product deleted with id ${req.params.id}`);
            res.status(204).send();
        } catch (err) {
            logger.error(`Failed to delete product with id ${req.params.id}`, err);
            const statusCode = err.message === "Product not found" ? 404 : 500;
            res.status(statusCode).json({ message: err.message });
        }
    }
}

module.exports = new ProductController();
