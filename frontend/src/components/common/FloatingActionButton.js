import React from 'react';
import { Link } from 'react-router-dom';

const FloatingActionButton = ({ to, icon, label, color = 'primary' }) => {
  return (
    <Link 
      to={to} 
      className={`floating-action-button bg-${color}`}
      title={label}
      aria-label={label}
    >
      <i className={`bi bi-${icon}`}></i>
    </Link>
  );
};

export default FloatingActionButton;