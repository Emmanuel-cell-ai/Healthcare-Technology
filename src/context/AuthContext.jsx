import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);

  const login = (email, password, type) => {
    const mockUser = { email, name: email.split('@')[0], id: type === 'patient' ? 'p1' : 'd1' };
    setUser(mockUser);
    setUserType(type);
    return true;
  };

  const signup = (userData, type) => {
    const mockUser = { ...userData, id: type === 'patient' ? 'p_new' : 'd_new' };
    setUser(mockUser);
    setUserType(type);
    return true;
  };

  const logout = () => {
    setUser(null);
    setUserType(null);
  };

  const forgotPassword = (email) => {
    alert(`Default password sent to ${email}`);
    return true;
  };

  const resetPassword = (newPassword) => {
    alert('Password reset successful');
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, userType, login, signup, logout, forgotPassword, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);