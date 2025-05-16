import React from 'react';
import { Navigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import LearningProgressReport from '../components/progress/LearningProgressReport';
import { useAuth } from '../contexts/AuthContext';

const ProgressReportPage = () => {
  const { isAuthenticated, loading } = useAuth();
  // Redirect to login if not authenticated and not loading
  if (!isAuthenticated && !loading) {
    return <Navigate to="/login" replace />;
  }
  return (
    <>
      <PageHeader 
        title="Learning Progress Report" 
        subtitle="Track your progress across all learning plans"
      />
      <LearningProgressReport />
    </>
  );
};

export default ProgressReportPage;