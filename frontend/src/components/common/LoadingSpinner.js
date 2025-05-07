import React from 'react';

/**
 * Reusable loading spinner component
 * Displays a centered spinner with optional message
 */
const LoadingSpinner = ({ message = 'Loading...', size = 'medium' }) => {
  let spinnerSize;
  
  // Determine spinner size based on prop
  switch (size) {
    case 'small':
      spinnerSize = 'spinner-border-sm';
      break;
    case 'large':
      spinnerSize = '';
      break;
    default:
      spinnerSize = '';
  }

  return (
    <div className="d-flex flex-column justify-content-center align-items-center py-5">
      <div className={`spinner-border text-primary ${spinnerSize}`} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      {message && <p className="mt-3 text-muted">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;