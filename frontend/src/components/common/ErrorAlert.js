import React from 'react';

const ErrorAlert = ({ message, onRetry }) => {
  return (
    <div className="alert alert-danger" role="alert">
      <p className="mb-0">{message}</p>
      {onRetry && (
        <button 
          className="btn btn-sm btn-outline-danger ms-2 mt-2" 
          onClick={onRetry}
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorAlert;