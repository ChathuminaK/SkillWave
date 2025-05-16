import { jwtDecode } from 'jwt-decode';

/**
 * Shared token utilities to avoid circular dependencies
 */
export const TokenUtil = {
  getToken: () => {
    return localStorage.getItem('auth_token');
  },
  
  getRefreshToken: () => {
    return localStorage.getItem('refresh_token');
  },
  
  saveToken: (token) => {
    localStorage.setItem('auth_token', token);
  },
  
  saveRefreshToken: (refreshToken) => {
    localStorage.setItem('refresh_token', refreshToken);
  },
  
  removeTokens: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  },
  
  isTokenExpiring: (minValidity = 300) => { // Default 5 minutes
    const token = localStorage.getItem('auth_token');
    if (!token) return true;
    
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      // Check if token will expire in the next X seconds
      return decoded.exp < currentTime + minValidity;
    } catch (error) {
      console.error('Token validation error:', error);
      return true;
    }
  }
};

export default TokenUtil;
