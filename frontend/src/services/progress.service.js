import api from './api.service';

export const ProgressService = {
  // Get progress for a user
  getUserProgress: async (userId, page = 0, size = 10) => {
    try {
      const response = await api.get(`/api/progress/user/${userId}`, {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching progress for user ${userId}:`, error);
      throw error;
    }
  },
  
  // Get progress summary for a user
  getProgressSummary: async (userId) => {
    try {
      const response = await api.get(`/api/progress/user/${userId}/summary`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching progress summary for user ${userId}:`, error);
      throw error;
    }
  },
  
  // Get completed progress for a user
  getCompletedProgress: async (userId, page = 0, size = 10) => {
    try {
      const response = await api.get(`/api/progress/user/${userId}/completed`, {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching completed progress for user ${userId}:`, error);
      throw error;
    }
  },
  
  // Create new progress
  createProgress: async (progressData) => {
    try {
      const response = await api.post('/api/progress', progressData);
      return response.data;
    } catch (error) {
      console.error('Error creating progress:', error);
      throw error;
    }
  },
  
  // Get progress for a specific content item
  getProgressForContent: async (userId, contentId, contentType) => {
    try {
      const response = await api.get(`/api/progress/user/${userId}/content/${contentId}/type/${contentType}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Return null for 404 to indicate no progress exists yet
        return null;
      }
      console.error(`Error fetching progress for content ${contentId}:`, error);
      throw error;
    }
  },
  
  // Update progress percentage
  updateProgressPercentage: async (userId, contentId, contentType, percentage) => {
    try {
      const response = await api.put(`/api/progress/user/${userId}/content/${contentId}/type/${contentType}/percentage/${percentage}`);
      return response.data;
    } catch (error) {
      console.error(`Error updating progress percentage:`, error);
      throw error;
    }
  },
  
  // Mark content as completed
  markAsCompleted: async (userId, contentId, contentType) => {
    try {
      const response = await api.put(`/api/progress/user/${userId}/content/${contentId}/type/${contentType}/complete`);
      return response.data;
    } catch (error) {
      console.error(`Error marking content as completed:`, error);
      throw error;
    }
  },
  
  // Reset progress
  resetProgress: async (userId, contentId, contentType) => {
    try {
      const response = await api.put(`/api/progress/user/${userId}/content/${contentId}/type/${contentType}/reset`);
      return response.data;
    } catch (error) {
      console.error(`Error resetting progress:`, error);
      throw error;
    }
  },
  
  // Get learning plan progress specifically
  getLearningPlanProgress: async (userId, planId) => {
    try {
      const response = await api.get(`/api/progress/user/${userId}/content/${planId}/type/LEARNING_PLAN`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Return null for 404 to indicate no progress exists yet
        return null;
      }
      console.error(`Error fetching learning plan progress:`, error);
      throw error;
    }
  }
};