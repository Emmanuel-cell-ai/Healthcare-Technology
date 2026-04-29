import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../shared/Button';
import Input from '../shared/Input';
import Logo from '../shared/Logo';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const { forgotPassword, isLoading, authError, clearError } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    clearError();

    try {
      await forgotPassword(email);
      setSent(true);
    } catch (submitError) {
      setError(submitError.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <Logo size="default" />
        </div>
        {!sent ? (
          <>
            <h2>Forgot Password?</h2>
            <p className="auth-subtitle">Enter your email and we&apos;ll send you a temporary password.</p>
            {(error || authError) && <div className="alert alert-error">{error || authError}</div>}
            <form onSubmit={handleSubmit}>
              <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
              <Button type="submit" disabled={isLoading}>{isLoading ? 'Sending...' : 'Send'}</Button>
            </form>
          </>
        ) : (
          <>
            <h2>Check Your Email</h2>
            <p className="auth-subtitle">A temporary password has been sent to your email.</p>
            <p className="auth-subtitle">Use it on the reset screen to choose a new password.</p>
            <Link to="/reset-password" className="btn btn-primary">Go to Reset Password</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
