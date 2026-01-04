import React, { useEffect, useState } from "react";
import axios from "axios";
import "./cart.css";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);

  const [formAddress, setFormAddress] = useState({
    name: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
  });

  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  /* ================= CLOSE MODAL FIX ================= */
  const closeCheckoutModal = () => {
    const modal = document.getElementById("checkoutModal");
    const backdrop = document.querySelector(".modal-backdrop");

    if (modal) {
      modal.classList.remove("show");
      modal.style.display = "none";
    }

    if (backdrop) backdrop.remove();

    document.body.classList.remove("modal-open");
    document.body.style.overflow = "auto";
  };

  /* ---------------- CART COUNT ---------------- */
  const updateCartCount = (items) => {
    localStorage.setItem("cartCount", items.length);
    window.dispatchEvent(new Event("cart-updated"));
  };

  /* ---------------- FETCH CART ---------------- */
  const fetchCartItems = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:3000/api/cart/user/${userId}`
      );

      const items = (res.data.items || []).map((item) => ({
        ...item,
        productIdStr: item.productId?._id || item.productId,
      }));

      setCartItems(items);
      setSubtotal(res.data.subtotal || 0);
      setDiscount(res.data.discount || 0);
      setTotal(res.data.total || 0);
      updateCartCount(items);
    } catch {
      setCartItems([]);
      updateCartCount([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  /* ---------------- QUANTITY UPDATE ---------------- */
  const updateQty = async (productId, qty) => {
    if (qty < 1) return;

    try {
      await axios.put("http://localhost:3000/api/cart/update", {
        userId,
        productId,
        qty,
      });
      fetchCartItems();
    } catch {
      toast.error("Quantity update failed");
    }
  };

  /* ---------------- REMOVE ITEM ---------------- */
  const removeItem = async (productId) => {
    try {
      await axios.delete(
        `http://localhost:3000/api/cart/remove/${userId}/${productId}`
      );
      fetchCartItems();
    } catch {
      toast.error("Remove failed");
    }
  };

  /* ---------------- CLEAR CART ---------------- */
  const clearCart = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/cart/clear/${userId}`);
      setCartItems([]);
      setSubtotal(0);
      setDiscount(0);
      setTotal(0);
      updateCartCount([]);
    } catch {
      toast.error("Clear cart failed");
    }
  };

  /* ---------------- ADDRESS ---------------- */
  const handleChange = (e) =>
    setFormAddress({ ...formAddress, [e.target.name]: e.target.value });

  const validateAddress = () =>
    Object.values(formAddress).every((v) => v.trim() !== "");

  const buildAddressPayload = () => ({
    fullName: formAddress.name,
    phone: formAddress.phone,
    street: formAddress.addressLine,
    city: formAddress.city,
    state: formAddress.state,
    pincode: formAddress.pincode,
  });

  /* ---------------- COD ---------------- */
  const placeOrder = async () => {
    if (!validateAddress()) {
      toast.error("Please fill all address fields");
      return;
    }

    try {
      await axios.post("http://localhost:3000/api/orders/place", {
        userId,
        address: buildAddressPayload(),
        paymentMethod: "COD",
      });

      toast.success("Order placed successfully!");

      // Clear cart locally
      setCartItems([]);
      setSubtotal(0);
      setDiscount(0);
      setTotal(0);
      updateCartCount([]); // <-- update cart count

      closeCheckoutModal();

      setTimeout(() => navigate("/orders"), 800);
    } catch (err) {
      toast.error(err.response?.data?.message || "Order failed");
    }
  };

  /* ---------------- RAZORPAY ---------------- */
  const handleRazorpay = async () => {
    if (!validateAddress()) {
      toast.error("Please fill all address fields");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/api/payment/create", {
        userId,
        address: buildAddressPayload(),
      });

      const options = {
        key: res.data.key,
        amount: res.data.amount * 100,
        currency: "INR",
        name: "SHOPXPRESS",
        description: "Order Payment",
        order_id: res.data.razorpayOrder.id,

        handler: async function (response) {
          await axios.post("http://localhost:3000/api/payment/verify", {
            ...response,
            userId,
            address: buildAddressPayload(),
          });

          toast.success("Payment Successful 🎉", {
            duration: 1500,
          });

          setCartItems([]);
          updateCartCount([]);
          closeCheckoutModal();

          setTimeout(() => navigate("/orders"), 1800);
        },
      };

      // 🔥 ADD THIS PART
      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", () => {
        toast.error("Payment cancelled. Order not placed.");
      });

      rzp.open();
    } catch (err) {
      toast.error("Payment failed to start");
    }
  };

  return (
    <div className="cart-container">
      <Toaster position="top-right" />

      <h2 className="main-title">🛒 My Cart</h2>

      {!loading && cartItems.length === 0 && (
        <div className="empty-cart">
          <h5>Your cart is empty</h5>
          <Link to="/products" className="btn btn-primary mt-2">
            Shop Now
          </Link>
        </div>
      )}

      <div className="cart-layout">
        <div className="cart-left">
          <div className="cart-card">
            {cartItems.map((item) => (
              <div className="cart-item" key={item.productIdStr}>
                <img
                  src={"http://localhost:3000" + item.image}
                  className="cart-product-img"
                  alt=""
                />

                <div className="item-info">
                  <h5>{item.title}</h5>

                  <div className="qty-controls">
                    <button
                      className="qty-btn"
                      onClick={() => updateQty(item.productIdStr, item.qty - 1)}
                    >
                      −
                    </button>

                    <span className="qty-value">{item.qty}</span>

                    <button
                      className="qty-btn"
                      onClick={() => updateQty(item.productIdStr, item.qty + 1)}
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => removeItem(item.productIdStr)}
                  >
                    Remove
                  </button>
                </div>

                <div className="item-price">
                  ₹ {(item.price * item.qty).toLocaleString()}
                </div>
              </div>
            ))}

            {cartItems.length > 0 && (
              <div className="clear-wrapper">
                <button className="clear-btn" onClick={clearCart}>
                  Clear Cart
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        {cartItems.length > 0 && (
          <div className="cart-right">
            <div className="price-card">
              <h5>PRICE DETAILS</h5>

              <div className="price-row">
                <span>Subtotal</span>
                <span>₹ {subtotal}</span>
              </div>

              <div className="price-row">
                <span>Discount</span>
                <span className="green">₹ {discount}</span>
              </div>

              <hr />

              <div className="price-total">
                <span>Total</span>
                <span>₹ {total}</span>
              </div>

              <button
                className="btn-success checkout-btn"
                data-bs-toggle="modal"
                data-bs-target="#checkoutModal"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ADDRESS MODAL */}
      <div className="modal fade" id="checkoutModal">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Delivery Address</h5>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <input
                    className="form-control"
                    name="name"
                    placeholder="Full Name"
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <input
                    className="form-control"
                    name="phone"
                    placeholder="Phone Number"
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12">
                  <textarea
                    className="form-control"
                    name="addressLine"
                    placeholder="Street Address"
                    rows="2"
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-4">
                  <input
                    className="form-control"
                    name="city"
                    placeholder="City"
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-4">
                  <input
                    className="form-control"
                    name="state"
                    placeholder="State"
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-4">
                  <input
                    className="form-control"
                    name="pincode"
                    placeholder="Pincode"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <hr className="my-4" />

              <button
                className="btn btn-success w-100 mb-2"
                onClick={placeOrder}
              >
                Cash on Delivery
              </button>

              <button className="btn btn-dark w-100" onClick={handleRazorpay}>
                Pay Online
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
