import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { get, post, postForm } from '../services/api';

const AuthContext = createContext(null);
const STORAGE_KEY = 'carediv_auth';

function readStoredAuth() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

function persistAuth(token, user) {
  if (!token || !user) {
    window.localStorage.removeItem(STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }));
}

export const AuthProvider = ({ children }) => {
  const storedAuth = readStoredAuth();
  const [token, setToken] = useState(storedAuth?.token || '');
  const [user, setUser] = useState(storedAuth?.user || null);
  const [isLoading, setIsLoading] = useState(Boolean(storedAuth?.token));
  const [authError, setAuthError] = useState('');

  const userType = user?.role || null;

  useEffect(() => {
    let cancelled = false;

    async function bootstrapAuth() {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await get('/auth/me', token);
        if (!cancelled) {
          setUser(response.user);
          persistAuth(token, response.user);
          setAuthError('');
        }
      } catch (error) {
        if (!cancelled) {
          setToken('');
          setUser(null);
          persistAuth('', null);
          setAuthError(error.message);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    bootstrapAuth();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const applyAuth = (nextToken, nextUser) => {
    setToken(nextToken);
    setUser(nextUser);
    persistAuth(nextToken, nextUser);
  };

  const updateUser = (nextUser) => {
    setUser(nextUser);
    persistAuth(token, nextUser);
  };

  const clearError = () => setAuthError('');

  const login = async (email, password, expectedRole) => {
    setIsLoading(true);
    setAuthError('');

    try {
      const response = await post('/auth/login', { email, password });

      if (expectedRole && response.user.role !== expectedRole) {
        throw new Error(`This account is registered as a ${response.user.role}, not a ${expectedRole}.`);
      }

      applyAuth(response.token, response.user);
      return response.user;
    } catch (error) {
      setAuthError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (payload, role) => {
    setIsLoading(true);
    setAuthError('');

    try {
      const formData = new FormData();
      formData.append('role', role);
      formData.append('fullName', payload.fullName);
      formData.append('email', payload.email);
      formData.append('contact', payload.contact);
      formData.append('password', payload.password);
      formData.append('timezone', Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC');

      if (payload.emergencyContactName) {
        formData.append('emergencyContactName', payload.emergencyContactName);
      }

      if (payload.emergencyContactPhone) {
        formData.append('emergencyContactPhone', payload.emergencyContactPhone);
      }

      if (payload.medicalNotes) {
        formData.append('medicalNotes', payload.medicalNotes);
      }

      if (role === 'doctor') {
        if (payload.specialization) {
          formData.append('specialization', payload.specialization);
        }

        if (payload.maxPatients) {
          formData.append('maxPatients', String(payload.maxPatients));
        }

        if (payload.doctorLicense) {
          formData.append('doctorLicense', payload.doctorLicense);
        }
      }

      if (role === 'patient' && payload.medicalReports?.length) {
        payload.medicalReports.forEach((file) => {
          formData.append('medicalReports', file);
        });
      }

      const response = await postForm('/auth/signup', formData);
      applyAuth(response.token, response.user);
      return response.user;
    } catch (error) {
      setAuthError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    setIsLoading(true);
    setAuthError('');

    try {
      return await post('/auth/forgot-password', { email });
    } catch (error) {
      setAuthError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email, temporaryPassword, newPassword) => {
    setIsLoading(true);
    setAuthError('');

    try {
      return await post('/auth/reset-password', {
        email,
        temporaryPassword,
        newPassword,
      });
    } catch (error) {
      setAuthError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken('');
    setUser(null);
    setAuthError('');
    persistAuth('', null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      userType,
      isLoading,
      authError,
      clearError,
      login,
      signup,
      forgotPassword,
      resetPassword,
      logout,
      updateUser,
    }),
    [token, user, userType, isLoading, authError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
