import api from './api.service';

export const LearningPlanService = {
  // Get all learning plans with pagination and filtering
  getAll: async (page = 0, size = 10, sortBy = 'createdAt', direction = 'desc') => {
    try {
      const response = await api.get('/api/learning-plans', {
        params: { page, size, sortBy, direction }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching learning plans:', error);
      throw error;
    }
  },
  
  // Get featured learning plans
  getFeatured: async (limit = 5) => {
    try {
      const response = await api.get('/api/learning-plans/featured', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching featured learning plans:', error);
      throw error;
    }
  },
  
  // Get a specific learning plan by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/api/learning-plans/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching learning plan with ID ${id}:`, error);
      throw new Error('Failed to load the learning plan. It might have been deleted or does not exist.');
    }
  },
  
  // Get learning plans by topic
  getByTopic: async (topic) => {
    try {
      const response = await api.get('/api/learning-plans/by-topic', {
        params: { topic }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching learning plans for topic ${topic}:`, error);
      throw error;
    }
  },
  
  // Create a new learning plan (JSON only)
  create: async (learningPlan) => {
    try {
      const response = await api.post('/api/learning-plans', learningPlan);
      return response.data;
    } catch (error) {
      console.error('Error creating learning plan:', error);
      throw new Error('Failed to create learning plan. Please try again.');
    }
  },
  
  // Create a new learning plan with media
  createWithMedia: async (formData) => {
    try {
      // Check if formData is valid
      if (!(formData instanceof FormData)) {
        throw new Error('Invalid form data provided');
      }
      
      // Validate required fields
      if (!formData.get('title') || !formData.get('description')) {
        throw new Error('Title and description are required');
      }
      
      // Perform the request with a longer timeout for media upload
      const response = await api.post('/api/learning-plans/with-media', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000, // 60 seconds for media upload
      });
      
      return response.data;
    } catch (error) {
      console.error('Error creating learning plan with media:', error);
      throw new Error(error.response?.data?.message || 'Failed to create learning plan. Please try again.');
    }
  },
  
  // Update an existing learning plan (JSON only)
  update: async (id, learningPlan) => {
    try {
      const response = await api.put(`/api/learning-plans/${id}`, learningPlan);
      return response.data;
    } catch (error) {
      console.error(`Error updating learning plan with ID ${id}:`, error);
      throw new Error('Failed to update learning plan. Please try again.');
    }
  },
  
  // Update a learning plan with media
  updateWithMedia: async (id, formData) => {
    try {
      // Validate required fields
      if (!formData.get('title') || !formData.get('description')) {
        throw new Error('Title and description are required');
      }
      
      const response = await api.put(`/api/learning-plans/${id}/with-media`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000, // 60 seconds for media upload
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error updating learning plan with ID ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Failed to update learning plan. Please try again.');
    }
  },
  
  // Delete a learning plan
  delete: async (id) => {
    try {
      await api.delete(`/api/learning-plans/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting learning plan with ID ${id}:`, error);
      throw new Error('Failed to delete learning plan. Please try again.');
    }
  },
  
  // Get progress for a learning plan
  getProgressForUser: async (id, userId) => {
    try {
      const response = await api.get(`/api/learning-plans/${id}/progress/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching progress for learning plan ${id}:`, error);
      return { plan: null, progress: null };
    }
  },
  
  // Update progress for a learning plan
  updateProgress: async (id, userId, percentage) => {
    try {
      const response = await api.put(`/api/learning-plans/${id}/progress/${userId}/${percentage}`);
      return response.data;
    } catch (error) {
      console.error(`Error updating progress for learning plan ${id}:`, error);
      throw new Error('Failed to update progress. Please try again.');
    }
  },
  
  // Get learning plans analytics
  getAnalytics: async () => {
    try {
      const response = await api.get('/api/learning-plans/analytics');
      return response.data;
    } catch (error) {
      console.error('Error fetching learning plans analytics:', error);
      throw error;
    }
  }
};