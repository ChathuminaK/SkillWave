import api from './api.service';

export class ProgressService {
  static async getUserProgress(userId, page = 0, size = 10) {
    try {
      const response = await api.get(
        `/api/progress/user/${userId}`,
        { params: { page, size, status: 'IN_PROGRESS' } }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching user progress:', error);
      throw error;
    }
  }

  static async getCompletedProgress(userId, page = 0, size = 10) {
    try {
      const response = await api.get(
        `/api/progress/user/${userId}`,
        { params: { page, size, status: 'COMPLETED' } }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching completed progress:', error);
      throw error;
    }
  }

  static async getProgressSummary(userId) {
    try {
      const response = await api.get(`/api/progress/summary/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching progress summary:', error);
      throw error;
    }
  }

  // Only for learning plan progress
  static async updateProgress(userId, contentId, contentType, progress) {
    if (contentType !== 'LEARNING_PLAN') throw new Error('Progress update only allowed for learning plans');
    try {
      const response = await api.put(
        `/api/learning-plans/${contentId}/progress/${userId}/${progress}`
      );
      return response.data;
    } catch (error) {
      console.error('Error updating progress:', error);
      throw error;
    }
  }
}