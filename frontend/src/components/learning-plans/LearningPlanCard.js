import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ProgressService } from '../../services/progress.service';

const LearningPlanCard = ({ learningPlan, onDelete }) => {
  const userId = localStorage.getItem('userId') || 'user123'; // Get from auth context in production
  const [progress, setProgress] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoadingProgress(true);
        const data = await ProgressService.getLearningPlanProgress(userId, learningPlan.id);
        setProgress(data);
      } catch (error) {
        console.log('No progress found for this plan');
      } finally {
        setLoadingProgress(false);
      }
    };

    fetchProgress();
  }, [userId, learningPlan.id]);

  const renderProgressIndicator = () => {
    if (loadingProgress) {
      return <div className="progress-placeholder"></div>;
    }

    if (!progress) {
      return (
        <div className="text-muted small">
          <i className="bi bi-hourglass me-1"></i> Not started
        </div>
      );
    }

    if (progress.completed) {
      return (
        <div className="d-flex align-items-center">
          <div className="progress flex-grow-1 me-2" style={{ height: '8px' }}>
            <div 
              className="progress-bar bg-success" 
              role="progressbar" 
              style={{ width: '100%' }}
              aria-valuenow="100" 
              aria-valuemin="0" 
              aria-valuemax="100"
            ></div>
          </div>
          <span className="badge bg-success">Completed</span>
        </div>
      );
    }

    return (
      <div className="d-flex align-items-center">
        <div className="progress flex-grow-1 me-2" style={{ height: '8px' }}>
          <div 
            className="progress-bar" 
            role="progressbar" 
            style={{ width: `${progress.progressPercentage}%` }}
            aria-valuenow={progress.progressPercentage} 
            aria-valuemin="0" 
            aria-valuemax="100"
          ></div>
        </div>
        <span className="text-muted small">{progress.progressPercentage}%</span>
      </div>
    );
  };

  const renderMediaPreview = () => {
    if (learningPlan.mediaUrls && learningPlan.mediaUrls.length > 0) {
      const firstMedia = learningPlan.mediaUrls[0];
      
      if (firstMedia.endsWith('.mp4') || firstMedia.endsWith('.webm')) {
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
    <div className="card shadow-sm h-100">
      <div className="card-body">
        <h5 className="card-title">{learningPlan.title}</h5>
        
        {renderMediaPreview()}
        
        <p className="card-text text-muted">
          {learningPlan.description.length > 100 
            ? `${learningPlan.description.substring(0, 100)}...` 
            : learningPlan.description}
        </p>
        
        <div className="mb-3">
          {renderProgressIndicator()}
        </div>
        
        <div className="d-flex gap-2 flex-wrap mb-3">
          {learningPlan.topics.slice(0, 3).map((topic, index) => (
            <span key={index} className="badge bg-light text-dark">
              {topic}
            </span>
          ))}
          {learningPlan.topics.length > 3 && (
            <span className="badge bg-light text-dark">
              +{learningPlan.topics.length - 3} more
            </span>
          )}
        </div>
      </div>
      <div className="card-footer bg-white">
        <div className="d-flex justify-content-between">
          <Link to={`/learning-plans/${learningPlan.id}`} className="btn btn-sm btn-primary">
            <i className="bi bi-book me-1"></i> View Plan
          </Link>
          <div className="btn-group">
            <Link to={`/learning-plans/edit/${learningPlan.id}`} className="btn btn-sm btn-outline-secondary">
              <i className="bi bi-pencil"></i>
            </Link>
            <button 
              onClick={() => onDelete(learningPlan.id)} 
              className="btn btn-sm btn-outline-danger"
            >
              <i className="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningPlanCard;