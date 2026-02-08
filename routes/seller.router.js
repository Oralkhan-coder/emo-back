const express = require("express");
const router = express.Router();
const sellerController = require("../controllers/seller.controller");
const { authenticate, requireRole } = require("../middlewares/auth.middleware");

router.post("/", authenticate, requireRole("buyer"), sellerController.createSeller);
router.get("/", sellerController.getAllSellers);
router.get("/:id", sellerController.getSellerById);
router.put("/:id", authenticate, requireRole("seller", "admin"), sellerController.updateSeller);
router.delete("/:id", authenticate, requireRole("seller", "admin"), sellerController.deleteSeller);

module.exports = router;
