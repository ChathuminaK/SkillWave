import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { PostService } from '../../services/post.service';
import MediaViewer from '../common/MediaViewer';
import LikeButton from '../common/LikeButton';
import SaveButton from '../common/SaveButton';
import ShareButton from '../common/ShareButton';
import CommentList from '../comments/CommentList';
import ProgressTracker from '../progress/ProgressTracker';
import ReactMarkdown from 'react-markdown';

const PostDetail = ({ postId, userId }) => {
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const data = await PostService.getPostById(postId);
        setPost(data);
        setError(null);
      } catch (err) {
        setError('Failed to load post. It might have been deleted or doesn\'t exist.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleLike = async () => {
    try {
      await PostService.likePost(postId);
      setPost(prev => ({
        ...prev,
        likeCount: prev.likeCount + 1,
        liked: true
      }));
    } catch (err) {
      console.error('Failed to like post:', err);
    }
  };

  const handleUnlike = async () => {
    try {
      await PostService.unlikePost(postId);
      setPost(prev => ({
        ...prev,
        likeCount: prev.likeCount - 1,
        liked: false
      }));
    } catch (err) {
      console.error('Failed to unlike post:', err);
    }
  };

  const handleSave = async () => {
    try {
      await PostService.savePost(postId);
      setPost(prev => ({
        ...prev,
        saved: true
      }));
    } catch (err) {
      console.error('Failed to save post:', err);
    }
  };

  const handleUnsave = async () => {
    try {
      await PostService.unsavePost(postId);
      setPost(prev => ({
        ...prev,
        saved: false
      }));
    } catch (err) {
      console.error('Failed to unsave post:', err);
    }
  };

  const handleDelete = async () => {
    try {
      await PostService.deletePost(postId);
      navigate('/posts', { replace: true });
    } catch (err) {
      console.error('Failed to delete post:', err);
      setShowDeleteConfirm(false);
    }
  };

  // Format the date
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading post...</span>
        </div>
        <p className="mt-3">Loading post content...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="alert alert-danger my-4" role="alert">
        <h4 className="alert-heading">Error Loading Post</h4>
        <p>{error || 'Post not found'}</p>
        <hr />
        <div className="d-flex gap-2">
          <Link to="/posts" className="btn btn-outline-primary">
            <i className="bi bi-arrow-left me-1"></i>
            Back to Posts
          </Link>
          <button 
            className="btn btn-outline-danger" 
            onClick={() => window.location.reload()}
          >
            <i className="bi bi-arrow-clockwise me-1"></i>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="post-detail">
      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDeleteConfirm(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this post? This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger"
                  onClick={handleDelete}
                >
                  Delete Post
                </button>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </div>
      )}

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          {/* Category and tags */}
          <div className="mb-3">
            {post.category && (
              <span className="badge bg-primary me-2">{post.category}</span>
            )}
            {post.tags && post.tags.map((tag, index) => (
              <span key={index} className="badge bg-light text-dark me-1">
                #{tag}
              </span>
            ))}
          </div>

          {/* Post title */}
          <h1 className="card-title mb-3">{post.title}</h1>

          {/* Author info and date */}
          <div className="d-flex align-items-center mb-4">
            <img 
              src={post.authorAvatar || '/assets/default-avatar.png'} 
              alt={post.authorName} 
              className="rounded-circle me-2"
              width="48" 
              height="48"
            />
            <div>
              <h5 className="mb-0">{post.authorName}</h5>
              <p className="text-muted mb-0">{formatDate(post.createdAt)}</p>
            </div>
          </div>

          {/* Media content */}
          {post.media && post.media.length > 0 && (
            <div className="mb-4">
              <MediaViewer media={post.media} />
            </div>
          )}

          {/* Post content */}
          <div className="post-content mb-4">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>

          {/* Action buttons */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex gap-2">
              <LikeButton 
                isLiked={post.liked || false}
                likeCount={post.likeCount || 0}
                onLike={handleLike}
                onUnlike={handleUnlike}
              />
              
              <SaveButton 
                isSaved={post.saved || false}
                onSave={handleSave}
                onUnsave={handleUnsave}
              />
              
              <ShareButton 
                url={window.location.href}
                title={post.title}
              />
            </div>
            
            {post.authorId === userId && (
              <div className="d-flex gap-2">
                <Link 
                  to={`/posts/edit/${postId}`}
                  className="btn btn-outline-primary"
                >
                  <i className="bi bi-pencil me-1"></i>
                  Edit
                </Link>
                <button 
                  className="btn btn-outline-danger"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <i className="bi bi-trash me-1"></i>
                  Delete
                </button>
              </div>
            )}
          </div>

          {/* Progress tracker */}
          <div className="mb-4">
            <ProgressTracker 
              contentId={parseInt(postId)} 
              contentType="EDUCATIONAL_POST" 
            />
          </div>
        </div>
      </div>

      {/* Comments section */}
      <div className="card shadow-sm">
        <div className="card-header bg-white">
          <h3 className="mb-0">
            <i className="bi bi-chat-left-text me-2"></i>
            Comments
          </h3>
        </div>
        <div className="card-body">
          <CommentList postId={postId} userId={userId} />
        </div>
      </div>
    </div>
  );
};

PostDetail.propTypes = {
  postId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired
};

export default PostDetail;