import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorAlert from '../components/common/ErrorAlert';
import LearningPlanCard from '../components/learning-plans/LearningPlanCard';
import { useLearningPlans } from '../hooks/useLearningPlans';

const LearningPlanListPage = () => {
  const { learningPlans, loading, error, fetchLearningPlans, deleteLearningPlan } = useLearningPlans();

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this learning plan?')) {
      try {
        await deleteLearningPlan(id);
      } catch (err) {
        // Error is already handled in the hook
      }
    }
  };

  const CreateButton = () => (
    <Link to="/learning-plans/create" className="btn btn-primary">
      <i className="bi bi-plus-circle me-1"></i> Create Plan
    </Link>
  );

  if (loading) {
    return <LoadingSpinner message="Loading learning plans..." />;
  }

  return (
    <>
      <PageHeader 
        title="Learning Plans" 
        subtitle="Manage your learning journey" 
        actionButton={<CreateButton />}
      />
      
      {error && (
        <ErrorAlert 
          message={error} 
          onRetry={fetchLearningPlans} 
        />
      )}
      
      {learningPlans.length === 0 ? (
        <div className="text-center py-5 bg-light rounded">
          <i className="bi bi-journal-plus" style={{ fontSize: '4rem', color: '#adb5bd' }}></i>
          <h3 className="mt-4">No Learning Plans Yet</h3>
          <p className="text-muted">Create your first learning plan to start your journey</p>
          <Link to="/learning-plans/create" className="btn btn-primary mt-3">
            Create Your First Plan
          </Link>
        </div>
      ) : (
        <div className="row">
          {learningPlans.map(plan => (
            <div key={plan.id} className="col-md-6 col-lg-4 mb-4">
              <LearningPlanCard 
                learningPlan={plan} 
                onDelete={handleDelete} 
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default LearningPlanListPage;