import React, { useState, useEffect } from 'react';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import axios from 'axios';

const CommentList = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalComments, setTotalComments] = useState(0);
  const commentsPerPage = 5;

  useEffect(() => {
    fetchComments();
  }, [postId, page]);

  const fetchComments = async () => {
    if (!postId) return;
    
    try {
      setLoading(true);
      const response = await axios.get(`/api/posts/${postId}/comments`, {
        params: { page, size: commentsPerPage }
      });
      
      const { content, totalElements, last } = response.data;
      
      setComments(prev => page === 0 ? content : [...prev, ...content]);
      setTotalComments(totalElements);
      setHasMore(!last);
      setError(null);
    } catch (err) {
      setError('Failed to load comments. Please try again.');
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const handleAddComment = (newComment) => {
    setComments(prev => [newComment, ...prev]);
    setTotalComments(prev => prev + 1);
  };

  const handleDeleteComment = (commentId) => {
    setComments(prev => prev.filter(comment => comment.id !== commentId));
    setTotalComments(prev => prev - 1);
  };

  const handleUpdateComment = (updatedComment) => {
    setComments(prev => 
      prev.map(comment => 
        comment.id === updatedComment.id ? updatedComment : comment
      )
    );
  };

  return (
    <div className="comments-section my-4" id="comments">
      <h4 className="mb-4">
        <i className="bi bi-chat-quote me-2"></i>
        Discussion ({totalComments})
      </h4>
      
      <CommentForm postId={postId} onCommentAdded={handleAddComment} />
      
      {error && (
        <div className="alert alert-danger my-3" role="alert">
          {error}
          <button 
            className="btn btn-sm btn-outline-danger ms-2"
            onClick={() => fetchComments()}
          >
            Retry
          </button>
        </div>
      )}
      
      {comments.length === 0 && !loading ? (
        <div className="text-center py-5 text-muted">
          <i className="bi bi-chat-dots fs-2 mb-3 d-block"></i>
          <p>Be the first to start the discussion!</p>
        </div>
      ) : (
        <div className="comment-list mt-4">
          {comments.map(comment => (
            <CommentItem 
              key={comment.id} 
              comment={comment}
              onDelete={handleDeleteComment}
              onUpdate={handleUpdateComment}
            />
          ))}
          
          {hasMore && (
            <div className="text-center mt-4">
              <button 
                className="btn btn-outline-primary"
                onClick={handleLoadMore}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Loading...
                  </>
                ) : (
                  <>Show More Comments</>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentList;