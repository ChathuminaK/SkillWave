import React, { useState, useEffect, useContext } from 'react';
import { ProgressService } from '../../services/progress.service';
import { AuthContext } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';
import { Link } from 'react-router-dom';

const ProgressSummary = () => {
  const { currentUser } = useContext(AuthContext);
  // const userId = currentUser?.id || localStorage.getItem('userId') || 'user123';
  
  const [summary, setSummary] = useState(null);
  const [completedItems, setCompletedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  
  useEffect(() => {
    fetchProgressSummary();
  }, [userId]);
  
  useEffect(() => {
    fetchCompletedProgress();
  }, [userId, page]);
  
  const fetchProgressSummary = async () => {
    try {
      setLoading(true);
      const data = await ProgressService.getProgressSummary(userId);
      setSummary(data);
    } catch (err) {
      console.error('Error fetching progress summary:', err);
      setError('Failed to load progress summary');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchCompletedProgress = async () => {
    try {
      setLoading(true);
      const response = await ProgressService.getCompletedProgress(userId, page, 5);
      if (response.content) {
        setCompletedItems(prevItems => 
          page === 0 ? response.content : [...prevItems, ...response.content]
        );
        setHasMore(!response.last);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error fetching completed progress:', err);
      setError('Failed to load completed items');
    } finally {
      setLoading(false);
    }
  };
  
  const handleLoadMore = () => {
    if (hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  };
  
  if (loading && !summary) {
    return <LoadingSpinner message="Loading progress summary..." />;
  }
  
  if (error && !summary) {
    return <ErrorAlert message={error} />;
  }
  
  return (
    <div className="progress-summary">
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="card h-100 shadow-sm">
            <div className="card-body text-center">
              <h1 className="display-4 text-primary mb-2">{summary?.totalProgressCount || 0}</h1>
              <p className="card-text text-muted">Items In Progress</p>
              <div className="progress">
                <div 
                  className="progress-bar bg-primary" 
                  role="progressbar" 
                  style={{width: `${summary?.averageProgressPercentage || 0}%`}}
                  aria-valuenow={summary?.averageProgressPercentage || 0} 
                  aria-valuemin="0" 
                  aria-valuemax="100"
                >
                  {summary?.averageProgressPercentage || 0}%
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-4 mb-3">
          <div className="card h-100 shadow-sm">
            <div className="card-body text-center">
              <h1 className="display-4 text-success mb-2">{summary?.completedCount || 0}</h1>
              <p className="card-text text-muted">Completed Items</p>
              <div className="d-flex justify-content-around">
                <div>
                  <span className="badge bg-light text-primary fs-6 mb-1">
                    {summary?.planCompletedCount || 0}
                  </span>
                  <p className="small text-muted">Learning Plans</p>
                </div>
                <div>
                  <span className="badge bg-light text-primary fs-6 mb-1">
                    {summary?.postCompletedCount || 0}
                  </span>
                  <p className="small text-muted">Posts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-4 mb-3">
          <div className="card h-100 shadow-sm">
            <div className="card-body text-center">
              <h1 className="display-4 text-warning mb-2">{summary?.totalTimeSpent ? Math.round(summary.totalTimeSpent / 60) : 0}</h1>
              <p className="card-text text-muted">Minutes Spent Learning</p>
              <div className="d-flex justify-content-center">
                <Link to="/progress-report" className="btn btn-outline-primary">
                  <i className="bi bi-bar-chart me-2"></i>
                  View Full Report
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recently Completed Items */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-white">
          <h5 className="mb-0">
            <i className="bi bi-check2-circle me-2"></i>
            Recently Completed
          </h5>
        </div>
        <div className="card-body">
          {completedItems.length === 0 ? (
            <div className="text-center py-4 text-muted">
              <i className="bi bi-emoji-smile fs-1 mb-3"></i>
              <p>No completed items yet. Keep learning!</p>
            </div>
          ) : (
            <div className="list-group">
              {completedItems.map(item => (
                <div key={item.id} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                  <div>
                    <div className="d-flex align-items-center">
                      <span className={`badge ${item.contentType === 'LEARNING_PLAN' ? 'bg-info' : 'bg-primary'} me-2`}>
                        {item.contentType === 'LEARNING_PLAN' ? 'PLAN' : 'POST'}
                      </span>
                      <h6 className="mb-0">{item.contentTitle || 'Untitled'}</h6>
                    </div>
                    <small className="text-muted">
                      Completed on {new Date(item.completedDate).toLocaleDateString()}
                    </small>
                  </div>
                  <Link 
                    to={item.contentType === 'LEARNING_PLAN' ? `/learning-plans/${item.contentId}` : `/posts/${item.contentId}`} 
                    className="btn btn-sm btn-outline-secondary"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          )}
          
          {hasMore && (
            <div className="text-center mt-3">
              <button 
                className="btn btn-outline-primary" 
                onClick={handleLoadMore}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Loading...
                  </>
                ) : (
                  <>Load More</>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressSummary;
