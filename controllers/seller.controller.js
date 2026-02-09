const sellerService = require("../services/seller.service");
const logger = require("../utils/log");

class SellerController {
    async createSeller(req, res) {
        try {
            const sellerData = {
                ...req.body,
                user_id: req.user.id
            };
            const seller = await sellerService.createSeller(sellerData);
            logger.info(`New seller created: ${seller.shop_name}`);
            res.status(201).json(seller);
        } catch (err) {
            logger.error("Failed to create seller", err);
            const statusCode = err.message.includes("exists") ? 409 : 400;
            res.status(statusCode).json({ message: err.message });
        }
    }

    async getAllSellers(req, res) {
        try {
            const sellers = await sellerService.getAllSellers();
            res.json(sellers);
        } catch (err) {
            logger.error("Failed to fetch sellers", err);
            res.status(500).json({ message: err.message });
        }
    }

    async getSellerById(req, res) {
        try {
            const seller = await sellerService.getSellerById(req.params.id);
            res.json(seller);
        } catch (err) {
            logger.error(`Failed to fetch seller with id ${req.params.id}`, err);
            const statusCode = err.message === "Seller not found" ? 404 : 500;
            res.status(statusCode).json({ message: err.message });
        }
    }

    async updateSeller(req, res) {
        try {
            const seller = await sellerService.getSellerById(req.params.id);
            const sellerUserId = seller.user_id._id ? seller.user_id._id.toString() : seller.user_id.toString();
            if (sellerUserId !== req.user.id.toString() && req.user.role !== "admin") {
                return res.status(403).json({ message: "You can only update your own seller profile" });
            }
            const updatedSeller = await sellerService.updateSeller(req.params.id, req.body);
            logger.info(`Seller updated: ${updatedSeller.shop_name}`);
            res.json(updatedSeller);
        } catch (err) {
            logger.error(`Failed to update seller with id ${req.params.id}`, err);
            const statusCode = err.message === "Seller not found" ? 404 : 400;
            res.status(statusCode).json({ message: err.message });
        }
    }

    async deleteSeller(req, res) {
        try {
            const seller = await sellerService.getSellerById(req.params.id);
            const sellerUserId = seller.user_id._id ? seller.user_id._id.toString() : seller.user_id.toString();
            if (sellerUserId !== req.user.id.toString() && req.user.role !== "admin") {
                return res.status(403).json({ message: "You can only delete your own seller profile" });
            }
            await sellerService.deleteSeller(req.params.id);
            logger.info(`Seller deleted with id ${req.params.id}`);
            res.status(204).send();
        } catch (err) {
            logger.error(`Failed to delete seller with id ${req.params.id}`, err);
            const statusCode = err.message === "Seller not found" ? 404 : 500;
            res.status(statusCode).json({ message: err.message });
        }
    }
}

module.exports = new SellerController();
