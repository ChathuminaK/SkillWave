import api from './api.service';
import { extractErrorMessage } from '../utils/extractErrorMessage';

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
      throw new Error(extractErrorMessage(error));
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
      throw new Error(extractErrorMessage(error));
    }
  }

  static async getProgressSummary(userId) {
    try {
      const response = await api.get(`/api/progress/summary/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching progress summary:', error);
      throw new Error(extractErrorMessage(error));
    }
  }

  static async markAsCompleted(userId, contentId, contentType) {
    try {
      const response = await api.put(
        `/api/progress/complete`,
        { userId, contentId, contentType }
      );
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.message || error.response?.data || 'Failed to mark item as complete.';
      throw new Error(msg);
    }
  }

  static async resetProgress(userId, contentId, contentType) {
    try {
      const response = await api.put(
        `/api/progress/reset`,
        { userId, contentId, contentType }
      );
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.message || error.response?.data || 'Failed to reset progress.';
      throw new Error(msg);
    }
  }

  static async updateProgress(userId, contentId, contentType, progress) {
    try {
      const response = await api.put(
        `/api/progress/update`,
        { userId, contentId, contentType, progressPercentage: progress }
      );
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.message || error.response?.data || 'Failed to update progress.';
      throw new Error(msg);
    }
  }
}