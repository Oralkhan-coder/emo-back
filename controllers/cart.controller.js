const Cart = require("../models/Cart");
const CartItem = require("../models/CartItem");
const ProductVariant = require("../models/ProductVariant");
const Product = require("../models/Product"); // Needed potentially for population

exports.getCart = async (req, res) => {
    try {
        const userId = req.user.userId;
        let cart = await Cart.findOne({ user_id: userId });

        if (!cart) {
            return res.status(200).json({ cart: null, items: [] });
        }

        const items = await CartItem.find({ cart_id: cart._id })
            .populate({
                path: "product_variant_id",
                populate: { path: "product_id" }
            });

        res.status(200).json({ cart, items });
    } catch (error) {
        console.error("Get Cart Error:", error);
        res.status(500).json({ message: "Failed to fetch cart", error: error.message });
    }
};

exports.addToCart = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { product_variant_id, quantity } = req.body;

        if (!product_variant_id || !quantity) {
            return res.status(400).json({ message: "Product Variant ID and Quantity are required" });
        }

        // Check availability
        const variant = await ProductVariant.findById(product_variant_id);
        if (!variant) {
            return res.status(404).json({ message: "Product variant not found" });
        }
        if (variant.stock_quantity < quantity) {
            return res.status(400).json({ message: "Insufficient stock" });
        }

        // Get or Create Cart
        let cart = await Cart.findOne({ user_id: userId });
        if (!cart) {
            cart = await Cart.create({ user_id: userId });
        }

        // Check if item exists in cart
        let cartItem = await CartItem.findOne({ cart_id: cart._id, product_variant_id });

        if (cartItem) {
            // Update quantity
            cartItem.quantity += quantity;
            if (variant.stock_quantity < cartItem.quantity) {
                return res.status(400).json({ message: "Insufficient stock for update" });
            }
            await cartItem.save();
        } else {
            // Create new item
            cartItem = await CartItem.create({
                cart_id: cart._id,
                product_variant_id,
                quantity,
            });
        }

        res.status(200).json({ message: "Item added to cart", cartItem });
    } catch (error) {
        console.error("Add to Cart Error:", error);
        res.status(500).json({ message: "Failed to add to cart", error: error.message });
    }
};

exports.updateCartItem = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params; // CartItem ID
        const { quantity } = req.body;

        if (quantity === undefined || quantity < 1) {
            return res.status(400).json({ message: "Invalid quantity" });
        }

        // Verify cart ownership implicitly or explicitly
        const cart = await Cart.findOne({ user_id: userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const cartItem = await CartItem.findOne({ _id: id, cart_id: cart._id });
        if (!cartItem) {
            return res.status(404).json({ message: "Item not found in your cart" });
        }

        // Check stock
        const variant = await ProductVariant.findById(cartItem.product_variant_id);
        if (variant && variant.stock_quantity < quantity) {
            return res.status(400).json({ message: "Insufficient stock" });
        }

        cartItem.quantity = quantity;
        await cartItem.save();

        res.status(200).json({ message: "Cart item updated", cartItem });
    } catch (error) {
        console.error("Update Cart Item Error:", error);
        res.status(500).json({ message: "Failed to update cart item", error: error.message });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params; // CartItem ID

        const cart = await Cart.findOne({ user_id: userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const result = await CartItem.findOneAndDelete({ _id: id, cart_id: cart._id });
        if (!result) {
            return res.status(404).json({ message: "Item not found in your cart" });
        }

        res.status(200).json({ message: "Item removed from cart" });
    } catch (error) {
        console.error("Remove from Cart Error:", error);
        res.status(500).json({ message: "Failed to remove item", error: error.message });
    }
};

exports.clearCart = async (req, res) => {
    try {
        const userId = req.user.userId;
        const cart = await Cart.findOne({ user_id: userId });
        if (cart) {
            await CartItem.deleteMany({ cart_id: cart._id });
        }
        res.status(200).json({ message: "Cart cleared" });
    } catch (error) {
        console.error("Clear Cart Error:", error);
        res.status(500).json({ message: "Failed to clear cart", error: error.message });
    }
}
