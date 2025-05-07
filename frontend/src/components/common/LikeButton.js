import React, { useState } from 'react';
import PropTypes from 'prop-types';

const LikeButton = ({ isLiked, likeCount, onLike, onUnlike, size = 'md' }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      if (isLiked) {
        await onUnlike();
      } else {
        await onLike();
      }
    } finally {
      setLoading(false);
    }
  };

  // Button size classes
  const sizeClasses = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg'
  };

  return (
    <button 
      className={`btn ${isLiked ? 'btn-primary' : 'btn-outline-primary'} ${sizeClasses[size]}`}
      onClick={handleClick}
      disabled={loading}
    >
      <i className={`bi ${isLiked ? 'bi-heart-fill' : 'bi-heart'} me-1`}></i>
      {likeCount > 0 && <span>{likeCount}</span>}
    </button>
  );
};

LikeButton.propTypes = {
  isLiked: PropTypes.bool.isRequired,
  likeCount: PropTypes.number.isRequired,
  onLike: PropTypes.func.isRequired,
  onUnlike: PropTypes.func.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg'])
};

export default LikeButton;