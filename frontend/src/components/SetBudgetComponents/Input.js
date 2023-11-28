import React from "react";
import "../../Pages/SetBudget/setbudget";

export const Input = ({ type, placeholder, header, value, setter }) => {
  return (
    <div className="input">
        <h1 className="content">{header}</h1>
      <input
        type={type}
        className="budget"
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          setter(e.target.value);
        }}
      />
    </div>
  );
};
