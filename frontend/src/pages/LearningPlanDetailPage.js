import React from 'react';
import { Link } from 'react-router-dom';
import LearningPlanDetail from '../components/learning-plans/LearningPlanDetail';
import PageHeader from '../components/common/PageHeader';

const LearningPlanDetailPage = () => {
  return (
    <>
      <div className="d-flex align-items-center mb-3">
        <Link 
          to="/learning-plans"
          className="btn btn-sm btn-outline-secondary me-3"
        >
          <i className="bi bi-arrow-left"></i> Back to Plans
        </Link>
        <h2 className="mb-0">Learning Plan Details</h2>
      </div>
      <div className="section-divider"></div>
      <LearningPlanDetail />
    </>
  );
};

export default LearningPlanDetailPage;