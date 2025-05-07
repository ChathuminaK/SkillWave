import React from 'react';
import { Link } from 'react-router-dom';

const HomeCard = ({ title, description, icon, linkTo, linkText, color = 'primary', count }) => {
  return (
    <div className="col-md-6 col-lg-4 mb-4">
      <div className={`card shadow-sm border-${color} h-100 hover-lift`}>
        <div className={`card-body text-center py-4`}>
          <div className={`icon-circle bg-light-${color} text-${color} mb-3`}>
            <i className={`bi bi-${icon} fs-1`}></i>
          </div>
          
          {count !== undefined && (
            <div className="position-absolute top-0 end-0 mt-3 me-3">
              <span className={`badge bg-${color} rounded-pill fs-6`}>{count}</span>
            </div>
          )}
          
          <h3 className="card-title mb-3">{title}</h3>
          <p className="card-text text-muted mb-4">{description}</p>
          
          <Link to={linkTo} className={`btn btn-${color}`}>
            {linkText} <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomeCard;