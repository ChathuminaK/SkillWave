import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ProgressService } from '../../services/progress.service';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';

const LearningProgressReport = () => {
  const userId = localStorage.getItem('userId') || 'user123'; // Get from auth context in production
  
  const [progress, setProgress] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('inProgress');

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [inProgressData, completedData, summaryData] = await Promise.all([
          ProgressService.getUserProgress(userId),
          ProgressService.getCompletedProgress(userId),
          ProgressService.getProgressSummary(userId)
        ]);
        
        setProgress(inProgressData.progress || []);
        setCompleted(completedData.progress || []);
        setSummary(summaryData);
        setError(null);
      } catch (err) {
        console.error('Error fetching progress data:', err);
        setError('Failed to load your progress data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, [userId]);

  const renderProgressItem = (item) => {
    return (
      <div className="card mb-3 shadow-sm" key={item.id}>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="card-title mb-0">{item.contentTitle || 'Learning Plan'}</h5>
            <span className="badge bg-primary">{item.contentType.replace('_', ' ')}</span>
          </div>
          
          <div className="progress mb-3" style={{ height: '10px' }}>
            <div 
              className="progress-bar" 
              role="progressbar" 
              style={{ width: `${item.progressPercentage}%` }}
              aria-valuenow={item.progressPercentage} 
              aria-valuemin="0" 
              aria-valuemax="100"
            ></div>
          </div>
          
          <div className="d-flex justify-content-between align-items-center">
            <small className="text-muted">
              Progress: {item.progressPercentage}%
            </small>
            <small className="text-muted">
              Last updated: {new Date(item.lastAccessed).toLocaleDateString()}
            </small>
          </div>
          
          <div className="mt-3">
            <Link 
              to={`/learning-plans/${item.contentId}`} 
              className="btn btn-sm btn-outline-primary"
            >
              <i className="bi bi-eye me-1"></i> View Plan
            </Link>
          </div>
        </div>
      </div>
    );
  };

  const renderCompletedItem = (item) => {
    return (
      <div className="card mb-3 shadow-sm" key={item.id}>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="card-title mb-0">{item.contentTitle || 'Learning Plan'}</h5>
            <span className="badge bg-success">Completed</span>
          </div>
          
          <div className="progress mb-3" style={{ height: '10px' }}>
            <div 
              className="progress-bar bg-success" 
              role="progressbar" 
              style={{ width: '100%' }}
              aria-valuenow="100" 
              aria-valuemin="0" 
              aria-valuemax="100"
            ></div>
          </div>
          
          <div className="d-flex justify-content-between align-items-center">
            <small className="text-success">
              <i className="bi bi-check-circle me-1"></i> Completed!
            </small>
            <small className="text-muted">
              Completed on: {new Date(item.lastAccessed).toLocaleDateString()}
            </small>
          </div>
          
          <div className="mt-3">
            <Link 
              to={`/learning-plans/${item.contentId}`} 
              className="btn btn-sm btn-outline-success"
            >
              <i className="bi bi-eye me-1"></i> View Plan
            </Link>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <LoadingSpinner message="Loading your progress data..." />;
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  return (
    <div className="progress-report-container">
      {/* Summary Stats */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3 mb-md-0">
          <div className="card bg-light h-100">
            <div className="card-body text-center">
              <h6 className="text-muted">In Progress</h6>
              <h2 className="display-4 fw-bold">{progress.length}</h2>
              <p className="text-muted">Learning plans you're working on</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3 mb-md-0">
          <div className="card bg-light h-100">
            <div className="card-body text-center">
              <h6 className="text-muted">Completed</h6>
              <h2 className="display-4 fw-bold">{completed.length}</h2>
              <p className="text-muted">Learning plans you've finished</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-light h-100">
            <div className="card-body text-center">
              <h6 className="text-muted">Avg. Completion</h6>
              <h2 className="display-4 fw-bold">
                {summary ? `${Math.round(summary.averageProgress)}%` : '0%'}
              </h2>
              <p className="text-muted">Average progress on plans</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Progress Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'inProgress' ? 'active' : ''}`}
            onClick={() => setActiveTab('inProgress')}
          >
            <i className="bi bi-hourglass-split me-2"></i>
            In Progress ({progress.length})
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            <i className="bi bi-check-circle me-2"></i>
            Completed ({completed.length})
          </button>
        </li>
      </ul>
      
      {/* Progress Content */}
      <div className="tab-content">
        <div className={`tab-pane ${activeTab === 'inProgress' ? 'active' : ''}`}>
          {progress.length === 0 ? (
            <div className="text-center py-5 bg-light rounded">
              <div className="display-6 text-muted mb-3">
                <i className="bi bi-journal-text"></i>
              </div>
              <h3>No Learning Plans In Progress</h3>
              <p className="text-muted">
                Start learning by selecting a learning plan and tracking your progress.
              </p>
              <Link to="/learning-plans" className="btn btn-primary mt-3">
                Browse Learning Plans
              </Link>
            </div>
          ) : (
            progress.map(item => renderProgressItem(item))
          )}
        </div>
        
        <div className={`tab-pane ${activeTab === 'completed' ? 'active' : ''}`}>
          {completed.length === 0 ? (
            <div className="text-center py-5 bg-light rounded">
              <div className="display-6 text-muted mb-3">
                <i className="bi bi-trophy"></i>
              </div>
              <h3>No Completed Learning Plans Yet</h3>
              <p className="text-muted">
                Complete your first learning plan to see it here!
              </p>
              <Link to="/learning-plans" className="btn btn-primary mt-3">
                Browse Learning Plans
              </Link>
            </div>
          ) : (
            completed.map(item => renderCompletedItem(item))
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningProgressReport;