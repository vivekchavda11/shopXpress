import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const ProductDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("M");
  const [color, setColor] = useState("black");

  const userId = localStorage.getItem("userId");

  // Fetch product details
  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/get/product/${id}`)
      .then((res) => setProduct(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  // Add to cart handler
  const handleAddToCart = async () => {
    if (!userId) return toast.error("Please login to add items to cart");

    try {
      const res = await axios.post("http://localhost:3000/api/cart/add", {
        userId,
        productId: id,
        qty: quantity,
      });

      // ✅ store unique product count
      localStorage.setItem("cartCount", res.data.cartCount);

      // ✅ notify header
      window.dispatchEvent(new Event("cart-updated"));

      toast.success("Item added to cart!", {
  duration: 1500,});
    } catch (error) {
      console.error(
        "Add to cart error:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message || "Error adding to cart"
      );
    }
  };

  if (loading) {
    return (
      <div className="container">
        <h1 className="text-center mt-5 mb-5">Loading...</h1>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container">
        <h1 className="text-center mt-5 mb-5">Product not found!</h1>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="mb-4 mt-4 text-center fs-5">
        <Link to="/" className="text-decoration-none">Home</Link> /{" "}
        <Link to="/products" className="text-decoration-none">Products</Link> /{" "}
        <span className="text-muted">Product Details</span>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div
            className="border rounded-3 d-flex justify-content-center align-items-center"
            style={{ height: "500px", background: "#f8f9fa" }}
          >
            <img
              src={"http://localhost:3000" + product.img}
              alt={product.name}
              style={{ maxWidth: "100%", maxHeight: "100%" }}
            />
          </div>
        </div>

        <div className="col-md-6">
          <small className="text-uppercase text-muted">
            {product.cateName}
          </small>
          <h3 className="mt-2">{product.name}</h3>

          <div className="d-flex align-items-center mb-2">
            <span className="fs-4 fw-bold me-2">{product.price}</span>
            <span className="badge bg-danger">-17%</span>
          </div>

          <p>{product.desc}</p>

          <p className="text-success">
            In Stock <span className="text-muted">{product.stock}</span>
          </p>

          {/* Quantity */}
          <div className="mb-3">
            <strong>Quantity:</strong>
            <div className="input-group w-25 mt-2">
              <button
                className="btn btn-outline-secondary"
                onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
              >
                -
              </button>
              <input
                type="text"
                className="form-control text-center"
                value={quantity}
                readOnly
              />
              <button
                className="btn btn-outline-secondary"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
          </div>

          <div className="d-flex gap-2">
            <button
              className="btn btn-primary flex-fill"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
            <button className="btn btn-outline-primary flex-fill">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
