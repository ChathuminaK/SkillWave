import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: false,  // CHANGE THIS TO FALSE FIRST TO TEST
  timeout: 30000  // Set a reasonable timeout
});

// Add request interceptor for logging
api.interceptors.request.use(
  config => {
    // For debugging - log requests
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    
    // Remove Content-Type header for FormData (multipart/form-data)
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
      console.log('Sending form data - Content-Type header removed');
    }
    
    return config;
  },
  error => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging
api.interceptors.response.use(
  response => {
    console.log(`API Response: ${response.status} from ${response.config.url}`);
    return response;
  },
  error => {
    if (error.response) {
      console.error(`API Error ${error.response.status} from ${error.config.url}`);
      console.error('Error details:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

// Updated file upload function
const uploadFile = async (file) => {
  console.log('Starting file upload for:', file.name);
  
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    // Use the correct URL path and explicitly set headers
    const response = await axios({
      method: 'POST',
      url: 'http://localhost:8080/api/media/upload-test',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: false,  // Try without credentials first
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        console.log('Upload progress:', percentCompleted);
      }
    });
    
    console.log('Upload successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Upload failed with error:', error);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received. Request details:', error.request);
    } else {
      console.error('Error details:', error.message);
    }
    throw error;
  }
};

export default api;
export { uploadFile };