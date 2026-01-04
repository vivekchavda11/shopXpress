const Cart = require("../model/Cart");
const Product = require("../model/Product");

/**
 * ADD TO CART
 */
exports.addToCart = async (req, res) => {
  try {
    const { userId, productId, qty } = req.body;

    let cart = await Cart.findOne({ userId });

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (!cart) {
      cart = new Cart({
        userId,
        items: [
          {
            productId,
            title: product.name,
            price: product.price,
            image: product.img,
            qty,
          },
        ],
      });
    } else {
      const index = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (index > -1) {
        cart.items[index].qty += qty;
      } else {
        cart.items.push({
          productId,
          title: product.name,
          price: product.price,
          image: product.img,
          qty,
        });
      }
    }

    await cart.save();

    res.json({
      message: "Added to cart",
      cartCount: cart.items.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET USER CART + BACKEND PRICE CALCULATION
 */
exports.getUserCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId }).populate(
      "items.productId"
    );

    if (!cart) {
      return res.json({
        items: [],
        subtotal: 0,
        total: 0,
      });
    }

    let subtotal = 0;

    cart.items.forEach((item) => {
      subtotal += item.price * item.qty;
    });

    res.json({
      items: cart.items,
      subtotal,
      total: subtotal,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * UPDATE QTY
 */
exports.updateCartQty = async (req, res) => {
  try {
    const { userId, productId, qty } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(
      (i) => i.productId.toString() === productId
    );

    if (!item) return res.status(404).json({ message: "Item not found" });

    item.qty = qty;

    await cart.save();
    res.json({ message: "Quantity updated" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * REMOVE ITEM
 */
exports.removeItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.json({ items: [] });

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();
    res.json({ items: cart.items });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * CLEAR CART
 */
exports.clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ userId: req.params.userId });
    res.json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
