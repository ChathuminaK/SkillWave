import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthService } from '../services/auth.service';
import { TokenUtil } from '../services/token.util';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if the user is authenticated on initial load
    const checkAuthStatus = async () => {
      try {
        setLoading(true);
        const token = TokenUtil.getToken();
        
        if (!token) {
          setIsAuthenticated(false);
          setCurrentUser(null);
          return;
        }
        
        // Check if token needs refresh
        if (AuthService.isTokenExpiring()) {
          const refreshSuccess = await AuthService.refreshToken();
          if (!refreshSuccess) {
            // If refresh fails, log out the user
            handleLogout();
            return;
          }
        }
        
        // Verify the token with the backend and get user data
        const userData = await AuthService.getCurrentUser();
        
        if (userData) {
          setCurrentUser(userData);
          setIsAuthenticated(true);
        } else {
          // Token is invalid or expired
          handleLogout();
        }
      } catch (err) {
        console.error('Error checking authentication status:', err);
        handleLogout();
        setError('Authentication failed. Please log in again.');
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Set up a periodic token refresh check
  useEffect(() => {
    if (isAuthenticated) {
      const tokenCheckInterval = setInterval(async () => {
        try {
          if (AuthService.isTokenExpiring()) {
            const refreshSuccess = await AuthService.refreshToken();
            if (!refreshSuccess) {
              handleLogout();
            }
          }
        } catch (error) {
          console.error('Token refresh error:', error);
          handleLogout();
        }
      }, 60000); // Check every minute
      
      return () => clearInterval(tokenCheckInterval);
    }
  }, [isAuthenticated]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await AuthService.login(email, password);
      
      if (response) {
        // Auth data should already be stored in localStorage by AuthService.login
        // Get user data
        const userData = await AuthService.getCurrentUser();
        
        setCurrentUser(userData);
        setIsAuthenticated(true);
        setError(null);
        
        return userData;
      } else {
        throw new Error('Login failed');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      handleLogout();
    }
  };

  const handleLogout = () => {
    TokenUtil.removeTokens();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setError(null);
    window.location.href = '/login'; // Redirect to login page
  };

  const updateUserProfile = async (userData) => {
    try {
      setLoading(true);
      const updatedUser = await AuthService.updateProfile(userData);
      setCurrentUser(updatedUser);
      return updatedUser;
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    updateUserProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};