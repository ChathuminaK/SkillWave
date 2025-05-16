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
  response => response,
  error => {
    // Log the error details
    console.error('API Error:', error.response || error);
    
    // Handle specific error cases
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Handle unauthorized - redirect to login
          localStorage.removeItem('auth_token');
          // Redirect to login if outside of login page
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
          break;
        
        case 404:
          console.error('Resource not found:', error.config.url);
          break;
          
        case 500:
          console.error('Server error:', error.response.data);
          break;
          
        default:
          console.error(`API error (${error.response.status}):`, error.response.data);
      }
    } else if (error.request) {
      // Network error (no response received)
      console.error('Network error - no response received:', error.request);
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