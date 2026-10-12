import React, { createContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error('Auth initialization error:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const responseData = await response.json();
    if (!response.ok || responseData.error) {
      const errMsg = responseData.error?.message || responseData.error || 'Login failed';
      throw new Error(errMsg);
    }
    
    // Save accessToken
    localStorage.setItem('token', responseData.data.accessToken);
    // Remove token from data before saving to state
    const { accessToken, ...userData } = responseData.data;
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return responseData.data;
  };

  const signup = async (username, email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: username, email, password })
    });

    const responseData = await response.json();
    
    // Check for error in response status or response body error field
    if (!response.ok || responseData.error) {
      const errMsg = responseData.error?.message || responseData.error || 'Signup failed';
      throw new Error(errMsg);
    }

    return responseData.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
