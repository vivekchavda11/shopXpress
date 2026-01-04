import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import "./Contact.css";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, message } = formData;

    // 🔍 Validation
    if (!name || !email || !message) {
      toast.error("All fields are required!");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Enter a valid email!");
      return;
    }

    setLoading(true);

    try {
      await axios.post("http://localhost:3000/api/contact", formData);

      // Success Alert
      Swal.fire({
        title: "Message Sent!",
        text: "We will contact you soon.",
        icon: "success",
        confirmButtonColor: "#3085d6",
      });

      // Clear form
      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (err) {
      toast.error("Failed to send message!");
      console.log(err);
    }

    setLoading(false);
  };

  return (
    <div className="contact-wrapper">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Hero Section */}
      <div className="contact-hero text-center">
        <h1>
          Contact <span>ShopXpress</span>
        </h1>
        <p>We’re here to assist you with orders or queries.</p>
      </div>

      <div className="container contact-container shadow-lg p-4">
        <div className="row g-4">
          {/* Left Info Section */}
          <div className="col-md-5 contact-info-section p-4 rounded shadow-sm">
            <h3 className="contact-title">Get In Touch</h3>
            <p className="contact-desc">Have questions? Reach out anytime!</p>

            <div className="contact-details">
              <p>
                <i className="bi bi-geo-alt-fill"></i> Ahmedabad, Gujarat –
                380051
              </p>
              <p>
                <i className="bi bi-telephone-fill"></i> +91 81401 91260
              </p>
              <p>
                <i className="bi bi-envelope-fill"></i> support@shopxpress.com
              </p>
            </div>
          </div>

          {/* Right Form Section */}
          <div className="col-md-7">
            <form
              className="contact-form p-4 rounded shadow-sm"
              onSubmit={handleSubmit}
            >
              <h4 className="form-title">Send Us a Message</h4>

              <div className="mb-3">
                <label className="mb-1">Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter your name"
                />
              </div>

              <div className="mb-3">
                <label className="mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter your email"
                />
              </div>

              <div className="mb-3">
                <label className="mb-1">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="form-control"
                  rows="4"
                  placeholder="Type your message..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn contact-btn w-100"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
