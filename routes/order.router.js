const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const { authenticate } = require("../middlewares/auth.middleware");

router.use(authenticate);

router.post("/", orderController.createOrder);
router.get("/", orderController.getOrders);
router.get("/:id", orderController.getOrderById);
router.put("/:id/status", orderController.updateOrderStatus);

module.exports = router;
