import React from "react";

const Button = ({ className, title }) => {
  return (
    <>
      <span className="me-2">
        <button className={className}>{title}</button>
      </span>
    </>
  );
};

export default Button;
