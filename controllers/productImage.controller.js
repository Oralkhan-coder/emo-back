const productImageService = require("../services/productImage.service");
const logger = require("../utils/log");

class ProductImageController {
    async createImage(req, res) {
        try {
            const image = await productImageService.createImage(req.body);
            logger.info(`New image added for product: ${image.product_id}`);
            res.status(201).json(image);
        } catch (err) {
            logger.error("Failed to add image", err);
            res.status(400).json({ message: err.message });
        }
    }

    async getImagesByProduct(req, res) {
        try {
            const { product_id } = req.query;
            if (!product_id) {
                return res.status(400).json({ message: "product_id is required" });
            }
            const images = await productImageService.getImagesByProductId(product_id);
            res.json(images);
        } catch (err) {
            logger.error("Failed to fetch images", err);
            res.status(500).json({ message: err.message });
        }
    }

    async updateImage(req, res) {
        try {
            const image = await productImageService.updateImage(req.params.id, req.body);
            logger.info(`Image updated: ${image._id}`);
            res.json(image);
        } catch (err) {
            logger.error(`Failed to update image with id ${req.params.id}`, err);
            const statusCode = err.message === "Image not found" ? 404 : 400;
            res.status(statusCode).json({ message: err.message });
        }
    }

    async deleteImage(req, res) {
        try {
            await productImageService.deleteImage(req.params.id);
            logger.info(`Image deleted with id ${req.params.id}`);
            res.status(204).send();
        } catch (err) {
            logger.error(`Failed to delete image with id ${req.params.id}`, err);
            const statusCode = err.message === "Image not found" ? 404 : 500;
            res.status(statusCode).json({ message: err.message });
        }
    }
}

module.exports = new ProductImageController();
