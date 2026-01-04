import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const Product = () => {
  const [products, setProducts] = useState([]);

  const userId = localStorage.getItem("userId");

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/get/products");
      setProducts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addToCart = async (productId) => {
    if (!userId) {
      toast.error("Please login to add items to cart");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/api/cart/add", {
        userId,
        productId,
        qty: 1,
      });

      // ✅ save unique product count
      localStorage.setItem("cartCount", res.data.cartCount);

      // ✅ notify header
      window.dispatchEvent(new Event("cart-updated"));

      toast.success("Item added to cart!");
    } catch (error) {
      console.error(
        "Add to cart error:",
        error.response?.data || error.message
      );
      toast.error("Error adding to cart");
    }
  };

  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 2000,
          style: {
            fontSize: "16px",
            padding: "12px 20px",
            background: "#333",
            color: "#fff",
            borderRadius: "8px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
            textAlign: "center",
            minWidth: "250px",
          },
        }}
      />

      <section className="mb-5">
        <div className="container">
          <h1 className="mt-4 mb-4 text-center">Products</h1>
          <div className="row">
            {products.map((item) => (
              <ProductCard
                key={item._id}
                id={item._id}
                img={item.img}
                title={item.name}
                price={item.price}
                rating={item.rating}
                handleAddToCart={() => addToCart(item._id)}
                viewMore="View More"
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Product;
  