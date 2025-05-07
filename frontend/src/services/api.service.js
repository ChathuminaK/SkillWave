import axios from 'axios';

// Determine API base URL based on environment
const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://api.skillwave.yourdomain.com'; // Change to your production API domain
  }
  return 'http://localhost:8080'; // Local development API
};

// Create a base API instance
const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds timeout
});

// Add or update request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Adding token to request:', config.url);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
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

// API instance with debugging wrapper for development
const apiWithDebug = process.env.NODE_ENV !== 'production' 
  ? {
      get: async (...args) => {
        console.log(`🔍 GET:`, args[0]);
        try {
          const response = await api.get(...args);
          console.log(`✓ Response for GET ${args[0]}:`, response.data);
          return response;
        } catch (error) {
          console.error(`✗ Error for GET ${args[0]}:`, error);
          throw error;
        }
      },
      post: async (...args) => {
        console.log(`🔍 POST:`, args[0], args[1]);
        try {
          const response = await api.post(...args);
          console.log(`✓ Response for POST ${args[0]}:`, response.data);
          return response;
        } catch (error) {
          console.error(`✗ Error for POST ${args[0]}:`, error);
          throw error;
        }
      },
      put: async (...args) => {
        console.log(`🔍 PUT:`, args[0], args[1]);
        try {
          const response = await api.put(...args);
          console.log(`✓ Response for PUT ${args[0]}:`, response.data);
          return response;
        } catch (error) {
          console.error(`✗ Error for PUT ${args[0]}:`, error);
          throw error;
        }
      },
      delete: async (...args) => {
        console.log(`🔍 DELETE:`, args[0]);
        try {
          const response = await api.delete(...args);
          console.log(`✓ Response for DELETE ${args[0]}:`, response.data);
          return response;
        } catch (error) {
          console.error(`✗ Error for DELETE ${args[0]}:`, error);
          throw error;
        }
      }
    }
  : api;

export default apiWithDebug;