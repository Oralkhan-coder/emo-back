const logger = require("../utils/log");

class CourseController {
    async createCourse(req, res) {
        try {
            // Placeholder logic for creating a course
            logger.info(`Course created by user: ${req.user.userId} with role ${req.user.role}`);
            res.status(201).json({
                success: true,
                message: "Course created successfully",
                creator: req.user.userId
            });
        } catch (err) {
            logger.error("Failed to create course", err);
            res.status(500).json({ message: err.message });
        }
    }
}

module.exports = new CourseController();
