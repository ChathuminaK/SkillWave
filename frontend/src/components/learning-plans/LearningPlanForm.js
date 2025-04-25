import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LearningPlanService } from '../../services/learningPlan.service';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';

const LearningPlanForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    topics: [''],
    resources: [''],
    timeline: ''
  });
  
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLearningPlan = async () => {
      if (isEditMode) {
        try {
          setLoading(true);
          const data = await LearningPlanService.getById(id);
          setFormData({
            title: data.title,
            description: data.description,
            topics: [...data.topics],
            resources: [...data.resources],
            timeline: data.timeline
          });
        } catch (err) {
          setError('Failed to load the learning plan for editing.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchLearningPlan();
  }, [id, isEditMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleArrayChange = (index, field, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({
      ...formData,
      [field]: newArray
    });
  };

  const addArrayItem = (field) => {
    setFormData({
      ...formData,
      [field]: [...formData[field], '']
    });
  };

  const removeArrayItem = (field, index) => {
    if (formData[field].length > 1) {
      const newArray = formData[field].filter((_, i) => i !== index);
      setFormData({
        ...formData,
        [field]: newArray
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setError(null);
      
      // Clean up empty array items
      const cleanedData = {
        ...formData,
        topics: formData.topics.filter(topic => topic.trim() !== ''),
        resources: formData.resources.filter(resource => resource.trim() !== '')
      };
      
      if (isEditMode) {
        await LearningPlanService.update(id, cleanedData);
      } else {
        await LearningPlanService.create(cleanedData);
      }
      
      navigate('/learning-plans');
    } catch (err) {
      setError(`Failed to ${isEditMode ? 'update' : 'create'} learning plan.`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading learning plan data..." />;
  }

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h3 className="card-title mb-4">{isEditMode ? 'Edit Learning Plan' : 'Create New Learning Plan'}</h3>
        
        {error && <ErrorAlert message={error} />}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">Plan Title</label>
            <input
              type="text"
              className="form-control"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Web Development Mastery"
              required
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your learning plan and goals"
              required
            ></textarea>
          </div>
          
          <div className="mb-3">
            <label className="form-label d-flex justify-content-between">
              <span>Topics to Learn</span>
              <button
                type="button"
                className="btn btn-sm btn-outline-primary"
                onClick={() => addArrayItem('topics')}
              >
                <i className="bi bi-plus-circle me-1"></i> Add Topic
              </button>
            </label>
            
            {formData.topics.map((topic, index) => (
              <div key={index} className="input-group mb-2">
                <span className="input-group-text">{index + 1}</span>
                <input
                  type="text"
                  className="form-control"
                  value={topic}
                  onChange={(e) => handleArrayChange(index, 'topics', e.target.value)}
                  placeholder="e.g., JavaScript Basics"
                  required={index === 0}
                />
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() => removeArrayItem('topics', index)}
                  disabled={formData.topics.length === 1}
                >
                  <i className="bi bi-x"></i>
                </button>
              </div>
            ))}
          </div>
          
          <div className="mb-3">
            <label className="form-label d-flex justify-content-between">
              <span>Learning Resources</span>
              <button
                type="button"
                className="btn btn-sm btn-outline-primary"
                onClick={() => addArrayItem('resources')}
              >
                <i className="bi bi-plus-circle me-1"></i> Add Resource
              </button>
            </label>
            
            {formData.resources.map((resource, index) => (
              <div key={index} className="input-group mb-2">
                <span className="input-group-text">
                  <i className="bi bi-link-45deg"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  value={resource}
                  onChange={(e) => handleArrayChange(index, 'resources', e.target.value)}
                  placeholder="e.g., MDN Web Docs, Udemy Course"
                  required={index === 0}
                />
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() => removeArrayItem('resources', index)}
                  disabled={formData.resources.length === 1}
                >
                  <i className="bi bi-x"></i>
                </button>
              </div>
            ))}
          </div>
          
          <div className="mb-4">
            <label htmlFor="timeline" className="form-label">Timeline</label>
            <input
              type="text"
              className="form-control"
              id="timeline"
              name="timeline"
              value={formData.timeline}
              onChange={handleInputChange}
              placeholder="e.g., 3 months, 1 year"
              required
            />
          </div>
          
          <div className="d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => navigate('/learning-plans')}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEditMode ? 'Update Learning Plan' : 'Create Learning Plan'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LearningPlanForm;