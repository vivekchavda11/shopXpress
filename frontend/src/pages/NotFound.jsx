import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const role = localStorage.getItem("role");
  return (
    <div className="container text-center py-5">
      <h1 className="display-3 text-danger">404</h1>
      <h2 className="mb-3">Page Not Found</h2>
      <p className="mb-3">
        Oops! The page you are looking for doesn’t exist or has been moved.
      </p>
      <br />
      <Link to={role === "admin" ? "/admin" : "/"} className="btn btn-primary">
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
