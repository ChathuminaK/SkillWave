import React from 'react';
import { Link } from 'react-router-dom';

const LearningPlanCard = ({ learningPlan, onDelete }) => {
  // Helper to render a simple media preview
  const renderMediaPreview = () => {
    if (learningPlan.mediaUrls && learningPlan.mediaUrls.length > 0) {
      const firstMedia = learningPlan.mediaUrls[0];
      
      // Check if it's an image or video
      if (firstMedia.endsWith('.mp4') || firstMedia.endsWith('.webm')) {
        // For video, show a thumbnail with a play icon overlay
        return (
          <div className="media-preview position-relative mb-3">
            <div className="ratio ratio-16x9">
              <video className="rounded" preload="metadata">
                <source src={firstMedia} type={firstMedia.endsWith('.mp4') ? 'video/mp4' : 'video/webm'} />
              </video>
            </div>
            <div className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center">
              <i className="bi bi-play-circle-fill text-white" style={{ fontSize: '3rem', opacity: '0.8' }}></i>
            </div>
            {learningPlan.mediaUrls.length > 1 && (
              <span className="position-absolute bottom-0 end-0 badge bg-dark m-2">
                +{learningPlan.mediaUrls.length - 1} more
              </span>
            )}
          </div>
        );
      } else {
        // For image, show the image
        return (
          <div className="media-preview position-relative mb-3">
            <img 
              src={firstMedia} 
              className="img-fluid rounded w-100" 
              alt="Plan preview" 
              style={{ maxHeight: '150px', objectFit: 'cover' }}
            />
            {learningPlan.mediaUrls.length > 1 && (
              <span className="position-absolute bottom-0 end-0 badge bg-dark m-2">
                +{learningPlan.mediaUrls.length - 1} more
              </span>
            )}
          </div>
        );
      }
    }
    
    return null;
  };

  return (
    <div className="card shadow-sm dashboard-card h-100">
      <div className="card-body">
        <h5 className="card-title">{learningPlan.title}</h5>
        
        {/* Show media preview if available */}
        {renderMediaPreview()}
        
        <p className="card-text text-muted">{learningPlan.description}</p>
        
        <div className="d-flex justify-content-between align-items-center mb-3">
          <small className="text-muted">Timeline: {learningPlan.timeline}</small>
          <span className="badge bg-light text-dark">
            {learningPlan.topics.length} topics
          </span>
        </div>
        
        <div className="mb-3">
          {learningPlan.topics.slice(0, 3).map((topic, index) => (
            <span key={index} className="badge topic-badge me-1 mb-1">
              {topic}
            </span>
          ))}
          {learningPlan.topics.length > 3 && (
            <span className="badge bg-secondary me-1 mb-1">
              +{learningPlan.topics.length - 3}
            </span>
          )}
        </div>
      </div>
      <div className="card-footer bg-white border-top-0">
        <div className="d-flex justify-content-between">
          <Link 
            to={`/learning-plans/${learningPlan.id}`}
            className="btn btn-sm btn-outline-primary"
          >
            View Details
          </Link>
          <div>
            <Link 
              to={`/learning-plans/edit/${learningPlan.id}`}
              className="btn btn-sm btn-outline-secondary me-1"
            >
              Edit
            </Link>
            <button 
              className="btn btn-sm btn-outline-danger" 
              onClick={() => onDelete(learningPlan.id)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningPlanCard;