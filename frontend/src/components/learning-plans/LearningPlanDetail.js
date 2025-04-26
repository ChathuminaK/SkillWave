import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { LearningPlanService } from '../../services/learningPlan.service';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';

const LearningPlanDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [learningPlan, setLearningPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLearningPlan = async () => {
      try {
        setLoading(true);
        const data = await LearningPlanService.getById(id);
        setLearningPlan(data);
      } catch (err) {
        setError('Failed to load the learning plan. It might have been deleted or does not exist.');
      } finally {
        setLoading(false);
      }
    };

    fetchLearningPlan();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this learning plan?')) {
      try {
        await LearningPlanService.delete(id);
        navigate('/learning-plans');
      } catch (err) {
        setError('Failed to delete the learning plan.');
      }
    }
  };

  // Helper to render media content
  const renderMediaContent = () => {
    if (!learningPlan.mediaUrls || learningPlan.mediaUrls.length === 0) {
      return null;
    }

    if (learningPlan.mediaUrls.length === 1) {
      // Single media item
      const url = learningPlan.mediaUrls[0];
      return (
        <div className="mb-4">
          {url.endsWith('.mp4') || url.endsWith('.webm') ? (
            <div className="ratio ratio-16x9">
              <video className="rounded" controls>
                <source src={url} type={url.endsWith('.mp4') ? 'video/mp4' : 'video/webm'} />
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            <img 
              src={url} 
              className="img-fluid rounded mb-3" 
              alt="Learning plan attachment" 
            />
          )}
        </div>
      );
    } else {
      // Multiple media items - create a carousel
      return (
        <div id={`planCarousel-${id}`} className="carousel slide mb-4" data-bs-ride="carousel">
          <div className="carousel-indicators">
            {learningPlan.mediaUrls.map((_, index) => (
              <button 
                key={index}
                type="button" 
                data-bs-target={`#planCarousel-${id}`} 
                data-bs-slide-to={index} 
                className={index === 0 ? "active" : ""}
                aria-current={index === 0 ? "true" : "false"}
                aria-label={`Slide ${index + 1}`}
              ></button>
            ))}
          </div>
          <div className="carousel-inner rounded">
            {learningPlan.mediaUrls.map((url, index) => (
              <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                {url.endsWith('.mp4') || url.endsWith('.webm') ? (
                  <div className="ratio ratio-16x9">
                    <video className="d-block w-100" controls>
                      <source src={url} type={url.endsWith('.mp4') ? 'video/mp4' : 'video/webm'} />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ) : (
                  <img 
                    src={url} 
                    className="d-block w-100" 
                    alt={`Learning plan attachment ${index + 1}`} 
                  />
                )}
              </div>
            ))}
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target={`#planCarousel-${id}`} data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target={`#planCarousel-${id}`} data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      );
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading learning plan..." />;
  }

  if (error || !learningPlan) {
    return (
      <div className="my-5">
        <ErrorAlert message={error || 'Learning plan not found'} />
        <Link to="/learning-plans" className="btn btn-primary mt-3">
          Back to Learning Plans
        </Link>
      </div>
    );
  }

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between mb-4">
          <div>
            <h3 className="card-title mb-3">{learningPlan.title}</h3>
            <p className="lead mb-3">{learningPlan.description}</p>
            <span className="badge bg-light text-dark">
              Timeline: {learningPlan.timeline}
            </span>
          </div>
          <div>
            <Link 
              to={`/learning-plans/edit/${id}`}
              className="btn btn-outline-primary me-2"
            >
              <i className="bi bi-pencil"></i> Edit
            </Link>
            <button 
              className="btn btn-outline-danger" 
              onClick={handleDelete}
            >
              <i className="bi bi-trash"></i> Delete
            </button>
          </div>
        </div>
        
        {/* Render media content if available */}
        {renderMediaContent()}
        
        <div className="row mt-4">
          <div className="col-md-6 mb-4 mb-md-0">
            <div className="card bg-light">
              <div className="card-header bg-light">
                <h5 className="mb-0">
                  <i className="bi bi-list-check me-2"></i>
                  Topics to Learn
                </h5>
              </div>
              <ul className="list-group list-group-flush">
                {learningPlan.topics.map((topic, index) => (
                  <li key={index} className="list-group-item bg-light d-flex align-items-center">
                    <span className="badge bg-primary me-2">{index + 1}</span>
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="card bg-light">
              <div className="card-header bg-light">
                <h5 className="mb-0">
                  <i className="bi bi-journal-bookmark me-2"></i>
                  Resources
                </h5>
              </div>
              <ul className="list-group list-group-flush">
                {learningPlan.resources.map((resource, index) => (
                  <li key={index} className="list-group-item bg-light">
                    <i className="bi bi-link-45deg me-2"></i>
                    {resource}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="card-footer bg-white">
        <Link to="/learning-plans" className="btn btn-secondary">
          <i className="bi bi-arrow-left me-1"></i> Back to All Plans
        </Link>
      </div>
    </div>
  );
};

export default LearningPlanDetail;