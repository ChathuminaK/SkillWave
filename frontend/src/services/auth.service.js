import api from './api.service';

export const AuthService = {
  // Regular email/password login
  login: async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      
      // Make sure we're storing the token correctly
      if (response.data && response.data.accessToken) {
        localStorage.setItem('auth_token', response.data.accessToken);
        console.log('Token stored successfully');
      } else {
        console.error('Token not found in response', response.data);
      }
      
      // Get current user info
      return await AuthService.getCurrentUser();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // User registration
  register: async (userData) => {
    try {
      const response = await api.post('/api/auth/register', userData);
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
      await api.post('/api/auth/logout');
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
      console.error('Profile update error:', error);
      throw error;
    }
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.put('/api/auth/change-password', {
        currentPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      console.error('Password change error:', error);
      throw error;
    }
  },

  // Get OAuth login URL
  getOAuthLoginUrl: (provider) => {
    if (provider === 'google') {
      return `${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/api/auth/oauth2/google/login`;
    } else if (provider === 'github') {
      return `${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/api/auth/oauth2/github/login`;
    }
    return null;
  },

  // Get OAuth registration URL
  getOAuthRegistrationUrl: (provider) => {
    if (provider === 'google') {
      return `${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/api/auth/oauth2/google/register`;
    } else if (provider === 'github') {
      return `${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/api/auth/oauth2/github/register`;
    }
    return null;
  },

  // Request password reset
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/api/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      console.error('Password reset request error:', error);
      throw error;
    }
  },

  // Reset password with token
  resetPassword: async (token, newPassword) => {
    try {
      const response = await api.post('/api/auth/reset-password', {
        token,
        newPassword
      });
      return response.data;
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }
};