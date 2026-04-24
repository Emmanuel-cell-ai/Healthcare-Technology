import React from "react";

function FormContainer({ title, children }) {
  return (
    <div className="form-container">
      <h2>{title}</h2>
      {children}
    </div>
  );
}

export default FormContainer;
