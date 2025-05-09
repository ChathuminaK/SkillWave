import React, { useState } from 'react';
import CommentForm from './CommentForm';
import CommentActions from './CommentActions';
import axios from 'axios';

const CommentItem = ({ comment, onDelete, onUpdate }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  // In a real app, get this from authentication context
  const currentUserId = 'user123';
  
  const isAuthor = comment.userId === currentUserId;
  const hasReplies = comment.replyCount > 0;

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleReplyClick = () => {
    setIsReplying(!isReplying);
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleDeleteClick = async () => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }
    
    try {
      await axios.delete(`/api/comments/${comment.id}`);
      onDelete(comment.id);
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment. Please try again.');
    }
  };

  const handleReplyAdded = (newReply) => {
    setReplies(prev => [newReply, ...prev]);
    comment.replyCount += 1;
    setIsReplying(false);
    // If replies weren't showing, show them now
    if (!showReplies) {
      setShowReplies(true);
    }
  };

  const toggleReplies = async () => {
    if (showReplies) {
      setShowReplies(false);
      return;
    }
    
    if (replies.length > 0) {
      setShowReplies(true);
      return;
    }
    
    try {
      setLoadingReplies(true);
      const response = await axios.get(`/api/comments/${comment.id}/replies`);
      setReplies(response.data);
      setShowReplies(true);
    } catch (error) {
      console.error('Error loading replies:', error);
      alert('Failed to load replies. Please try again.');
    } finally {
      setLoadingReplies(false);
    }
  };

  const handleLikeComment = async () => {
    try {
      const action = comment.userLiked ? 'unlike' : 'like';
      const response = await axios.post(`/api/comments/${comment.id}/${action}`, {
        userId: currentUserId
      });
      
      onUpdate({
        ...comment,
        likeCount: response.data.likeCount,
        userLiked: !comment.userLiked
      });
    } catch (error) {
      console.error('Error updating like status:', error);
    }
  };

  return (
    <div className={`comment-item mb-3 pb-3 ${!comment.parentId ? 'border-bottom' : ''}`}>
      <div className="d-flex">
        <div className="comment-avatar me-3">
          {comment.userAvatar ? (
            <img 
              src={comment.userAvatar} 
              alt={`${comment.userName}'s avatar`} 
              className="rounded-circle"
              width="40"
              height="40"
            />
          ) : (
            <div className="rounded-circle bg-light d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
              <i className="bi bi-person text-secondary"></i>
            </div>
          )}
        </div>
        
        <div className="comment-content flex-grow-1">
          <div className="comment-header d-flex justify-content-between align-items-start">
            <div>
              <h6 className="mb-0 fw-bold">{comment.userName}</h6>
              <small className="text-muted">{formatDate(comment.createdAt)}</small>
              {comment.isInstructor && (
                <span className="badge bg-primary ms-2">Instructor</span>
              )}
              {comment.isEdited && (
                <small className="text-muted ms-2">(Edited)</small>
              )}
            </div>
            
            <CommentActions 
              comment={comment}
              isAuthor={isAuthor}
              onReply={handleReplyClick}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          </div>
          
          {isEditing ? (
            <CommentForm 
              postId={comment.postId}
              commentId={comment.id}
              initialContent={comment.content}
              isEditing={true}
              onCommentAdded={onUpdate}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <>
              <div className="comment-body my-2">
                <p className="mb-1">{comment.content}</p>
              </div>
              
              <div className="comment-footer d-flex align-items-center">
                <button 
                  className={`btn btn-sm ${comment.userLiked ? 'text-primary' : 'text-muted'}`}
                  onClick={handleLikeComment}
                >
                  <i className={`bi ${comment.userLiked ? 'bi-hand-thumbs-up-fill' : 'bi-hand-thumbs-up'} me-1`}></i>
                  {comment.likeCount > 0 && comment.likeCount}
                </button>
                
                <button 
                  className="btn btn-sm text-muted ms-2"
                  onClick={handleReplyClick}
                >
                  <i className="bi bi-reply me-1"></i>
                  Reply
                </button>
                
                {hasReplies && (
                  <button 
                    className="btn btn-sm text-muted ms-2"
                    onClick={toggleReplies}
                    disabled={loadingReplies}
                  >
                    {loadingReplies ? (
                      <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                    ) : (
                      <i className={`bi ${showReplies ? 'bi-dash-square' : 'bi-plus-square'} me-1`}></i>
                    )}
                    {comment.replyCount} {comment.replyCount === 1 ? 'reply' : 'replies'}
                  </button>
                )}
              </div>
            </>
          )}
          
          {isReplying && (
            <div className="mt-3">
              <CommentForm 
                postId={comment.postId}
                parentId={comment.id}
                onCommentAdded={handleReplyAdded}
                onCancel={() => setIsReplying(false)}
                placeholder={`Reply to ${comment.userName}...`}
              />
            </div>
          )}
          
          {showReplies && replies.length > 0 && (
            <div className="replies-container mt-3 ps-3 border-start">
              {replies.map(reply => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  onDelete={onDelete}
                  onUpdate={onUpdate}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;