import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LearningPlanService } from '../../services/learningPlan.service';
import './LearningPlansList.css';

const LearningPlansList = () => {
  const [learningPlans, setLearningPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load learning plans on component mount
  useEffect(() => {
    fetchLearningPlans();
  }, []);

  // Function to fetch learning plans
  const fetchLearningPlans = async () => {
    setLoading(true);
    try {
      const data = await LearningPlanService.getAll();
      setLearningPlans(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching learning plans:', error);
      setError('Failed to load learning plans. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Refresh function to reload learning plans
  const refreshLearningPlans = async () => {
    setLoading(true);
    try {
      const data = await LearningPlanService.getAll();
      setLearningPlans(data);
      setError(null);
    } catch (error) {
      console.error('Error refreshing learning plans:', error);
      setError('Failed to refresh learning plans. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Delete learning plan
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this learning plan?')) {
      try {
        await LearningPlanService.delete(id);
        // Remove from state after successful deletion
        setLearningPlans(learningPlans.filter(plan => plan.id !== id));
      } catch (error) {
        console.error('Error deleting learning plan:', error);
        setError('Failed to delete learning plan. Please try again.');
      }
    }
  };

  return (
    <div className="learning-plans-container">
      <div className="header-actions">
        <h2>Learning Plans</h2>
        <div>
          <button 
            onClick={refreshLearningPlans}
            className="btn btn-outline-primary me-2"
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
          <Link to="/learning-plans/new" className="btn btn-primary">
            Create New Plan
          </Link>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          {learningPlans.length === 0 ? (
            <div className="no-plans-message">
              <p>No learning plans found. Get started by creating your first learning plan!</p>
            </div>
          ) : (
            <div className="learning-plans-grid">
              {learningPlans.map(plan => (
                <div className="learning-plan-card" key={plan.id}>
                  <h3>{plan.title}</h3>
                  <p className="description">{plan.description}</p>
                  
                  <div className="topics">
                    <h4>Topics:</h4>
                    <ul>
                      {plan.topics && plan.topics.map((topic, index) => (
                        <li key={index}>{topic}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="card-actions">
                    <Link to={`/learning-plans/${plan.id}`} className="btn btn-outline-primary">
                      View
                    </Link>
                    <Link to={`/learning-plans/${plan.id}/edit`} className="btn btn-outline-secondary">
                      Edit
                    </Link>
                    <button 
                      onClick={() => handleDelete(plan.id)} 
                      className="btn btn-outline-danger"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LearningPlansList;