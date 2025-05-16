import api from './api.service';
import { TokenUtil } from './token.util';
import { extractErrorMessage } from '../utils/extractErrorMessage';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const AuthService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      if (response.data.accessToken) {
        TokenUtil.saveToken(response.data.accessToken);
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

  logout: async () => {
    try {
      await api.post('/api/auth/logout');
      TokenUtil.removeTokens();
      localStorage.removeItem('userId');
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      TokenUtil.removeTokens();
      localStorage.removeItem('userId');
      throw error;
    }
  },

  refreshToken: async () => {
    try {
      const refreshToken = TokenUtil.getRefreshToken();
      if (!refreshToken) {
        return false;
      }
      const response = await api.post('/api/auth/refresh-token', { refreshToken });
      if (response.data.accessToken) {
        TokenUtil.saveToken(response.data.accessToken);
        if (response.data.refreshToken) {
          TokenUtil.saveRefreshToken(response.data.refreshToken);
        }
        return true;
      }
      return false;
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

  updateProfile: async (userData) => {
    try {
      const response = await api.put('/api/auth/profile', userData);
      return response.data;
    } catch (error) {
      console.error('Profile update error:', error);
      return false;
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