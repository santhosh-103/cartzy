import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('userInfo');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    if (user) {
      localStorage.setItem('userInfo', JSON.stringify(user));
    } else {
      localStorage.removeItem('userInfo');
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post('/api/users/login', { email, password });
      setUser(data);
      addToast(`Welcome back, ${data.name}!`, 'success');
      return { success: true, data };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed';
      addToast(msg, 'error');
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const { data } = await api.post('/api/users/register', userData);
      setUser(data);
      addToast(`Account created successfully! Welcome, ${data.name}!`, 'success');
      return { success: true, data };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed';
      addToast(msg, 'error');
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
    addToast('Signed out of Amazon successfully.', 'info');
  };

  const updateProfile = async (updateData) => {
    setLoading(true);
    try {
      const { data } = await api.put('/api/users/profile', updateData);
      setUser(data);
      addToast('Profile updated successfully!', 'success');
      return { success: true, data };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Profile update failed';
      addToast(msg, 'error');
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: !!user?.isAdmin,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
