import React from 'react';
import { Link } from 'react-router-dom';

const QuickActions = () => {
  return (
    <div className="card shadow-sm h-100">
      <div className="card-header bg-white">
        <h5 className="mb-0">Quick Actions</h5>
      </div>
      <div className="card-body">
        <div className="d-grid gap-3">
          <Link to="/learning-plans/create" className="btn btn-primary">
            <i className="bi bi-plus-circle me-2"></i> Create New Plan
          </Link>
          <Link to="/learning-plans" className="btn btn-outline-primary">
            <i className="bi bi-journals me-2"></i> Browse All Plans
          </Link>
          <button className="btn btn-outline-secondary">
            <i className="bi bi-graph-up me-2"></i> View Progress Report
          </button>
        </div>
        
        <div className="card mt-4 bg-light">
          <div className="card-body">
            <h6 className="card-title">Learning Tip</h6>
            <p className="card-text small">Breaking down your learning goals into smaller, manageable topics can increase your retention and make progress tracking easier.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;