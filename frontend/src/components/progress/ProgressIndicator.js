import React, { useState, useEffect } from 'react';
import { ProgressService } from '../../services/progress.service';
import { useProgress } from '../../contexts/ProgressContext';

const ProgressIndicator = ({ contentId, contentType }) => {
  const { userId } = useProgress();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        const data = await ProgressService.getProgress(userId, contentId, contentType);
        setProgress(data);
      } catch (err) {
        console.error('Failed to load progress indicator', err);
        // Just silently fail as this is a non-critical component
      } finally {
        setLoading(false);
      }
    };

    if (contentId && contentType) {
      fetchProgress();
    }
  }, [userId, contentId, contentType]);

  if (loading || !progress || progress.progressPercentage === 0) {
    return null; // Don't show anything if there's no progress yet
  }

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
        <span className="text-muted">
          {new Date(progress.lastAccessed).toLocaleDateString()}
        </span>
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
    </div>
  );
};

export default ProgressIndicator;