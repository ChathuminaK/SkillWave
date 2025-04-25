import React from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../common/LoadingSpinner';

const RecentLearningPlans = ({ learningPlans, loading }) => {
  if (loading) {
    return <LoadingSpinner message="Loading recent plans..." />;
  }

  return (
    <div className="card shadow-sm h-100">
      <div className="card-header bg-white">
        <h5 className="mb-0">Recent Learning Plans</h5>
      </div>
      <div className="card-body">
        {learningPlans.length === 0 ? (
          <div className="text-center py-4">
            <i className="bi bi-journal-text" style={{ fontSize: '3rem', color: '#dee2e6' }}></i>
            <p className="mt-3 mb-0">No learning plans yet.</p>
            <Link to="/learning-plans/create" className="btn btn-primary mt-3">
              Create Your First Plan
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Plan Title</th>
                  <th>Topics</th>
                  <th>Timeline</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {learningPlans.slice(0, 5).map(plan => (
                  <tr key={plan.id}>
                    <td>{plan.title}</td>
                    <td>{plan.topics.length} topics</td>
                    <td>{plan.timeline}</td>
                    <td>
                      <Link 
                        to={`/learning-plans/${plan.id}`}
                        className="btn btn-sm btn-outline-primary"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {learningPlans.length > 5 && (
              <div className="text-center mt-3">
                <Link to="/learning-plans" className="btn btn-outline-primary">
                  View All Plans
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentLearningPlans;