import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './shared/Logo';

const Onboarding = () => {
  const navigate = useNavigate();

  return (
    <div className="onboarding-container">
      <div className="onboarding-content">
        <Logo size="large" />

        <h1>Welcome to CareDiv</h1>
        <p className="onboarding-subtitle">Let's help you build a better health future.</p>

        <div className="onboarding-features">
          <div className="feature-item">
            <span className="feature-icon">💊</span>
            <p>Stay on top of your medication</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📊</span>
            <p>Track your symptoms daily</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🩺</span>
            <p>Prepare for further consultations</p>
          </div>
        </div>

        <button className="btn btn-primary onboarding-btn" onClick={() => navigate('/login')}>
          Get Started
        </button>

        <div className="onboarding-dots">
          <span className="dot active"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;