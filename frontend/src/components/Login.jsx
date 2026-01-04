import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCooldown, setIsCooldown] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading || isCooldown) return; // Prevent multiple submissions
    setLoading(true);
    setIsCooldown(true);

    setTimeout(() => setIsCooldown(false), 2000);

    try {
      const response = await axios.post("http://localhost:3000/api/auth/login", {
        email,
        password,
      });

      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });

      Toast.fire({
        icon: "success",
        title: response?.data?.message || "Signed in successfully",
      });

      localStorage.setItem("token", response?.data?.token);
      localStorage.setItem("username", response?.data?.user?.username);
      localStorage.setItem("userId", response?.data?.user?.userId);
      localStorage.setItem("role", response?.data?.user?.role);

      if (response.data.user.role === "user") {
        navigate("/");
      } else if (response.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Error during login:", err);
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });

      Toast.fire({
        icon: "error",
        title:
          err?.response?.data?.message || "Login failed! Please try again.",
      });
    }finally {
      setLoading(false); // stop loader
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{
        minHeight: "70vh",
      }}
    >
      <div
        className="card shadow-lg p-4 border-0"
        style={{
          width: "100%",
          maxWidth: "420px",
          borderRadius: "20px",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
        }}
      >
        <h3
          className="text-center mb-4 fw-bold"
          style={{ fontSize: "1.8rem", color: "black" }}
        >
          Welcome Back
        </h3>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label
              className="form-label fw-semibold"
              style={{ fontSize: "1rem" }}
            >
              Email
            </label>
            <input
              className="form-control"
              type="email"
              placeholder="Enter your email"
              required
              style={{
                borderRadius: "10px",
                padding: "10px",
                fontSize: "0.95rem",
                border: "1px solid #ced4da",
                transition: "border-color 0.3s ease, box-shadow 0.3s ease",
              }}
              onBlur={(e) => (e.target.style.borderColor = "#ced4da")}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label
              className="form-label fw-semibold"
              style={{ fontSize: "1rem" }}
            >
              Password
            </label>
            <input
              className="form-control"
              type="password"
              placeholder="Enter password"
              required
              style={{
                borderRadius: "10px",
                padding: "10px",
                fontSize: "0.95rem",
                border: "1px solid #ced4da",
                transition: "border-color 0.3s ease, box-shadow 0.3s ease",
              }}
              onBlur={(e) => (e.target.style.borderColor = "#ced4da")}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            className="btn w-100 py-2 fw-semibold"
            disabled={loading || isCooldown}
            type="submit"
            style={{
              backgroundColor: "#007bff",
              color: "#fff",
              borderRadius: "10px",
              fontSize: "1rem",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#0056b3";
              e.target.style.transform = "scale(1.03)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#007bff";
              e.target.style.transform = "scale(1)";
            }}
          >{loading ? "Signing..." :  "Login"}
          </button>
        </form>

        <p
          className="text-center mt-4 mb-0"
          style={{ fontSize: "0.95rem", color: "#555" }}
        >
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="fw-semibold text-decoration-none"
            style={{
              color: "#007bff",
              transition: "color 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.color = "#0056b3")}
            onMouseLeave={(e) => (e.target.style.color = "#007bff")}
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
