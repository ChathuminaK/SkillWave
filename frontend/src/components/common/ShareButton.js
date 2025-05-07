import React, { useState } from 'react';
import PropTypes from 'prop-types';

const ShareButton = ({ url, title, size = 'md' }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleShare = async () => {
    // If Web Share API is available, use it
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: url
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Toggle dropdown for manual sharing options
      setShowDropdown(!showDropdown);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url)
      .then(() => {
        alert('Link copied to clipboard!');
        setShowDropdown(false);
      })
      .catch(err => {
        console.error('Failed to copy link:', err);
      });
  };

  // Button size classes
  const sizeClasses = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg'
  };

  return (
    <div className="dropdown">
      <button 
        className={`btn btn-outline-secondary ${sizeClasses[size]}`}
        onClick={handleShare}
        aria-label="Share post"
      >
        <i className="bi bi-share me-1"></i>
        Share
      </button>
      
      {showDropdown && (
        <div className="dropdown-menu show">
          <a 
            className="dropdown-item" 
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="bi bi-facebook me-2"></i>
            Facebook
          </a>
          <a 
            className="dropdown-item" 
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="bi bi-twitter me-2"></i>
            Twitter
          </a>
          <a 
            className="dropdown-item" 
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="bi bi-linkedin me-2"></i>
            LinkedIn
          </a>
          <div className="dropdown-divider"></div>
          <button className="dropdown-item" onClick={copyToClipboard}>
            <i className="bi bi-clipboard me-2"></i>
            Copy Link
          </button>
        </div>
      )}
    </div>
  );
};

ShareButton.propTypes = {
  url: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg'])
};

export default ShareButton;