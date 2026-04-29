import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../shared/Logo';

const ResetSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="success-container">
      <div className="success-card">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
  <Logo size="default" />
</div>
        <div className="success-icon">✓</div>
        <h2>Password Reset Successful!</h2>
        <p>Your new password has been saved.</p>
        <p className="success-hint">You can now log in with your new password.</p>
        <button 
          className="btn btn-primary" 
          onClick={() => navigate('/login')}
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default ResetSuccess;