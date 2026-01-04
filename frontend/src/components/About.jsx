import React from "react";
import "./About.css";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="about-wrapper container pt-5">

      {/* Hero Section */}
      <section className="about-hero row align-items-center">
        <div className="col-md-6">
          <h1 className="about-title">
            Welcome to <span>ShopXpress</span>
          </h1>
          <p className="about-subtitle">
            Your trusted destination for seamless online shopping. We bring you
            premium products, fast delivery, and exceptional customer service
            all in one place.
          </p>
          <Link to="/products">
          <button className="btn about-btn btn-primary mt-3">Explore Products</button></Link>
        </div>

        <div className="col-md-6">
          <img
            src="/images/about-hero.jpg"
            className="about-hero-img img-fluid"
            alt="Hero"
          />
        </div>
      </section>

      {/* Mission Section */}
      <section className="about-mission row mt-5">
        <div className="col-md-4">
          <div className="about-box shadow-sm">
            <i className="fa-solid fa-bullseye icon"></i>
            <h4>Our Mission</h4>
            <p>
              Deliver top-quality products with an exceptional shopping
              experience tailored for you.
            </p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="about-box shadow-sm">
            <i className="fa-solid fa-face-smile icon"></i>
            <h4>Customer First</h4>
            <p>
              Your satisfaction is our priority — we ensure secure payments,
              fast delivery, and support.
            </p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="about-box shadow-sm">
            <i className="fa-solid fa-truck-fast icon"></i>
            <h4>Fast Delivery</h4>
            <p>
              Our delivery service ensures that your orders reach you quickly
              and safely.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="about-team mt-5">
        <h2 className="text-center mb-4">Meet Our Team</h2>

        <div className="row mb-5">
          <div className="col-md-4">
            <div className="team-card shadow-sm">
              <img
                src="/images/team1.jpg"
                alt="team"
                className="team-img"
              />
              <h5 className="mt-3">Vivek Chavda</h5>
              <p>Founder & CEO</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="team-card shadow-sm">
              <img
                src="/images/team2.jpg"
                alt="team"
                className="team-img"
              />
              <h5 className="mt-3">Shreya Sharma</h5>
              <p>Marketing Head</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="team-card shadow-sm">
              <img
                src="/images/team3.jpg"
                alt="team"
                className="team-img"
              />
              <h5 className="mt-3">Hari Patel</h5>
              <p>Product Manager</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
