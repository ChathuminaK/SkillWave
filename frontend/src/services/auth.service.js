import api from './api.service';
import TokenUtil from './token.util';
import { extractErrorMessage } from '../utils/extractErrorMessage';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const AuthService = {  
  login: async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      if (response.data.accessToken) {
        TokenUtil.saveToken(response.data.accessToken);
        
        // Save refresh token
        if (response.data.refreshToken) {
          TokenUtil.saveRefreshToken(response.data.refreshToken);
        }
        
        localStorage.setItem('userId', response.data.userId);
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(extractErrorMessage(error));
    }
  },
  
  register: async (userData) => {
    try {
      const response = await api.post('/api/auth/register', userData);
      if (response.data.accessToken) {
        TokenUtil.saveToken(response.data.accessToken);
        
        // Save refresh token
        if (response.data.refreshToken) {
          TokenUtil.saveRefreshToken(response.data.refreshToken);
        }
        
        localStorage.setItem('userId', response.data.userId);
        return response.data;
      }
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Get current authenticated user info
  getCurrentUser: async () => {
    try {
      const response = await api.get('/api/auth/current-user');
      return response.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  },

  // Logout - invalidate token on server
  logout: async () => {
    try {
      // Call backend logout endpoint
      await api.post('/api/auth/logout');
      
      // Clean up tokens and storage
      TokenUtil.removeTokens();
      localStorage.removeItem('userId');
      
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (userData) => {
    try {
      const response = await api.put('/api/auth/profile', userData);
      return response.data;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  },
  
  isTokenExpiring: () => {
    return TokenUtil.isTokenExpiring();
  },
  
  getCurrentUser: async () => {
    const token = TokenUtil.getToken();
    if (!token) return null;
    try {
      const response = await api.get('/api/auth/current-user');
      return response.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  },

  getOAuthRegistrationUrl: (provider) => {
    return `${API_URL}/oauth2/authorize/${provider}?redirect_uri=${encodeURIComponent(window.location.origin)}/oauth2/redirect`;
  },
  
  getOAuthLoginUrl: (provider) => {
    return `${API_URL}/oauth2/authorize/${provider}?redirect_uri=${encodeURIComponent(window.location.origin)}/oauth2/redirect`;
  }
};

export default AuthService;