const express = require("express");
const router = express.Router();
const courseController = require("../controllers/course.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");

// Only teachers and admins can create courses
router.post("/", authenticate, authorize("teacher", "admin"), courseController.createCourse);

module.exports = router;
