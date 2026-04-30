import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  // In a real application, this component would contain your login form
  // and authentication logic.

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>
        <p className="auth-subtitle">Welcome back! Please log in to your account.</p>
        {/* Placeholder for login form */}
        <form>
          <div className="input-group">
            <label htmlFor="email" className="input-label">Email</label>
            <div className="input-wrapper">
              <input type="email" id="email" name="email" className="input-field" placeholder="your@example.com" required />
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="password" className="input-label">Password</label>
            <div className="input-wrapper">
              <input type="password" id="password" name="password" className="input-field" placeholder="********" required />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Login</button>
        </form>
        <p className="auth-footer">
          Don't have an account? <Link to="/signup/doctor" className="link">Register as Doctor</Link> or <Link to="/signup/patient" className="link">Register as Patient</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;