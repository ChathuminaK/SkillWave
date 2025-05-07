import api from './api.service';

export const CommentService = {
  // Get comments for a post
  getCommentsByPostId: async (postId, page = 0, size = 10) => {
    try {
      const response = await api.get(`/api/comments/post/${postId}/paginated`, {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching comments for post ${postId}:`, error);
      return { comments: [], totalPages: 0, currentPage: 0 };
    }
  },
  
  // Create a new comment
  createComment: async (comment) => {
    try {
      const response = await api.post('/api/comments', comment);
      return response.data;
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  },
  
  // Update a comment
  updateComment: async (id, comment, userId) => {
    try {
      const response = await api.put(`/api/comments/${id}?userId=${userId}`, comment);
      return response.data;
    } catch (error) {
      console.error(`Error updating comment ${id}:`, error);
      throw error;
    }
  },
  
  // Delete a comment
  deleteComment: async (id, userId, postOwnerId = null) => {
    try {
      let url = `/api/comments/${id}?userId=${userId}`;
      if (postOwnerId) {
        url += `&postOwnerId=${postOwnerId}`;
      }
      await api.delete(url);
      return true;
    } catch (error) {
      console.error(`Error deleting comment ${id}:`, error);
      throw error;
    }
  },
  
  // Count comments for a post
  countCommentsByPostId: async (postId) => {
    try {
      const response = await api.get(`/api/comments/count/post/${postId}`);
      return response.data.count;
    } catch (error) {
      console.error(`Error counting comments for post ${postId}:`, error);
      return 0;
    }
  }
};