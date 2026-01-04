import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import "./header.css"; // ✅ Add this CSS file for modal styles

const Header = () => {
  const [showBox, setShowBox] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState({ username: "", email: "" });
  const [loadingUser, setLoadingUser] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const boxRef = useRef();

  const navigate = useNavigate();
  const usernameLocal = localStorage.getItem("username");
  const userId = localStorage.getItem("userId");

  const handleToggle = () => setShowBox(!showBox);

  const handleLogOut = () => {
    localStorage.clear();
    setCartCount(0);
    navigate("/");
  };

  const fetchCartCount = async () => {
    if (!userId) {
      setCartCount(0);
      return;
    }
    try {
      const res = await axios.get(
        `http://localhost:3000/api/cart/user/${userId}`
      );
      const count = res.data?.items?.length || 0;
      setCartCount(count);
      localStorage.setItem("cartCount", count);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchUser = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(
        `http://localhost:3000/api/get/user/${userId}`
      );
      setUser({ username: res.data.username, email: res.data.email });
    } catch (err) {
      console.log(err);
      toast.error("Error fetching user data");
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    fetchCartCount();
    fetchUser();

    const handleCartUpdated = () => {
      const count = localStorage.getItem("cartCount");
      if (count !== null) setCartCount(Number(count));
      else fetchCartCount();
    };
    window.addEventListener("cart-updated", handleCartUpdated);
    return () => window.removeEventListener("cart-updated", handleCartUpdated);
  }, [userId]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        boxRef.current &&
        !boxRef.current.contains(e.target) &&
        !e.target.classList.contains("fa-user")
      ) {
        setShowBox(false);
        setIsEditing(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/api/update/user/${userId}`, user);
      toast.success("Profile updated successfully!");
      localStorage.setItem("username", user.username);
      setIsEditing(false);
    } catch (err) {
      console.log(err);
      toast.error("Error updating profile");
    }
  };

  const modalStyle = {
    top: "45px",
    right: "0px",
    zIndex: "1050",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
    width: "300px",
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    fontSize: "14px",
    color: "#333",
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <header className="main-header">
        <div className="header-content d-flex flex-column flex-lg-row align-items-center justify-content-between">
          <Link
            className="d-flex align-items-center text-decoration-none mb-2 mb-lg-0"
            to="/"
          >
            <h1 className="sitename mb-0">ShopXpress</h1>
          </Link>

          <form className="w-100 w-lg-auto order-lg-2">
            <div className="input-group search-group mx-auto">
              <input
                type="text"
                className="form-control search"
                placeholder="Search For Products"
              />
              <button className="search-btn" type="button">
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </div>
          </form>

          <div className="grp-logos d-flex align-items-center justify-content-end position-relative order-lg-3 mt-2 mt-lg-0">
            <i
              className="fa-solid fa-user"
              style={{ cursor: "pointer" }}
              onClick={handleToggle}
            ></i>

            {showBox && (
              <div
                ref={boxRef}
                className="classic-modal position-absolute"
                style={modalStyle}
              >
                {!loadingUser && usernameLocal ? (
                  !isEditing ? (
                    <div className="d-flex flex-column gap-2">
                      <h5 className="text-center mb-2">
                        Welcome, {usernameLocal}
                      </h5>
                      <button
                        className="btn btn-outline-primary w-100"
                        onClick={() => setIsEditing(true)}
                      >
                        Manage Profile
                      </button>
                      <Link
                        to="/orders"
                        className="btn btn-outline-secondary w-100"
                      >
                        Order History
                      </Link>
                      <button
                        className="btn btn-danger w-100"
                        onClick={handleLogOut}
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <form
                      onSubmit={handleUpdate}
                      className="d-flex flex-column gap-2"
                    >
                      <h5 className="text-center mb-2">Update Profile</h5>
                      <input
                        type="text"
                        name="username"
                        value={user.username}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Username"
                        required
                      />
                      <input
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Email"
                        required
                      />
                      <div className="d-flex justify-content-between gap-2">
                        <button
                          type="submit"
                          className="btn btn-primary flex-fill"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary flex-fill"
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )
                ) : (
                  <div className="d-flex flex-column gap-2">
                    <Link to="/login" className="btn btn-primary w-100">
                      Login
                    </Link>
                    <Link to="/register" className="btn btn-success w-100">
                      Register
                    </Link>
                  </div>
                )}
              </div>
            )}

            <Link to="/cart" className="position-relative ms-3 me-5">
              <i className="fa-solid fa-cart-shopping carts"></i>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
          </div>
        </div>
      </header>
      <div className="header-spacer"></div>
    </>
  );
};

export default Header;
