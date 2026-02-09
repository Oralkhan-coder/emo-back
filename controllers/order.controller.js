const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Cart = require("../models/Cart");
const CartItem = require("../models/CartItem");
const ProductVariant = require("../models/ProductVariant");
const Product = require("../models/Product");

exports.createOrder = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { items: directItems, currency = "KZT" } = req.body;

        let orderItemsData = [];
        let fromCart = false;

        if (directItems && directItems.length > 0) {
            orderItemsData = directItems;
        } else {
            const cart = await Cart.findOne({ user_id: userId });
            if (!cart) {
                return res.status(400).json({ message: "Cart is empty" });
            }
            const cartItems = await CartItem.find({ cart_id: cart._id });
            if (cartItems.length === 0) {
                return res.status(400).json({ message: "Cart is empty" });
            }
            orderItemsData = cartItems;
            fromCart = true;
        }

        let totalAmount = 0;
        const finalOrderItems = [];

        for (const item of orderItemsData) {
            const variant = await ProductVariant.findById(item.product_variant_id).populate("product_id");

            if (!variant) {
                return res.status(404).json({
                    message: `Product variant ${item.product_variant_id} not found`
                });
            }

            if (variant.stock_quantity < item.quantity) {
                return res.status(400).json({
                    message: `Insufficient stock for ${variant.sku_code}`
                });
            }

            const sellerId = variant.product_id.seller_id;
            if (!sellerId) {
                return res.status(500).json({ message: "Product has no seller associated" });
            }

            const itemTotal = variant.price * item.quantity;
            totalAmount += itemTotal;

            finalOrderItems.push({
                product_variant_id: variant._id,
                seller_id: sellerId,
                price: variant.price,
                quantity: item.quantity,
            });

            variant.stock_quantity -= item.quantity;
            await variant.save();
        }

        const order = await Order.create({
            user_id: userId,
            status: "new",
            total_amount: totalAmount,
            currency: currency,
        });

        const orderItemsToSave = finalOrderItems.map(item => ({
            ...item,
            order_id: order._id
        }));

        await OrderItem.insertMany(orderItemsToSave);

        if (fromCart) {
            const cart = await Cart.findOne({ user_id: userId });
            if (cart) {
                await CartItem.deleteMany({ cart_id: cart._id });
            }
        }

        res.status(201).json({ message: "Order created successfully", order, orderId: order._id });

    } catch (error) {
        console.error("Create Order Error:", error);
        res.status(500).json({ message: "Failed to create order", error: error.message });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const userId = req.user.userId;
        const orders = await Order.find({ user_id: userId }).sort({ created_at: -1 });
        res.status(200).json(orders);
    } catch (error) {
        console.error("Get Orders Error:", error);
        res.status(500).json({ message: "Failed to fetch orders", error: error.message });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;

        const order = await Order.findOne({ _id: id, user_id: userId });
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        const items = await OrderItem.find({ order_id: order._id })
            .populate({
                path: "product_variant_id",
                populate: { path: "product_id" }
            })
            .populate("seller_id", "name email");

        res.status(200).json({ order, items });
    } catch (error) {
        console.error("Get Order By ID Error:", error);
        res.status(500).json({ message: "Failed to fetch order details", error: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {

        const userId = req.user.userId;
        const { id } = req.params;
        const { status } = req.body;

        const order = await Order.findOne({ _id: id });
        if (!order) return res.status(404).json({ message: "Order not found" });

        if (order.user_id.toString() === userId) {
            if (status === 'canceled' && order.status === 'new') {
                order.status = 'canceled';
                await order.save();
                return res.status(200).json({ message: "Order canceled", order });
            } else {
                return res.status(403).json({ message: "You can only cancel new orders" });
            }
        }

        return res.status(403).json({ message: "Not authorized to perform this status change" });

    } catch (error) {
        console.error("Update Order Status Error:", error);
        res.status(500).json({ message: "Failed to update order status", error: error.message });
    }
};
