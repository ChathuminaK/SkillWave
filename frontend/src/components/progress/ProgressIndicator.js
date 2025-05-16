import React, { useState, useEffect, useContext } from 'react';
import { ProgressService } from '../../services/progress.service';
import { AuthContext } from '../../context/AuthContext';

/**
 * A compact progress indicator that shows the current progress for a specific content item
 * Used in list views and cards to show quick progress status
 */
const ProgressIndicator = ({ contentId, contentType = "LEARNING_PLAN", showDate = true, compact = false }) => {
  const { currentUser } = useContext(AuthContext);
  // const userId = currentUser?.id || localStorage.getItem('userId') || 'user123';
  
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!contentId) return;
      
      try {
        setLoading(true);
        const data = await ProgressService.getProgressForContent(userId, contentId, contentType);
        setProgress(data);
      } catch (err) {
        console.error('Failed to load progress indicator', err);
        // Silently fail as this is a non-critical component
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [userId, contentId, contentType]);

  if (loading || !progress || progress.progressPercentage === 0) {
    // Show minimal indicator for no progress
    return compact ? (
      <div className="progress-indicator-compact">
        <div className="progress" style={{ height: '4px' }}>
          <div className="progress-placeholder"></div>
        </div>
      </div>
    ) : null;
  }

  // Compact version for list items and cards
  if (compact) {
    return (
      <div className="progress-indicator-compact">
        <div className="progress" style={{ height: '4px' }}>
          <div 
            className={`progress-bar ${progress.completed ? 'bg-success' : 'bg-primary'}`} 
            role="progressbar" 
            style={{ width: `${progress.progressPercentage}%` }} 
            aria-valuenow={progress.progressPercentage} 
            aria-valuemin="0" 
            aria-valuemax="100"
          ></div>
        </div>
      </div>
    );
  }

  // Full version with text
  return (
    <div className="progress-indicator mt-2">
      <div className="d-flex justify-content-between align-items-center small">
        <span className={progress.completed ? 'text-success' : 'text-primary'}>
          {progress.completed ? (
            <><i className="bi bi-check-circle-fill me-1"></i>Completed</>
          ) : (
            <>{progress.progressPercentage}% Complete</>
          )}
        </span>
        {showDate && (
          <span className="text-muted">
            {new Date(progress.lastAccessed).toLocaleDateString()}
          </span>
        )}
      </div>
      <div className="progress" style={{ height: '6px' }}>
        <div 
          className={`progress-bar ${progress.completed ? 'bg-success' : 'bg-primary'}`} 
          role="progressbar" 
          style={{ width: `${progress.progressPercentage}%` }} 
          aria-valuenow={progress.progressPercentage} 
          aria-valuemin="0" 
          aria-valuemax="100"
        ></div>
      </div>
    </div>  );
};

export default ProgressIndicator;