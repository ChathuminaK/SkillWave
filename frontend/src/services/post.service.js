import api from './api.service';
import { extractErrorMessage } from '../utils/extractErrorMessage';

export const PostService = {
  // Get all posts with pagination and filters
  getPosts: async (page = 0, size = 10, category = null, sortBy = 'createdAt', direction = 'desc') => {
    try {
      let url = `/api/educational-posts?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`;
      if (category && category !== 'all') url += `&category=${category}`;
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw new Error(extractErrorMessage(error));
    }
  },

  // Get a specific post by ID
  getPostById: async (id) => {
    try {
      const response = await api.get(`/api/educational-posts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching post with ID ${id}:`, error);
      throw new Error(extractErrorMessage(error));
    }
  },

  // Create a new post with media
  createPostWithMedia: async (formData) => {
    try {
      const response = await api.post('/api/educational-posts/with-media', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.message || error.response?.data || 'Failed to create post. Please try again.';
      throw new Error(msg);
    }
  },

  // Create a new post (JSON only)
  createPost: async (postData) => {
    try {
      const response = await api.post('/api/educational-posts', postData);
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.message || error.response?.data || 'Failed to create post. Please try again.';
      throw new Error(msg);
    }
  },

  // Update an existing post with media
  updatePostWithMedia: async (id, formData) => {
    try {
      const response = await api.put(`/api/educational-posts/${id}/with-media`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.message || error.response?.data || 'Failed to update post. Please try again.';
      throw new Error(msg);
    }
  },

  // Update an existing post (JSON only)
  updatePost: async (id, postData) => {
    try {
      const response = await api.put(`/api/educational-posts/${id}`, postData);
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.message || error.response?.data || 'Failed to update post. Please try again.';
      throw new Error(msg);
    }
  },

  // Delete a post
  deletePost: async (id) => {
    try {
      await api.delete(`/api/educational-posts/${id}`);
      return true;
    } catch (error) {
      const msg = error.response?.data?.message || error.response?.data || 'Failed to delete post. Please try again.';
      throw new Error(msg);
    }
  },

  // Get categories from the API
  getCategories: async () => {
    try {
      const response = await api.get('/api/educational-posts/analytics/category-counts');
      // Return array of categories
      return Object.keys(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }
};