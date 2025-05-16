import axios from 'axios';
import { TokenUtil } from './token.util';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// Create axios instance with default configs
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // Increased timeout for larger requests
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Enable cookies for all requests
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    // Log request details in development environment
    if (process.env.NODE_ENV === 'development') {
      console.log('API Request:', config.method?.toUpperCase(), config.url);
    }
    
    // Add token to request if it exists
    const token = TokenUtil.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Log response in development environment
    if (process.env.NODE_ENV === 'development') {
      console.log('API Response:', response.status, response.config.url);
    }
    return response;
  },
  async (error) => {
    // Log error in development environment
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', 
        error.response?.status, 
        error.config?.url, 
        error.response?.data
      );
    }
    
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized errors - token expired or invalid
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Import AuthService dynamically to avoid circular dependencies
        const { AuthService } = await import('./auth.service');
        const refreshed = await AuthService.refreshToken();
        
        if (refreshed) {
          // Update request with new token and retry
          const token = TokenUtil.getToken();
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }
        
        // If refresh failed, logout the user
        AuthService.logout();
        // Prevent infinite redirect loop
        if (!window.location.pathname.startsWith('/login')) {
          window.location.href = '/login?session=expired';
        }
        return Promise.reject(error);
      } catch (refreshError) {
        console.error("Error refreshing token:", refreshError);
        // Clear tokens on refresh error
        const { AuthService } = await import('./auth.service');
        AuthService.logout();
        if (!window.location.pathname.startsWith('/login')) {
          window.location.href = '/login?session=expired';
        }
        return Promise.reject(error);
      }
    }
    
    // Handle 404 Not Found
    if (error.response?.status === 404) {
      console.error('Resource not found:', error.config?.url);
    }
    
    // Handle 500 server errors
    if (error.response?.status >= 500) {
      console.error('Server error:', error.response?.data);
    }
    
    return Promise.reject(error);
  }
);

// Export API instance
export default api;

// Export helper functions for common API patterns
export const apiHelpers = {
  // Fetch data with pagination
  fetchPaginated: async (endpoint, page = 0, size = 10, params = {}) => {
    try {
      const response = await api.get(endpoint, {
        params: { page, size, ...params }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching paginated data from ${endpoint}:`, error);
      throw error;
    }
  },
  
  // Create resource
  create: async (endpoint, data) => {
    try {
      const response = await api.post(endpoint, data);
      return response.data;
    } catch (error) {
      console.error(`Error creating resource at ${endpoint}:`, error);
      throw error;
    }
  },
  
  // Update resource
  update: async (endpoint, id, data) => {
    try {
      const response = await api.put(`${endpoint}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating resource at ${endpoint}/${id}:`, error);
      throw error;
    }
  },
  
  // Delete resource
  remove: async (endpoint, id) => {
    try {
      const response = await api.delete(`${endpoint}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting resource at ${endpoint}/${id}:`, error);
      throw error;
    }
  }
};