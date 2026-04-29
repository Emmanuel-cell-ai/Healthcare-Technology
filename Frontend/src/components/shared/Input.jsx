import React from 'react';

const Input = ({ label, type = 'text', value, onChange, placeholder, icon, error }) => {
  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <div className="input-wrapper">
        {icon && <span className="input-icon">{icon}</span>}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`input-field ${error ? 'input-error' : ''}`}
        />
      </div>
      {error && <span className="error-text">{error}</span>}
    </div>
  );
};

export default Input;