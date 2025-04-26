import api from './api.service';

export const LearningPlanService = {
  // Get all learning plans
  getAll: async () => {
    try {
      const response = await api.get('/learning-plans');
      return response.data;
    } catch (error) {
      console.error('Error fetching learning plans:', error);
      throw error;
    }
  },

  // Get a specific learning plan by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/learning-plans/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching learning plan ${id}:`, error);
      throw error;
    }
  },

  // Create a new learning plan (JSON only, no media)
  create: async (learningPlan) => {
    try {
      const response = await api.post('/learning-plans', learningPlan);
      return response.data;
    } catch (error) {
      console.error('Error creating learning plan:', error);
      throw error;
    }
  },

  // Create a new learning plan with media files
  createWithMedia: async (formData) => {
    try {
      console.log('Sending form data:', formData);
      const response = await api.post('/learning-plans/with-media', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating learning plan with media:', error);
      // Log the detailed error if available
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      throw error;
    }
  },

  // Update an existing learning plan (JSON only, no media)
  update: async (id, learningPlan) => {
    try {
      const response = await api.put(`/learning-plans/${id}`, learningPlan);
      return response.data;
    } catch (error) {
      console.error(`Error updating learning plan ${id}:`, error);
      throw error;
    }
  },

  // Update a learning plan with media files
  updateWithMedia: async (id, formData) => {
    try {
      console.log(`Updating learning plan ${id} with media`);
      const response = await api.put(`/learning-plans/${id}/with-media`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating learning plan ${id} with media:`, error);
      
      // Handle 404 Not Found specifically
      if (error.response && error.response.status === 404) {
        throw new Error(`Learning plan with ID ${id} no longer exists. It may have been deleted.`);
      }
      
      // Log detailed error information
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        throw new Error(error.response.data.message || `Error: ${error.response.status}`);
      }
      
      throw error;
    }
  },

  // Delete a learning plan
  delete: async (id) => {
    try {
      await api.delete(`/learning-plans/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting learning plan ${id}:`, error);
      throw error;
    }
  }
};