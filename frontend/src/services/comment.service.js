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
  
  // Get replies for a comment
  getCommentsByParentId: async (parentId, page = 0, size = 10) => {
    try {
      const response = await api.get(`/api/comments/${parentId}/replies`, {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching replies for comment ${parentId}:`, error);
      return { content: [], totalElements: 0 };
    }
  },
  
  // Create a new comment
  createComment: async (comment) => {
    try {
      const response = await api.post('/api/comments', comment);
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.message || error.response?.data || 'Error creating comment.';
      console.error('Error creating comment:', msg);
      throw new Error(msg);
    }
  },
  
  // Update a comment
  updateComment: async (id, comment, userId) => {
    try {
      const response = await api.put(`/api/comments/${id}?userId=${userId}`, comment);
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.message || error.response?.data || `Error updating comment ${id}.`;
      console.error(`Error updating comment ${id}:`, msg);
      throw new Error(msg);
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
      const msg = error.response?.data?.message || error.response?.data || `Error deleting comment ${id}.`;
      console.error(`Error deleting comment ${id}:`, msg);
      throw new Error(msg);
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
  },
  
  // Like or unlike a comment
  likeComment: async (commentId, userId, action = 'like') => {
    try {
      const response = await api.post(`/api/comments/${commentId}/${action}`, { userId });
      return response.data;
    } catch (error) {
      console.error(`Error ${action}ing comment ${commentId}:`, error);
      throw error;
    }
  }
};