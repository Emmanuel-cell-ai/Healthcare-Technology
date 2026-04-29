import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../shared/Button';
import Input from '../shared/Input';
import Logo from '../shared/Logo';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [userType, setUserType] = useState('patient');
  const [error, setError] = useState('');
  const { login, isLoading, authError, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    clearError();

    try {
      await login(email, password, userType);
      navigate(userType === 'patient' ? '/patient/dashboard' : '/doctor/dashboard');
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
        <h2>Welcome Back!</h2>
        <p className="auth-subtitle">Login to your account</p>
        {(error || authError) && <div className="alert alert-error">{error || authError}</div>}

        <div className="user-type-toggle">
          <button className={`toggle-btn ${userType === 'patient' ? 'active' : ''}`} onClick={() => setUserType('patient')} type="button">
            Patient
          </button>
          <button className={`toggle-btn ${userType === 'doctor' ? 'active' : ''}`} onClick={() => setUserType('doctor')} type="button">
            Doctor
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />

          <div className="form-row">
            <label className="checkbox-label">
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
              <span>Remember me</span>
            </label>
            <Link to="/forgot-password" className="link">Forgot Password?</Link>
          </div>

          <Button type="submit" disabled={isLoading}>{isLoading ? 'Logging in...' : 'Login'}</Button>
        </form>

        <p className="auth-footer">
          Don&apos;t have an account? <Link to={`/signup/${userType}`}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
