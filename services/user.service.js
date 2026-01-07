const User = require("../models/User");

class UserService {
    async createUser(userData) {
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            throw new Error("User with this email already exists");
        }

        const user = new User(userData);
        return user.save();
    }

    async findUserByEmail(email) {
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            throw new Error("User does not exist!");
        }
        return existingUser;
    }

    async getAllUsers() {
        return User.find().sort({ createdAt: -1 });
    }

    async getUserById(userId) {
        const user = await User.findById(userId);
        if (!user) throw new Error("User not found");
        return user;
    }

    async updateUser(userId, updateData) {
        const user = await User.findByIdAndUpdate(userId, updateData, {
            new: true,
            runValidators: true,
        });
        if (!user) throw new Error("User not found");
        return user;
    }

    async deleteUser(userId) {
        const result = await User.findByIdAndDelete(userId);
        if (!result) throw new Error("User not found");
    }
}

module.exports = new UserService();