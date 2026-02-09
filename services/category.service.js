const Category = require("../models/Category");

class CategoryService {
    async createCategory(data) {
        const category = new Category(data);
        return await category.save();
    }

    async getAllCategories() {
        return await Category.find().populate("parent_id", "name slug");
    }

    async getCategoryById(id) {
        const category = await Category.findById(id).populate("parent_id", "name slug");
        if (!category) {
            throw new Error("Category not found");
        }
        return category;
    }

    async updateCategory(id, data) {
        const category = await Category.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        }).populate("parent_id", "name slug");

        if (!category) {
            throw new Error("Category not found");
        }
        return category;
    }

    async deleteCategory(id) {
        const category = await Category.findByIdAndDelete(id);
        if (!category) {
            throw new Error("Category not found");
        }
        return category;
    }
}

module.exports = new CategoryService();
