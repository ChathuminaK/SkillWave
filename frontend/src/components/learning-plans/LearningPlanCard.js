import React from 'react';
import { Link } from 'react-router-dom';

const LearningPlanCard = ({ learningPlan, onDelete }) => {
  return (
    <div className="card shadow-sm dashboard-card h-100">
      <div className="card-body">
        <h5 className="card-title">{learningPlan.title}</h5>
        <p className="card-text text-muted">{learningPlan.description}</p>
        
        <div className="d-flex justify-content-between align-items-center mb-3">
          <small className="text-muted">Timeline: {learningPlan.timeline}</small>
          <span className="badge bg-light text-dark">
            {learningPlan.topics.length} topics
          </span>
        </div>
        
        <div className="mb-3">
          {learningPlan.topics.slice(0, 3).map((topic, index) => (
            <span key={index} className="badge topic-badge me-1 mb-1">
              {topic}
            </span>
          ))}
          {learningPlan.topics.length > 3 && (
            <span className="badge bg-secondary me-1 mb-1">
              +{learningPlan.topics.length - 3}
            </span>
          )}
        </div>
      </div>
      <div className="card-footer bg-white border-top-0">
        <div className="d-flex justify-content-between">
          <Link 
            to={`/learning-plans/${learningPlan.id}`}
            className="btn btn-sm btn-outline-primary"
          >
            View Details
          </Link>
          <div>
            <Link 
              to={`/learning-plans/edit/${learningPlan.id}`}
              className="btn btn-sm btn-outline-secondary me-1"
            >
              Edit
            </Link>
            <button 
              className="btn btn-sm btn-outline-danger" 
              onClick={() => onDelete(learningPlan.id)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningPlanCard;