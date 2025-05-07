import React, { useState } from 'react';
import PropTypes from 'prop-types';

const SaveButton = ({ isSaved, onSave, onUnsave, size = 'md' }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      if (isSaved) {
        await onUnsave();
      } else {
        await onSave();
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
      className={`btn ${isSaved ? 'btn-warning' : 'btn-outline-warning'} ${sizeClasses[size]}`}
      onClick={handleClick}
      disabled={loading}
      aria-label={isSaved ? 'Unsave post' : 'Save post'}
      title={isSaved ? 'Remove from bookmarks' : 'Add to bookmarks'}
    >
      <i className={`bi ${isSaved ? 'bi-bookmark-fill' : 'bi-bookmark'} me-1`}></i>
      {isSaved ? 'Saved' : 'Save'}
    </button>
  );
};

SaveButton.propTypes = {
  isSaved: PropTypes.bool.isRequired,
  onSave: PropTypes.func.isRequired,
  onUnsave: PropTypes.func.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg'])
};

export default SaveButton;