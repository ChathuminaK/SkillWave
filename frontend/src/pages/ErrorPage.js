import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ErrorPage = ({ 
  code = 404, 
  title = 'Page Not Found', 
  message = 'The page you are looking for doesn\'t exist or has been moved.'
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6 text-center">
          <div className="mb-4">
            <span className="display-1 fw-bold text-danger">{code}</span>
          </div>
          
          <h1 className="mb-4">{title}</h1>
          <p className="lead mb-5">{message}</p>
          
          <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
            <button 
              className="btn btn-primary px-4 gap-3" 
              onClick={() => navigate(-1)}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Go Back
            </button>
            
            <Link to="/" className="btn btn-outline-secondary px-4">
              <i className="bi bi-house me-2"></i>
              Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;