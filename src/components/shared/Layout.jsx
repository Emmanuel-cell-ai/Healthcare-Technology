import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';

const Layout = ({ children }) => {
  const { user, userType, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="header-brand" onClick={() => navigate('/')}>
          <Logo size="small" />
        </div>
        {user && (
          <div className="header-actions">
            <span className="user-badge">{userType === 'doctor' ? '🩺' : '👤'} {user.name}</span>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </div>
        )}
      </header>
      <main className="main-content">{children}</main>
    </div>
  );
};

export default Layout;