import React from 'react';
import PageHeader from '../components/common/PageHeader';
import LearningProgressReport from '../components/progress/LearningProgressReport';

const ProgressReportPage = () => {
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