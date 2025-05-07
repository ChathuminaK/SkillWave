import React, { useState } from 'react';
import PropTypes from 'prop-types';

const MediaViewer = ({ media, className = '' }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  if (!media || media.length === 0) {
    return null;
  }

  const currentMedia = media[activeIndex];
  
  // Render the appropriate media type
  const renderMedia = () => {
    if (!currentMedia) return null;
    
    switch (currentMedia.type) {
      case 'IMAGE':
        return (
          <img 
            src={currentMedia.url} 
            alt={currentMedia.alt || 'Post image'} 
            className="img-fluid rounded"
          />
        );
        
      case 'VIDEO':
        return (
          <div className="ratio ratio-16x9">
            <video 
              src={currentMedia.url} 
              controls 
              poster={currentMedia.thumbnailUrl}
              className="rounded"
            >
              Your browser does not support video playback.
            </video>
          </div>
        );
        
      case 'DOCUMENT':
        return (
          <div className="document-preview p-3 bg-light rounded text-center">
            <i className="bi bi-file-earmark-text display-4"></i>
            <p className="mt-2 mb-0">{currentMedia.filename || 'Document'}</p>
            <a 
              href={currentMedia.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-primary btn-sm mt-2"
            >
              <i className="bi bi-download me-1"></i>
              Download Document
            </a>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className={`media-viewer ${className}`}>
      <div className="media-main mb-2">
        {renderMedia()}
      </div>
      
      {/* Thumbnails for multiple media items */}
      {media.length > 1 && (
        <div className="media-thumbnails d-flex gap-2 overflow-auto pb-2">
          {media.map((item, index) => (
            <div 
              key={index} 
              className={`media-thumbnail ${activeIndex === index ? 'active border border-primary' : ''}`}
              onClick={() => setActiveIndex(index)}
              style={{ cursor: 'pointer' }}
            >
              {item.type === 'IMAGE' ? (
                <img 
                  src={item.thumbnailUrl || item.url} 
                  alt={`Thumbnail ${index + 1}`} 
                  width="60" 
                  height="60" 
                  className="rounded"
                  style={{ objectFit: 'cover' }}
                />
              ) : item.type === 'VIDEO' ? (
                <div className="position-relative">
                  <img 
                    src={item.thumbnailUrl || '/assets/video-thumbnail.jpg'} 
                    alt={`Video thumbnail ${index + 1}`} 
                    width="60" 
                    height="60" 
                    className="rounded"
                    style={{ objectFit: 'cover' }}
                  />
                  <i className="bi bi-play-circle-fill position-absolute top-50 start-50 translate-middle text-white"></i>
                </div>
              ) : (
                <div 
                  className="rounded bg-light d-flex align-items-center justify-content-center"
                  style={{ width: '60px', height: '60px' }}
                >
                  <i className="bi bi-file-earmark-text"></i>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

MediaViewer.propTypes = {
  media: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(['IMAGE', 'VIDEO', 'DOCUMENT']).isRequired,
      url: PropTypes.string.isRequired,
      thumbnailUrl: PropTypes.string,
      alt: PropTypes.string,
      filename: PropTypes.string
    })
  ),
  className: PropTypes.string
};

export default MediaViewer;