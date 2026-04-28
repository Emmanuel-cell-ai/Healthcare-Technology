import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../shared/Input';
import Button from '../shared/Button';
import Logo from '../shared/Logo';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const { forgotPassword } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (forgotPassword(email)) setSent(true);
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
            <p className="auth-subtitle">Enter your email and we'll send you a default password.</p>
            <form onSubmit={handleSubmit}>
              <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" icon="📧" />
              <Button type="submit">Send</Button>
            </form>
          </>
        ) : (
          <>
            <h2>Check Your Email</h2>
            <p className="auth-subtitle">A default password has been sent to your email.</p>
            <Link to="/login" className="btn btn-primary">Back to Login</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;