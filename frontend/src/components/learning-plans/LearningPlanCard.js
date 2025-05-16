import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ProgressService } from '../../services/progress.service';
import { useAuth } from '../../contexts/AuthContext';

const LearningPlanCard = ({ learningPlan, onDelete }) => {
  const { currentUser } = useAuth();
  const userId = currentUser?.id;
  const [progress, setProgress] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!userId) return;
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

  // Format time ago (LinkedIn style)
  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'Recently';
    
    const now = new Date();
    const date = new Date(timestamp);
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d`;
    
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks}w`;
    
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo`;
    
    const years = Math.floor(days / 365);
    return `${years}y`;
  };

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
              style={{ maxHeight: '200px', objectFit: 'cover' }}
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
    <div className="card shadow-sm mb-3">
      <div className="card-body">
        {/* LinkedIn-style header with profile and timestamp */}
        <div className="d-flex mb-3">
          <div className="me-2">
            {learningPlan.author?.profileImage ? (
              <img 
                src={learningPlan.author.profileImage} 
                alt={learningPlan.author.name}
                className="rounded-circle"
                width="48"
                height="48"
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <div className="bg-light rounded-circle d-flex align-items-center justify-content-center" style={{width: '48px', height: '48px'}}>
                <i className="bi bi-person text-secondary"></i>
              </div>
            )}
          </div>
          <div>
            <h6 className="mb-0 fw-bold">{learningPlan.author?.name || 'SkillWave User'}</h6>
            <p className="text-muted small mb-0">{learningPlan.author?.title || 'Learning Plan Creator'}</p>
            <p className="text-muted small mb-0">{formatTimeAgo(learningPlan.createdAt)} • <i className="bi bi-globe2"></i></p>
          </div>
        </div>
        
        {/* Plan title and description */}
        <h5 className="card-title">{learningPlan.title}</h5>
        <p className="card-text text-muted">
          {learningPlan.description.length > 100 
            ? `${learningPlan.description.substring(0, 100)}...` 
            : learningPlan.description}
        </p>
        
        {/* Media preview */}
        {renderMediaPreview()}
        
        {/* Topics as LinkedIn hashtags */}
        <div className="d-flex gap-2 flex-wrap mb-3">
          {learningPlan.topics.slice(0, 3).map((topic, index) => (
            <span key={index} className="text-primary fw-bold">
              #{topic.replace(/\s+/g, '')}
            </span>
          ))}
          {learningPlan.topics.length > 3 && (
            <span className="text-muted">
              +{learningPlan.topics.length - 3} more
            </span>
          )}
        </div>
        
        {/* Progress indicator */}
        <div className="mb-3">
          {renderProgressIndicator()}
        </div>
        
        {/* LinkedIn-style action buttons */}
        <hr className="my-3" />
        <div className="d-flex justify-content-between">
          <Link to={`/learning-plans/${learningPlan.id}`} className="btn btn-link text-muted text-decoration-none">
            <i className="bi bi-book me-1"></i> View Plan
          </Link>
          <div className="d-flex gap-2">
            <Link to={`/learning-plans/edit/${learningPlan.id}`} className="btn btn-link text-muted text-decoration-none">
              <i className="bi bi-pencil"></i> Edit
            </Link>
            <button 
              onClick={() => onDelete(learningPlan.id)} 
              className="btn btn-link text-muted text-decoration-none"
            >
              <i className="bi bi-trash"></i> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningPlanCard;