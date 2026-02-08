const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { authenticate, requireRole } = require("../middlewares/auth.middleware");

router.post("/", authenticate, requireRole("admin"), userController.createUser);
router.get("/", authenticate, requireRole("admin"), userController.getAllUsers);

module.exports = router;
