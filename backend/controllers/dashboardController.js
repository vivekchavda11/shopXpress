const Product = require("../model/Product");
const User = require("../model/User");
const Category = require("../model/category");
const Order = require("../model/Order");
exports.getCounts = async (req, res) => {
  try {
    const [productCount, userCount, categoryCount,orderCount] = await Promise.all([
      Product.countDocuments(),
      User.countDocuments(),
      Category.countDocuments(),
      Order.countDocuments(),
    ]);

    res.json({
      products: productCount,
      users: userCount,
      categories: categoryCount,
      orders: orderCount,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching counts", err });
  }
};
