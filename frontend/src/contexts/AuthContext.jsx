import React, { createContext, useState, useContext, useEffect } from 'react';
import AuthService from '../services/auth.service';
import { TokenUtil } from '../services/token.util';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if there's a valid token
        if (TokenUtil.getToken()) {
          const currentUser = await AuthService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            setIsAuthenticated(true);
          } else {
            // If getCurrentUser fails, clean up tokens
            TokenUtil.removeTokens();
            localStorage.removeItem('userId');
          }
        }
      } catch (error) {
        console.error('Authentication initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Set up token refresh interval
  useEffect(() => {
    if (!isAuthenticated) return;

    const refreshTokenIfNeeded = async () => {
      if (AuthService.isTokenExpiring()) {
        const refreshed = await AuthService.refreshToken();
        if (!refreshed) {
          // If refresh fails, log the user out
          setIsAuthenticated(false);
          setUser(null);
          TokenUtil.removeTokens();
          localStorage.removeItem('userId');
        }
      }
    };

    refreshTokenIfNeeded();
    const intervalId = setInterval(refreshTokenIfNeeded, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(intervalId);
  }, [isAuthenticated]);

  const value = {
    isAuthenticated,
    setIsAuthenticated,
    user,
    setUser,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
