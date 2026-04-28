import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../shared/Input';
import Button from '../shared/Button';
import Logo from '../shared/Logo';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [userType, setUserType] = useState('patient');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(email, password, userType)) {
      navigate(userType === 'patient' ? '/patient/dashboard' : '/doctor/dashboard');
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
        
        <div className="user-type-toggle">
          <button className={`toggle-btn ${userType === 'patient' ? 'active' : ''}`} onClick={() => setUserType('patient')}>
            👤 Patient
          </button>
          <button className={`toggle-btn ${userType === 'doctor' ? 'active' : ''}`} onClick={() => setUserType('doctor')}>
            🩺 Doctor
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" icon="📧" />
          <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" icon="🔒" />
          
          <div className="form-row">
            <label className="checkbox-label">
              <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />
              <span>Remember me</span>
            </label>
            <Link to="/forgot-password" className="link">Forgot Password?</Link>
          </div>

          <Button type="submit">Login</Button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to={`/signup/${userType}`}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;