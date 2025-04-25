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