const productVariantService = require("../services/productVariant.service");
const logger = require("../utils/log");

class ProductVariantController {
    async createVariant(req, res) {
        try {
            const variant = await productVariantService.createVariant(req.body);
            logger.info(`New variant created for product: ${variant.product_id}`);
            res.status(201).json(variant);
        } catch (err) {
            logger.error("Failed to create variant", err);
            res.status(400).json({ message: err.message });
        }
    }

    async getVariantsByProduct(req, res) {
        try {
            const { product_id } = req.query;
            if (!product_id) {
                return res.status(400).json({ message: "product_id is required" });
            }
            const variants = await productVariantService.getVariantsByProductId(product_id);
            res.json(variants);
        } catch (err) {
            logger.error("Failed to fetch variants", err);
            res.status(500).json({ message: err.message });
        }
    }

    async getVariantById(req, res) {
        try {
            const variant = await productVariantService.getVariantById(req.params.id);
            res.json(variant);
        } catch (err) {
            logger.error(`Failed to fetch variant with id ${req.params.id}`, err);
            const statusCode = err.message === "Variant not found" ? 404 : 500;
            res.status(statusCode).json({ message: err.message });
        }
    }

    async updateVariant(req, res) {
        try {
            const variant = await productVariantService.updateVariant(req.params.id, req.body);
            logger.info(`Variant updated: ${variant._id}`);
            res.json(variant);
        } catch (err) {
            logger.error(`Failed to update variant with id ${req.params.id}`, err);
            const statusCode = err.message === "Variant not found" ? 404 : 400;
            res.status(statusCode).json({ message: err.message });
        }
    }

    async deleteVariant(req, res) {
        try {
            await productVariantService.deleteVariant(req.params.id);
            logger.info(`Variant deleted with id ${req.params.id}`);
            res.status(204).send();
        } catch (err) {
            logger.error(`Failed to delete variant with id ${req.params.id}`, err);
            const statusCode = err.message === "Variant not found" ? 404 : 500;
            res.status(statusCode).json({ message: err.message });
        }
    }
}

module.exports = new ProductVariantController();
