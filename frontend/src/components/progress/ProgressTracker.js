import React, { useState, useEffect } from 'react';
import { ProgressService } from '../../services/progress.service';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';

const ProgressTracker = ({ contentId, contentType = "LEARNING_PLAN" }) => {
  // Always default to LEARNING_PLAN for content type
  const userId = localStorage.getItem('userId') || 'user123'; // Get from auth context in production
  
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateOption, setShowCreateOption] = useState(false);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        const data = await ProgressService.getProgressForContent(userId, contentId, contentType);
        if (data && data.id) {
          setProgress(data);
          setShowCreateOption(false);
        } else {
          setProgress(null);
          setShowCreateOption(true);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching progress:', err);
        setProgress(null);
        setShowCreateOption(true);
        setError('Failed to load progress data');
      } finally {
        setLoading(false);
      }
    };

    if (contentId) {
      fetchProgress();
    }
  }, [userId, contentId, contentType]);

  const handleProgressChange = async (percentage) => {
    try {
      setLoading(true);
      const updatedProgress = await ProgressService.updateProgressPercentage(
        userId, contentId, contentType, percentage
      );
      setProgress(updatedProgress);
      setError(null);
    } catch (err) {
      console.error('Error updating progress:', err);
      setError('Failed to update progress');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async () => {
    try {
      setLoading(true);
      const updatedProgress = await ProgressService.markAsCompleted(
        userId, contentId, contentType
      );
      setProgress(updatedProgress);
      setError(null);
    } catch (err) {
      console.error('Error marking as complete:', err);
      setError('Failed to mark as complete');
    } finally {
      setLoading(false);
    }
  };

  const handleResetProgress = async () => {
    if (window.confirm('Are you sure you want to reset your progress?')) {
      try {
        setLoading(true);
        const updatedProgress = await ProgressService.resetProgress(
          userId, contentId, contentType
        );
        setProgress(updatedProgress);
        setError(null);
      } catch (err) {
        console.error('Error resetting progress:', err);
        setError('Failed to reset progress');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCreateProgress = async () => {
    try {
      setLoading(true);
      const newProgress = await ProgressService.createProgress({
        userId,
        contentId,
        contentType,
        progressPercentage: 0,
        completed: false
      });
      setProgress(newProgress);
      setShowCreateOption(false);
      setError(null);
    } catch (err) {
      console.error('Error creating progress tracking:', err);
      setError('Failed to create progress tracking');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading progress..." />;
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  // If no progress exists yet, show option to start tracking
  if (showCreateOption) {
    return (
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-white">
          <h5 className="mb-0">Track Your Progress</h5>
        </div>
        <div className="card-body text-center py-4">
          <div className="display-6 text-muted mb-3">
            <i className="bi bi-graph-up-arrow"></i>
          </div>
          <h5 className="mb-3">Start tracking your progress on this learning plan</h5>
          <p className="text-muted mb-4">
            Keep track of your learning journey and mark your achievements as you go.
          </p>
          <button
            className="btn btn-primary"
            onClick={handleCreateProgress}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Creating...
              </>
            ) : (
              <>Start Tracking</>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Your Learning Progress</h5>
        {progress?.completed && (
          <span className="badge bg-success">Completed</span>
        )}
      </div>
      <div className="card-body">
        <div className="mb-3">
          <label htmlFor="progressRange" className="form-label d-flex justify-content-between">
            <span>Completion: {progress?.progressPercentage || 0}%</span>
            <span className="text-muted">
              Last updated: {progress?.lastAccessed ? new Date(progress.lastAccessed).toLocaleDateString() : 'Not started yet'}
            </span>
          </label>
          <input
            type="range"
            className="form-range"
            id="progressRange"
            value={progress?.progressPercentage || 0}
            onChange={(e) => handleProgressChange(parseInt(e.target.value))}
            disabled={progress?.completed || loading}
            min="0"
            max="100"
            step="5"
          />
          <div className="progress mb-3" style={{ height: '20px' }}>
            <div
              className={`progress-bar ${progress?.completed ? 'bg-success' : 'bg-primary'}`}
              role="progressbar"
              style={{ width: `${progress?.progressPercentage || 0}%` }}
              aria-valuenow={progress?.progressPercentage || 0}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
        </div>

        <div className="d-flex gap-2">
          {!progress?.completed && (
            <button
              className="btn btn-success"
              onClick={handleMarkComplete}
              disabled={loading}
            >
              <i className="bi bi-check-circle me-2"></i>
              Mark as Completed
            </button>
          )}
          <button
            className="btn btn-outline-secondary"
            onClick={handleResetProgress}
            disabled={loading}
          >
            <i className="bi bi-arrow-counterclockwise me-2"></i>
            Reset Progress
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;