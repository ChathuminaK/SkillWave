import React from 'react';
import { useProgress } from '../../contexts/ProgressContext';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';

const ProgressStats = () => {
  const { progressSummary, isLoading, error, fetchProgressSummary } = useProgress();

  if (isLoading) {
    return <LoadingSpinner message="Loading progress data..." />;
  }

  if (error) {
    return (
      <ErrorAlert 
        message={error} 
        onRetry={fetchProgressSummary}
      />
    );
  }

  if (!progressSummary) {
    return (
      <div className="alert alert-info">
        No progress data available. Start learning to see your progress!
      </div>
    );
  }

  return (
    <div className="card shadow-sm h-100">
      <div className="card-header bg-white">
        <h5 className="mb-0">Learning Progress</h5>
      </div>
      <div className="card-body">
        <div className="mb-4">
          <h6 className="text-muted mb-2">Overall Completion</h6>
          <div className="progress mb-2" style={{ height: '25px' }}>
            <div 
              className="progress-bar" 
              role="progressbar" 
              style={{ width: `${progressSummary.overallCompletionPercentage}%` }} 
              aria-valuenow={progressSummary.overallCompletionPercentage} 
              aria-valuemin="0" 
              aria-valuemax="100"
            >
              {progressSummary.overallCompletionPercentage}%
            </div>
          </div>
          <div className="d-flex justify-content-between text-muted small">
            <span>{progressSummary.completedItems} of {progressSummary.totalItems} completed</span>
            <span>{progressSummary.inProgressItems} in progress</span>
          </div>
        </div>

        <div className="row g-3">
          <div className="col-6">
            <div className="card bg-light">
              <div className="card-body p-3">
                <h6 className="card-title mb-2">Learning Plans</h6>
                <div className="progress mb-2">
                  <div 
                    className="progress-bar bg-success" 
                    role="progressbar" 
                    style={{ width: `${progressSummary.learningPlanProgress}%` }} 
                    aria-valuenow={progressSummary.learningPlanProgress} 
                    aria-valuemin="0" 
                    aria-valuemax="100"
                  >
                    {progressSummary.learningPlanProgress}%
                  </div>
                </div>
                <p className="card-text small text-muted mb-0">Average completion</p>
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="card bg-light">
              <div className="card-body p-3">
                <h6 className="card-title mb-2">Ed. Posts</h6>
                <div className="progress mb-2">
                  <div 
                    className="progress-bar bg-info" 
                    role="progressbar" 
                    style={{ width: `${progressSummary.educationalPostProgress}%` }} 
                    aria-valuenow={progressSummary.educationalPostProgress} 
                    aria-valuemin="0" 
                    aria-valuemax="100"
                  >
                    {progressSummary.educationalPostProgress}%
                  </div>
                </div>
                <p className="card-text small text-muted mb-0">Average completion</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="card-footer bg-white text-center">
        <button 
          className="btn btn-sm btn-outline-primary"
          onClick={fetchProgressSummary}
        >
          <i className="bi bi-arrow-repeat me-1"></i>
          Refresh Statistics
        </button>
      </div>
    </div>
  );
};

export default ProgressStats;