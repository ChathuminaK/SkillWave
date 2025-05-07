import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { usePostContext } from '../../contexts/PostContext';
import LikeButton from '../common/LikeButton';
import SaveButton from '../common/SaveButton';
import ShareButton from '../common/ShareButton';
import MediaViewer from '../common/MediaViewer';
import { ProgressService } from '../../services/progress.service';

const PostCard = ({ post }) => {
  const { likePost, unlikePost, savePost, unsavePost } = usePostContext();
  
  // Start tracking progress when a user clicks on the post
  const trackProgress = async () => {
    try {
      // Assuming we have the user ID from authentication context
      const userId = 'current-user-id'; // Replace with actual user ID
      
      // Call the progress service to track this interaction
      await ProgressService.updateProgress(userId, post.id, 'EDUCATIONAL_POST', 20);
    } catch (error) {
      console.error('Failed to track progress:', error);
    }
  };

  // Format the date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Extract the first media item for the card preview
  const featuredMedia = post.media && post.media.length > 0 
    ? [post.media[0]]
    : null;

  return (
    <div className="card h-100 shadow-sm post-card">
      {/* Media preview */}
      {featuredMedia && (
        <div className="card-img-top">
          <MediaViewer media={featuredMedia} />
        </div>
      )}
      
      <div className="card-body">
        {/* Category badge */}
        {post.category && (
          <span className="badge bg-secondary mb-2">{post.category}</span>
        )}
        
        {/* Title with link to full post */}
        <h5 className="card-title">
          <Link 
            to={`/posts/${post.id}`} 
            className="text-decoration-none"
            onClick={trackProgress}
          >
            {post.title}
          </Link>
        </h5>
        
        {/* Content preview */}
        <p className="card-text text-muted">
          {post.content.length > 150 
            ? `${post.content.substring(0, 150)}...` 
            : post.content
          }
        </p>
        
        {/* Author info and date */}
        <div className="d-flex align-items-center mb-3">
          <img 
            src={post.authorAvatar || '/assets/default-avatar.png'} 
            alt={post.authorName} 
            className="rounded-circle me-2"
            width="32" 
            height="32"
          />
          <div>
            <p className="mb-0 small fw-bold">{post.authorName}</p>
            <p className="mb-0 small text-muted">{formatDate(post.createdAt)}</p>
          </div>
        </div>
        
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mb-3">
            {post.tags.map((tag, index) => (
              <span key={index} className="badge bg-light text-dark me-1 mb-1">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
      
      {/* Card footer with actions */}
      <div className="card-footer bg-white border-top-0">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <LikeButton 
              isLiked={post.liked || false}
              likeCount={post.likeCount || 0}
              onLike={() => likePost(post.id)}
              onUnlike={() => unlikePost(post.id)}
              size="sm"
            />
          </div>
          
          <div className="d-flex gap-1">
            <SaveButton 
              isSaved={post.saved || false}
              onSave={() => savePost(post.id)}
              onUnsave={() => unsavePost(post.id)}
              size="sm"
            />
            
            <ShareButton 
              url={`${window.location.origin}/posts/${post.id}`}
              title={post.title}
              size="sm"
            />
            
            <Link 
              to={`/posts/${post.id}`}
              className="btn btn-outline-primary btn-sm"
              onClick={trackProgress}
            >
              <i className="bi bi-book me-1"></i>
              Read More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    category: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    authorName: PropTypes.string.isRequired,
    authorAvatar: PropTypes.string,
    createdAt: PropTypes.string.isRequired,
    likeCount: PropTypes.number,
    liked: PropTypes.bool,
    saved: PropTypes.bool,
    media: PropTypes.array
  }).isRequired
};

export default PostCard;