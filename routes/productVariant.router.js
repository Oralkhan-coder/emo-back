const express = require("express");
const router = express.Router();
const productVariantController = require("../controllers/productVariant.controller");

router.post("/", productVariantController.createVariant);
router.get("/", productVariantController.getVariantsByProduct); // Expects ?product_id=...
router.get("/:id", productVariantController.getVariantById);
router.put("/:id", productVariantController.updateVariant);
router.delete("/:id", productVariantController.deleteVariant);

module.exports = router;
