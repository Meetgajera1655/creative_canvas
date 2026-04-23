// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(() => { try { return JSON.parse(localStorage.getItem('cc_user')); } catch { return null; } });
  const [loading, setLoading] = useState(true);

  // Verify token on mount
  useEffect(() => {
    const token = localStorage.getItem('cc_token');
    if (!token) { setLoading(false); return; }
    authAPI.me()
      .then(r => setUser(r.data.user))
      .catch(() => { localStorage.removeItem('cc_token'); localStorage.removeItem('cc_user'); setUser(null); })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await authAPI.login({ email, password });
    const { token, user: u } = res.data;
    localStorage.setItem('cc_token', token);
    localStorage.setItem('cc_user', JSON.stringify(u));
    setUser(u);
    return u;
  }, []);

  const signup = useCallback(async (data) => {
    const res = await authAPI.signup(data);
    const { token, user: u } = res.data;
    localStorage.setItem('cc_token', token);
    localStorage.setItem('cc_user', JSON.stringify(u));
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('cc_token');
    localStorage.removeItem('cc_user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, isAdmin: user?.isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
