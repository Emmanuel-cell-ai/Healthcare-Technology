import React from 'react';

const Alert = ({ message, type = 'info', onClose }) => {
  return (
    <div className={`alert alert-${type}`}>
      <span>{message}</span>
      {onClose && <button onClick={onClose} className="alert-close">✕</button>}
    </div>
  );
};

export default Alert;