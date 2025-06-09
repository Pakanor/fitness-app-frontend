import React from "react";

const Button = ({ type = "button", onClick, children, className = "", ...rest }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`btn ${className}`} 
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
