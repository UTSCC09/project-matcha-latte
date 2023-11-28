import React from "react";
import "../../Pages/LogOrSign/logorsign";

export const Input = ({ type, placeholder, header, value, setter, isValid, errorMessage }) => {
  return (
    <div className="input">
        <h1 className="content">{header}</h1>
      <input
        type={type}
        className="email"
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          setter(e.target.value);
        }}
      />
      {!isValid && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};
