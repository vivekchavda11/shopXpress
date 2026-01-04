const Razorpay = require("razorpay");
const crypto = require("crypto");
const Cart = require("../model/Cart");
const Order = require("../model/Order");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* ================= CREATE RAZORPAY ORDER ================= */
// exports.createPaymentOrder = async (req, res) => {
//   try {
//     const { userId, address } = req.body;

//     if (!address) {
//       return res.status(400).json({ message: "Address is required" });
//     }

//     const cart = await Cart.findOne({ userId });
//     if (!cart || cart.items.length === 0) {
//       return res.status(400).json({ message: "Cart is empty" });
//     }

//     let subtotal = 0;
//     cart.items.forEach((i) => {
//       subtotal += i.price * i.qty;
//     });

//     const discount = 0;
//     const totalAmount = subtotal - discount;

//     const razorpayOrder = await razorpay.orders.create({
//       amount: totalAmount * 100,
//       currency: "INR",
//       receipt: `order_${Date.now()}`,
//     });

//     const order = await Order.create({
//       userId,
//       items: cart.items,
//       address, // ✅ FIX APPLIED HERE
//       subtotal,
//       discount,
//       totalAmount,
//       paymentMethod: "RAZORPAY",
//       paymentStatus: "Pending",
//       razorpayOrderId: razorpayOrder.id,
//     });

//     res.json({
//       key: process.env.RAZORPAY_KEY_ID,
//       razorpayOrder,
//       orderId: order._id,
//       amount: totalAmount,
//     });
//   } catch (err) {
//     console.error("Razorpay Error:", err);
//     res.status(500).json({
//       message: "Payment order failed",
//       error: err.message,
//     });
//   }
// };

exports.createPaymentOrder = async (req, res) => {
  const { userId, address } = req.body;

  const cart = await Cart.findOne({ userId });
  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: "Cart empty" });
  }

  let subtotal = 0;
  cart.items.forEach((item) => {
    subtotal += item.price * item.qty;
  });

  const razorpayOrder = await razorpay.orders.create({
    amount: subtotal * 100,
    currency: "INR",
  });

  res.json({
    key: process.env.RAZORPAY_KEY_ID,
    razorpayOrder,
    amount: subtotal,
    address,
  });
};

/* ================= VERIFY PAYMENT ================= */
exports.verifyPayment = async (req, res) => {
  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    userId,
    address,
  } = req.body;

  // ✔ Signature verification logic here

  const cart = await Cart.findOne({ userId });
  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: "Cart empty" });
  }

  let subtotal = 0;
  cart.items.forEach((item) => {
    subtotal += item.price * item.qty;
  });

  const order = new Order({
    userId,
    items: cart.items,
    address,
    subtotal,
    discount: 0,
    totalAmount: subtotal,
    paymentMethod: "RAZORPAY",
    paymentStatus: "Paid",
    razorpayOrderId: razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id,
    razorpaySignature: razorpay_signature,
  });

  await order.save();

  // ✅ CLEAR CART ONLY AFTER PAYMENT SUCCESS
  cart.items = [];
  await cart.save();

  res.json({
    message: "Payment verified & order placed",
    order,
  });
};
