import React, { useState } from 'react';
import axios from 'axios';

const CommentForm = ({ 
  postId, 
  parentId = null, 
  commentId = null,
  initialContent = '', 
  isEditing = false,
  onCommentAdded, 
  onCancel,
  placeholder = 'Add your thoughts or questions...'
}) => {
  const [content, setContent] = useState(initialContent);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // In a real app, get these from authentication context
  const currentUserId = 'user123';
  const currentUserName = 'John Doe';
  const currentUserAvatar = null;

  const handleContentChange = (e) => {
    setContent(e.target.value);
    // Clear any previous error when user starts typing
    if (error) setError(null);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Comment cannot be empty');
      return;
    }
    
    setLoading(true);
    
    try {
      let response;
      const commentData = {
        content: content.trim(),
        userId: currentUserId,
        userName: currentUserName,
        userAvatar: currentUserAvatar
      };
      
      if (isEditing) {
        // Update existing comment
        response = await CommentService.updateComment(commentId, commentData, currentUserId);
      } else if (parentId) {
        // Create a reply
        response = await CommentService.createComment({
          ...commentData,
          postId,
          parentId
        });
      } else {
        // Create a new comment
        response = await CommentService.createComment({
          ...commentData,
          postId
        });
      }
      
      onCommentAdded(response);
      setContent('');
      setError(null);
    } catch (err) {
      setError('Failed to post comment. Please try again.');
      console.error('Error posting comment:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <div className="mb-3">
        <textarea
          className={`form-control ${error ? 'is-invalid' : ''}`}
          rows="3"
          placeholder={placeholder}
          value={content}
          onChange={handleContentChange}
          disabled={loading}
        ></textarea>
        {error && <div className="invalid-feedback">{error}</div>}
      </div>
      
      <div className="d-flex justify-content-end gap-2">
        {(isEditing || parentId) && onCancel && (
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
        )}
        
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || !content.trim()}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              {isEditing ? 'Updating...' : 'Posting...'}
            </>
          ) : (
            <>{isEditing ? 'Update Comment' : parentId ? 'Post Reply' : 'Post Comment'}</>
          )}
        </button>
      </div>
    </form>
  );
};

export default CommentForm;