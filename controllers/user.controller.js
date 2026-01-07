const userService = require("../services/user.service");
const logger = require("../utils/log");

class UserController {
    async createUser(req, res) {
        try {
            const user = await userService.createUser(req.body);
            logger.info(`New user created: ${user.email}`);
            res.status(201).json(user);
        } catch (err) {
            logger.error("Failed to create user", err);
            // Determine status code based on error message or type (simple heuristic for now)
            const statusCode = err.message.includes("exists") ? 409 : 400; // 409 Conflict if user exists
            res.status(statusCode).json({ message: err.message });
        }
    }

    async getAllUsers(req, res) {
        try {
            const users = await userService.getAllUsers();
            res.json(users);
        } catch (err) {
            logger.error("Failed to fetch users", err);
            res.status(500).json({ message: err.message });
        }
    }
}

module.exports = new UserController();
