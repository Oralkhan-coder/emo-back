const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const { authenticate } = require("../middlewares/auth.middleware");

router.use(authenticate);

router.get("/", cartController.getCart);
router.post("/add", cartController.addToCart);
router.put("/item/:id", cartController.updateCartItem);
router.delete("/item/:id", cartController.removeFromCart);
router.delete("/clear", cartController.clearCart);

module.exports = router;
