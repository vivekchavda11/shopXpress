import React from "react";
import Button from "./Button";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-dark text-light pt-5 pb-3 footer">
      <div className="container">
        <div className="row">
          {/* Brand / About */}
          <div className="col-md-4 mb-4">
            <h4 className="fw-bold">ShopXpress</h4>
            <p>
              Your one-stop destination for quality products at the best prices.
              Shop with confidence and enjoy seamless shopping!
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-2 mb-4">
            <h5 className="fw-bold">Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/" className="text-light text-decoration-none">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-light text-decoration-none">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-light text-decoration-none">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-light text-decoration-none">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="col-md-3 mb-4">
            <h5 className="fw-bold">Customer Service</h5>
            <ul className="list-unstyled">
              <li className="mb-1">
                <a href="/faq" className="text-light text-decoration-none">
                  FAQ
                </a>
              </li>
              <li className="mb-1">
                <a href="/shipping" className="text-light text-decoration-none">
                  Shipping
                </a>
              </li>
              <li className="mb-1">
                <a href="/returns" className="text-light text-decoration-none">
                  Returns
                </a>
              </li>
              <li className="mb-1">
                <a href="/privacy" className="text-light text-decoration-none">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-md-3 mb-4">
            <h5 className="fw-bold">Subscribe</h5>
            <form className="d-flex">
              <input
                type="email"
                className="form-control me-2"
                placeholder="Enter email"
              />
              <Button className="btn btn-warning" title={"Go"} />
            </form>
            <div className="mt-3">
              <a href="#" className="social-icon facebook">
                <i className="fab fa-facebook fa-lg"></i>
              </a>
              <a href="#" className="social-icon twitter">
                <i className="fab fa-twitter fa-lg"></i>
              </a>
              <a href="#" className="social-icon instagram">
                <i className="fab fa-instagram fa-lg"></i>
              </a>
              <a href="#" className="social-icon linkedin">
                <i className="fab fa-linkedin fa-lg"></i>
              </a>
            </div>
          </div>
        </div>

        <hr className="border-light" />
        <div className="text-center">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} ShopXpress. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
