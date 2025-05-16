import React, { createContext, useState, useEffect } from 'react';
import { AuthService } from '../services/auth.service';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Parse JWT helper function
  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token');
        console.log('Token in storage:', token);
        
        if (token) {
          // Validate token and check expiration
          const decoded = parseJwt(token);
          console.log('Decoded token:', decoded);
          
          if (decoded) {
            console.log('Token expiration:', new Date(decoded.exp * 1000).toLocaleString());
            
            // Check if token is expired
            if (decoded.exp * 1000 > Date.now()) {
              const userResponse = await AuthService.getCurrentUser();
              setCurrentUser(userResponse);
              setIsAuthenticated(true);
            } else {
              // Token expired, clear storage
              localStorage.removeItem('auth_token');
              localStorage.removeItem('userId');
              setIsAuthenticated(false);
            }
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError('Failed to authenticate');
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await AuthService.login(credentials);
      
      if (response.token) {
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('userId', response.userId);
        
        console.log('Token in storage:', localStorage.getItem('auth_token'));
        const decoded = parseJwt(response.token);
        console.log('Decoded token:', decoded);
        console.log('Token expiration:', new Date(decoded.exp * 1000).toLocaleString());
        
        setCurrentUser(response.user);
        setIsAuthenticated(true);
        setError(null);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('userId');
      setCurrentUser(null);
      setIsAuthenticated(false);
    }
  };

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};