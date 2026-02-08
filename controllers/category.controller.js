const categoryService = require("../services/category.service");
const logger = require("../utils/log");

class CategoryController {
    async createCategory(req, res) {
        try {
            const category = await categoryService.createCategory(req.body);
            logger.info(`New category created: ${category.name}`);
            res.status(201).json(category);
        } catch (err) {
            logger.error("Failed to create category", err);
            const statusCode = err.message.includes("duplicate") ? 409 : 400;
            res.status(statusCode).json({ message: err.message });
        }
    }

    async getAllCategories(req, res) {
        try {
            const categories = await categoryService.getAllCategories();
            res.json(categories);
        } catch (err) {
            logger.error("Failed to fetch categories", err);
            res.status(500).json({ message: err.message });
        }
    }

    async getCategoryById(req, res) {
        try {
            const category = await categoryService.getCategoryById(req.params.id);
            res.json(category);
        } catch (err) {
            logger.error(`Failed to fetch category with id ${req.params.id}`, err);
            const statusCode = err.message === "Category not found" ? 404 : 500;
            res.status(statusCode).json({ message: err.message });
        }
    }

    async updateCategory(req, res) {
        try {
            const category = await categoryService.updateCategory(req.params.id, req.body);
            logger.info(`Category updated: ${category.name}`);
            res.json(category);
        } catch (err) {
            logger.error(`Failed to update category with id ${req.params.id}`, err);
            const statusCode = err.message === "Category not found" ? 404 : 400;
            res.status(statusCode).json({ message: err.message });
        }
    }

    async deleteCategory(req, res) {
        try {
            await categoryService.deleteCategory(req.params.id);
            logger.info(`Category deleted with id ${req.params.id}`);
            res.status(204).send();
        } catch (err) {
            logger.error(`Failed to delete category with id ${req.params.id}`, err);
            const statusCode = err.message === "Category not found" ? 404 : 500;
            res.status(statusCode).json({ message: err.message });
        }
    }
}

module.exports = new CategoryController();
