import React from 'react';
import { Link, useParams } from 'react-router-dom';
import LearningPlanForm from '../components/learning-plans/LearningPlanForm';
import PageHeader from '../components/common/PageHeader';

const LearningPlanFormPage = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  
  return (
    <>
      <div className="d-flex align-items-center mb-3">
        <Link 
          to="/learning-plans"
          className="btn btn-sm btn-outline-secondary me-3"
        >
          <i className="bi bi-arrow-left"></i> Back
        </Link>
        <h2 className="mb-0">{isEditMode ? 'Edit Learning Plan' : 'Create Learning Plan'}</h2>
      </div>
      <div className="section-divider"></div>
      <LearningPlanForm />
    </>
  );
};

export default LearningPlanFormPage;