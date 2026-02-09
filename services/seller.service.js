const Seller = require("../models/Seller");
const User = require("../models/User");

class SellerService {
    async createSeller(data) {
        const existingSeller = await Seller.findOne({ shop_name: data.shop_name });
        if (existingSeller) {
            throw new Error("Shop with this name already exists");
        }

        const seller = new Seller(data);
        await seller.save();

        // Update user role to seller
        await User.findByIdAndUpdate(data.user_id, { role: "seller" });

        return seller;
    }

    async getAllSellers() {
        return await Seller.find().populate("user_id", "name email");
    }

    async getSellerById(id) {
        const seller = await Seller.findById(id).populate("user_id", "name email");
        if (!seller) {
            throw new Error("Seller not found");
        }
        return seller;
    }

    async getSellerByUserId(userId) {
        const seller = await Seller.findOne({ user_id: userId }).populate("user_id", "name email");
        return seller;
    }

    async updateSeller(id, data) {
        const seller = await Seller.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });
        if (!seller) {
            throw new Error("Seller not found");
        }
        return seller;
    }

    async deleteSeller(id) {
        const seller = await Seller.findByIdAndDelete(id);
        if (!seller) {
            throw new Error("Seller not found");
        }
        return seller;
    }
}

module.exports = new SellerService();
