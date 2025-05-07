import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

/**
 * ProtectedRoute component that restricts access to authenticated users only
 * If not authenticated, redirects to login page with return path in state
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  // If not authenticated, redirect to login page with return path
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the protected content
  return children;
};

export default ProtectedRoute;