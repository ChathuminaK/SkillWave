import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ProgressService } from '../../services/progress.service';
import { AuthContext } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';

const LearningProgressReport = () => {
  const { currentUser } = useContext(AuthContext);
  // const userId = currentUser?.id || localStorage.getItem('userId') || 'user123';
  
  const [progress, setProgress] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('inProgress');
  const [inProgressPage, setInProgressPage] = useState(0);
  const [completedPage, setCompletedPage] = useState(0);
  const [hasMoreInProgress, setHasMoreInProgress] = useState(true);
  const [hasMoreCompleted, setHasMoreCompleted] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all data in parallel
        const [inProgressData, completedData, summaryData] = await Promise.all([
          ProgressService.getUserProgress(userId, 0, 10),
          ProgressService.getCompletedProgress(userId, 0, 10),
          ProgressService.getProgressSummary(userId)
        ]);
        
        setProgress(inProgressData.content || []);
        setHasMoreInProgress(!inProgressData.last);
        
        setCompleted(completedData.content || []);
        setHasMoreCompleted(!completedData.last);
        
        setSummary(summaryData);
      } catch (err) {
        console.error('Error fetching progress data:', err);
        setError('Failed to load your progress data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProgressData();
    } else {
      setError('User authentication issue. Please log in again.');
      setLoading(false);
    }
  }, [userId]);

  const handleLoadMoreInProgress = async () => {
    if (!hasMoreInProgress || loadingMore) return;
    
    try {
      setLoadingMore(true);
      const nextPage = inProgressPage + 1;
      const response = await ProgressService.getUserProgress(userId, nextPage, 10);
      
      if (response && response.content) {
        setProgress(prev => [...prev, ...response.content]);
        setHasMoreInProgress(!response.last);
        setInProgressPage(nextPage);
      }
    } catch (err) {
      console.error('Error loading more in-progress items:', err);
      // Silently fail, user can try again
    } finally {
      setLoadingMore(false);
    }
  };
  
  const handleLoadMoreCompleted = async () => {
    if (!hasMoreCompleted || loadingMore) return;
    
    try {
      setLoadingMore(true);
      const nextPage = completedPage + 1;
      const response = await ProgressService.getCompletedProgress(userId, nextPage, 10);
      
      if (response && response.content) {
        setCompleted(prev => [...prev, ...response.content]);
        setHasMoreCompleted(!response.last);
        setCompletedPage(nextPage);
      }
    } catch (err) {
      console.error('Error loading more completed items:', err);
      // Silently fail, user can try again
    } finally {
      setLoadingMore(false);
    }
  };

  const handleMarkComplete = async (progressId, contentId, contentType) => {
    try {
      await ProgressService.markAsCompleted(userId, contentId, contentType);
      
      // Remove from in-progress and add to completed
      const item = progress.find(p => p.id === progressId);
      if (item) {
        // Update the item to be completed
        const completedItem = {
          ...item,
          completed: true,
          progressPercentage: 100,
          completedDate: new Date().toISOString()
        };
        
        // Remove from progress list
        setProgress(prev => prev.filter(p => p.id !== progressId));
        
        // Add to completed list
        setCompleted(prev => [completedItem, ...prev]);
        
        // Update summary
        if (summary) {
          setSummary({
            ...summary,
            completedCount: (summary.completedCount || 0) + 1,
            totalProgressCount: (summary.totalProgressCount || 0) - 1,
            averageProgressPercentage: recalculateAverageProgress(
              progress.filter(p => p.id !== progressId),
              [...completed, completedItem]
            )
          });
        }
      }
    } catch (err) {
      console.error('Error marking item as complete:', err);
      alert('Failed to mark item as complete. Please try again.');
    }
  };
  
  const handleResetProgress = async (progressId, contentId, contentType) => {
    if (!window.confirm('Are you sure you want to reset progress? This will move the item back to In Progress.')) {
      return;
    }
    
    try {
      await ProgressService.resetProgress(userId, contentId, contentType);
      
      // Remove from completed and add to in-progress
      const item = completed.find(p => p.id === progressId);
      if (item) {
        // Update the item to be in progress
        const resetItem = {
          ...item,
          completed: false,
          progressPercentage: 0,
          lastAccessed: new Date().toISOString()
        };
        
        // Remove from completed list
        setCompleted(prev => prev.filter(p => p.id !== progressId));
        
        // Add to progress list
        setProgress(prev => [resetItem, ...prev]);
        
        // Update summary
        if (summary) {
          setSummary({
            ...summary,
            completedCount: (summary.completedCount || 0) - 1,
            totalProgressCount: (summary.totalProgressCount || 0) + 1,
            averageProgressPercentage: recalculateAverageProgress(
              [...progress, resetItem],
              completed.filter(p => p.id !== progressId)
            )
          });
        }
      }
    } catch (err) {
      console.error('Error resetting progress:', err);
      alert('Failed to reset progress. Please try again.');
    }
  };

  // Helper function to recalculate average progress
  const recalculateAverageProgress = (inProgressItems, completedItems) => {
    const inProgressSum = inProgressItems.reduce((sum, item) => sum + item.progressPercentage, 0);
    const totalItems = inProgressItems.length + completedItems.length;
    const completedSum = completedItems.length * 100; // All completed items are 100%
    
    return totalItems > 0 ? (inProgressSum + completedSum) / totalItems : 0;
  };

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
          
          <div className="mt-3 d-flex gap-2">
            <Link 
              to={item.contentType === 'LEARNING_PLAN' ? 
                  `/learning-plans/${item.contentId}` : 
                  `/posts/${item.contentId}`} 
              className="btn btn-sm btn-outline-primary"
            >
              <i className="bi bi-eye me-1"></i> View Content
            </Link>
            <button
              className="btn btn-sm btn-success"
              onClick={() => handleMarkComplete(item.id, item.contentId, item.contentType)}
            >
              <i className="bi bi-check-circle me-1"></i> Mark Complete
            </button>
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
            <div>
              <span className="badge bg-success me-2">Completed</span>
              <span className="badge bg-secondary">{item.contentType.replace('_', ' ')}</span>
            </div>
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
            <small className="text-success fw-bold">
              <i className="bi bi-check-circle me-1"></i>
              Completed
            </small>
            <small className="text-muted">
              Completed on: {new Date(item.completedDate || item.lastAccessed).toLocaleDateString()}
            </small>
          </div>
          
          <div className="mt-3 d-flex gap-2">
            <Link 
              to={item.contentType === 'LEARNING_PLAN' ? 
                  `/learning-plans/${item.contentId}` : 
                  `/posts/${item.contentId}`} 
              className="btn btn-sm btn-outline-primary"
            >
              <i className="bi bi-eye me-1"></i> View Content
            </Link>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => handleResetProgress(item.id, item.contentId, item.contentType)}
            >
              <i className="bi bi-arrow-counterclockwise me-1"></i> Reset Progress
            </button>
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
              <h2 className="display-4 fw-bold text-primary">{summary?.totalProgressCount || 0}</h2>
              <p className="text-muted">Items you're currently learning</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3 mb-md-0">
          <div className="card bg-light h-100">
            <div className="card-body text-center">
              <h6 className="text-muted">Completed</h6>
              <h2 className="display-4 fw-bold text-success">{summary?.completedCount || 0}</h2>
              <p className="text-muted">Items you've mastered</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-light h-100">
            <div className="card-body text-center">
              <h6 className="text-muted">Avg. Completion</h6>
              <h2 className="display-4 fw-bold text-warning">
                {summary ? `${Math.round(summary.averageProgressPercentage || 0)}%` : '0%'}
              </h2>
              <p className="text-muted">Average progress across all items</p>
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
        {activeTab === 'inProgress' && (
          <div className="tab-pane active">
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
              <>
                {progress.map(item => renderProgressItem(item))}
                
                {hasMoreInProgress && (
                  <div className="text-center mt-3 mb-4">
                    <button 
                      className="btn btn-outline-primary" 
                      onClick={handleLoadMoreInProgress}
                      disabled={loadingMore}
                    >
                      {loadingMore ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Loading...
                        </>
                      ) : (
                        "Load More"
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
        
        {activeTab === 'completed' && (
          <div className="tab-pane active">
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
              <>
                {completed.map(item => renderCompletedItem(item))}
                
                {hasMoreCompleted && (
                  <div className="text-center mt-3 mb-4">
                    <button 
                      className="btn btn-outline-primary" 
                      onClick={handleLoadMoreCompleted}
                      disabled={loadingMore}
                    >
                      {loadingMore ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Loading...
                        </>
                      ) : (
                        "Load More"
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningProgressReport;