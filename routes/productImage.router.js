const express = require("express");
const router = express.Router();
const productImageController = require("../controllers/productImage.controller");

router.post("/", productImageController.createImage);
router.get("/", productImageController.getImagesByProduct); // Expects ?product_id=...
router.put("/:id", productImageController.updateImage);
router.delete("/:id", productImageController.deleteImage);

module.exports = router;
