const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const { authenticate, requireRole } = require("../middlewares/auth.middleware");

router.post("/", authenticate, requireRole("seller", "admin"), productController.createProduct);
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.put("/:id", authenticate, requireRole("seller", "admin"), productController.updateProduct);
router.delete("/:id", authenticate, requireRole("seller", "admin"), productController.deleteProduct);

module.exports = router;
