const Cart = require("../model/Cart");
const Order = require("../model/Order");

/* ---------------- PLACE ORDER ---------------- */
exports.placeOrder = async (req, res) => {
  try {
    const { userId, address, paymentMethod = "COD" } = req.body;

    // ❌ BLOCK Razorpay here
    if (paymentMethod === "RAZORPAY") {
      return res.status(400).json({
        message: "Use Razorpay flow for online payments",
      });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let subtotal = 0;
    cart.items.forEach((item) => {
      subtotal += item.price * item.qty;
    });

    const discount = 0;
    const totalAmount = subtotal - discount;

    const order = new Order({
      userId,
      items: cart.items,
      address,
      subtotal,
      discount,
      totalAmount,
      paymentMethod: "COD",
      paymentStatus: "Pending",
    });

    await order.save();

    // ✅ Clear cart ONLY for COD
    cart.items = [];
    await cart.save();

    res.status(201).json({
      message: "COD order placed successfully",
      order,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------------- USER ORDERS ---------------- */
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({
      createdAt: -1,
    });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------------- ADMIN: ALL ORDERS ---------------- */
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "username email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------------- ADMIN: UPDATE STATUS ---------------- */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus },
      { new: true }
    );

    res.json({
      message: "Order status updated",
      order,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------------- ADMIN: DELETE ORDER ---------------- */
exports.deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.orderId);
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------------- USER CANCEL ORDER ---------------- */
exports.cancelOrderByUser = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.orderStatus === "Delivered") {
      return res.status(400).json({
        message: "Delivered orders cannot be cancelled",
      });
    }

    if (order.orderStatus === "Cancelled") {
      return res.status(400).json({
        message: "Order already cancelled",
      });
    }

    order.orderStatus = "Cancelled";
    if (order.paymentStatus === "Paid") {
      order.refundStatus = "Initiated";
      order.refundInitiatedAt = new Date();
    }

    await order.save();

    res.json({
      message:
        "Order cancelled successfully. Refund will be processed within 3 working days.",
      order,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
