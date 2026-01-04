import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Banner.css";

const Banner = () => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/get/products");
      setProducts(res.data.slice(0, 6));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const chunkProducts = (arr, size) =>
    arr.reduce((acc, _, i) => {
      if (i % size === 0) acc.push(arr.slice(i, i + size));
      return acc;
    }, []);

  const slides = chunkProducts(products, 3);

  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <section className="hero-section">
        <div className="container">
          <h1 className="hero-title mb-3">
            Discover Stylish Fashion For Every Season
          </h1>

          <p className="hero-subtitle">
            Curated collections for comfort, quality, and everyday style.
          </p>

          <p className="hero-extra-text">
            Explore trending outfits, premium fabrics, and timeless designs
            crafted to elevate your daily look. Handpicked styles just for you.
          </p>

          <div className="hero-buttons d-flex justify-content-center gap-3 flex-wrap">
            <Link to="/products" className="btn btn-primary">Shop Now</Link>
            <button className="btn btn-outline-primary">
              View Collection
            </button>
          </div>

          <div className="hero-services d-flex justify-content-center gap-4 flex-wrap mt-4">
            <div className="d-flex align-items-center gap-2">
              <i className="fa-solid fa-truck"></i>
              <span>Free Shipping</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <i className="fa-solid fa-shield-halved"></i>
              <span>Secure Payment</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <i className="fa-solid fa-arrows-rotate"></i>
              <span>Easy Returns</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PRODUCT CAROUSEL ===== */}
      <section className="carousel-section">
        <div className="container">
          <h3 className="text-center mb-4 fw-semibold">
            Featured Products
          </h3>

          <div
            id="productCarousel"
            className="carousel slide"
            data-bs-ride="carousel"
          >
            <div className="carousel-inner">
              {slides.map((slide, idx) => (
                <div
                  key={idx}
                  className={`carousel-item ${idx === 0 ? "active" : ""}`}
                >
                  <div className="row justify-content-center">
                    {slide.map((product) => (
                      <div
                        key={product._id}
                        className="col-12 col-sm-6 col-md-4 mb-3 text-center"
                      >
                        <div className="card product-card shadow-sm">
                          <Link to={`/products/${product._id}`}>
                            <img
                              src={`http://localhost:3000${product.img}`}
                              alt={product.name}
                              className="card-img-top p-3"
                              onError={(e) =>
                                (e.target.src =
                                  "https://via.placeholder.com/300x300?text=No+Image")
                              }
                            />
                          </Link>

                          <div className="card-body">
                            <h6 className="card-title">
                              {product.name}
                            </h6>
                            <p className="card-text text-primary fw-bold">
                              Rs. {product.price}
                            </p>

                            <Link
                              to={`/products/${product._id}`}
                              className="btn btn-secondary w-100 btn-sm"
                            >
                              View More
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#productCarousel"
              data-bs-slide="prev"
            >
              <span className="carousel-control-prev-icon"></span>
            </button>

            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#productCarousel"
              data-bs-slide="next"
            >
              <span className="carousel-control-next-icon"></span>
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Banner;
