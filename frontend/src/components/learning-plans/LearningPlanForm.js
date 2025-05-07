import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LearningPlanService } from '../../services/learningPlan.service';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';

const LearningPlanForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const formRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    topics: [''],
    resources: [''],
    timeline: ''
  });
  
  // Media states
  const [mediaFiles, setMediaFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [existingMedia, setExistingMedia] = useState([]);
  const [mediaError, setMediaError] = useState(null);
  
  // Component states
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);

  // Fetch existing plan data if in edit mode
  useEffect(() => {
    const fetchLearningPlan = async () => {
      if (isEditMode) {
        try {
          setLoading(true);
          const data = await LearningPlanService.getById(id);
          setFormData({
            title: data.title || '',
            description: data.description || '',
            topics: data.topics?.length > 0 ? [...data.topics] : [''],
            resources: data.resources?.length > 0 ? [...data.resources] : [''],
            timeline: data.timeline || ''
          });
          
          // If there are existing media files, load them
          if (data.mediaUrls && data.mediaUrls.length > 0) {
            setExistingMedia(data.mediaUrls);
          }
          
          setError(null);
        } catch (err) {
          setError('Failed to load the learning plan for editing. ' + err.message);
          setTimeout(() => {
            navigate('/learning-plans');
          }, 3000);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchLearningPlan();
  }, [id, isEditMode, navigate]);

  // Handle input changes for text fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle array items (topics and resources)
  const handleArrayChange = (index, field, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({
      ...formData,
      [field]: newArray
    });
  };

  // Add a new item to an array field
  const addArrayItem = (field) => {
    setFormData({
      ...formData,
      [field]: [...formData[field], '']
    });
  };

  // Remove an item from an array field
  const removeArrayItem = (field, index) => {
    const newArray = [...formData[field]];
    newArray.splice(index, 1);
    setFormData({
      ...formData,
      [field]: newArray.length === 0 ? [''] : newArray
    });
  };

  // Handle media file selection
  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Check for maximum file count (3 total including existing)
    if (existingMedia.length + mediaFiles.length + files.length > 3) {
      setMediaError('You can only upload up to 3 files in total');
      return;
    }
    
    // Validate file types
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm'];
    const invalidFile = files.find(file => !validTypes.includes(file.type));
    if (invalidFile) {
      setMediaError('Only images (JPEG, PNG, GIF) and videos (MP4, WebM) are allowed');
      return;
    }
    
    // Validate video duration (max 30 seconds)
    const validateVideoDuration = async (videoFile) => {
      return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        
        video.onloadedmetadata = function() {
          window.URL.revokeObjectURL(video.src);
          if (video.duration > 30) {
            reject(new Error('Video duration must not exceed 30 seconds'));
          } else {
            resolve(true);
          }
        };
        
        video.onerror = function() {
          reject(new Error('Could not load video metadata'));
        };
        
        video.src = URL.createObjectURL(videoFile);
      });
    };
    
    const processFiles = async () => {
      try {
        for (const file of files) {
          if (file.type.startsWith('video/')) {
            await validateVideoDuration(file);
          }
        }
        
        setMediaFiles(prev => [...prev, ...files]);
        
        // Generate preview URLs for the selected files
        const newPreviewUrls = files.map(file => URL.createObjectURL(file));
        setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
        setMediaError(null);
      } catch (err) {
        setMediaError(err.message);
      }
    };
    
    processFiles();
  };

  // Remove a new media file that hasn't been uploaded yet
  const removeMedia = (index) => {
    const newMediaFiles = [...mediaFiles];
    const newPreviewUrls = [...previewUrls];
    
    // Release object URL to prevent memory leaks
    URL.revokeObjectURL(newPreviewUrls[index]);
    
    newMediaFiles.splice(index, 1);
    newPreviewUrls.splice(index, 1);
    
    setMediaFiles(newMediaFiles);
    setPreviewUrls(newPreviewUrls);
  };

  // Remove an existing media file
  const removeExistingMedia = (index) => {
    const newExistingMedia = [...existingMedia];
    newExistingMedia.splice(index, 1);
    setExistingMedia(newExistingMedia);
  };

  // Verify the learning plan still exists before submitting an update
  const checkPlanExists = async (id) => {
    try {
      await LearningPlanService.getById(id);
      return true;
    } catch (error) {
      setError(`This learning plan no longer exists. It may have been deleted.`);
      return false;
    }
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formRef.current.checkValidity()) {
      formRef.current.reportValidity();
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      setFeedback(null);
      
      // In edit mode, verify the plan still exists
      if (isEditMode) {
        const exists = await checkPlanExists(id);
        if (!exists) {
          setSubmitting(false);
          return;
        }
      }
      
      // Prepare the data - filter out empty values
      const filteredTopics = formData.topics.filter(topic => topic.trim());
      const filteredResources = formData.resources.filter(resource => resource.trim());
      
      if (filteredTopics.length === 0) {
        setError('At least one topic is required');
        setSubmitting(false);
        return;
      }
      
      // Create FormData for multipart/form-data
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('topics', JSON.stringify(filteredTopics));
      formDataToSend.append('resources', JSON.stringify(filteredResources));
      formDataToSend.append('timeline', formData.timeline.trim());
      
      // Add existing media URLs for edit mode
      if (isEditMode && existingMedia.length > 0) {
        formDataToSend.append('existingMedia', JSON.stringify(existingMedia));
      }
      
      // Add media files
      if (mediaFiles.length > 0) {
        mediaFiles.forEach(file => {
          formDataToSend.append('media', file);
        });
      }
      
      let response;
      
      if (isEditMode) {
        // Update existing learning plan
        response = await LearningPlanService.updateWithMedia(id, formDataToSend);
        setFeedback('Learning plan updated successfully!');
      } else {
        // Create new learning plan
        response = await LearningPlanService.createWithMedia(formDataToSend);
        setFeedback('Learning plan created successfully!');
      }
      
      // Display success message briefly before redirecting
      setTimeout(() => {
        navigate(`/learning-plans/${response.id}`);
      }, 1500);
      
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
      console.error('Error submitting learning plan:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // If loading data in edit mode, show spinner
  if (loading) {
    return <LoadingSpinner message="Loading learning plan data..." />;
  }

  // Helper to render media previews (both existing and new)
  const renderMediaPreviews = () => {
    const totalMediaCount = existingMedia.length + previewUrls.length;
    
    if (totalMediaCount === 0) {
      return null;
    }
    
    return (
      <div className="mb-4">
        <label className="form-label">Attached Media ({totalMediaCount}/3)</label>
        <div className="d-flex flex-wrap gap-2">
          {/* Show existing media */}
          {existingMedia.map((url, index) => (
            <div key={`existing-${index}`} className="position-relative media-preview-item">
              {url.includes('.mp4') || url.includes('.webm') ? (
                <video 
                  src={url} 
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }} 
                  className="rounded border"
                ></video>
              ) : (
                <img 
                  src={url} 
                  alt={`Attachment ${index + 1}`} 
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }} 
                  className="rounded border"
                />
              )}
              <button
                type="button"
                className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 rounded-circle"
                onClick={() => removeExistingMedia(index)}
                title="Remove file"
              >
                <i className="bi bi-x"></i>
              </button>
            </div>
          ))}
          
          {/* Show new media previews */}
          {previewUrls.map((url, index) => (
            <div key={`new-${index}`} className="position-relative media-preview-item">
              {url.includes('video') ? (
                <video 
                  src={url} 
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }} 
                  className="rounded border"
                ></video>
              ) : (
                <img 
                  src={url} 
                  alt={`New attachment ${index + 1}`} 
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }} 
                  className="rounded border"
                />
              )}
              <button
                type="button"
                className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 rounded-circle"
                onClick={() => removeMedia(index)}
                title="Remove file"
              >
                <i className="bi bi-x"></i>
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h3 className="card-title mb-4">{isEditMode ? 'Edit Learning Plan' : 'Create New Learning Plan'}</h3>
        
        {error && <ErrorAlert message={error} />}
        
        {feedback && (
          <div className="alert alert-success">
            <i className="bi bi-check-circle-fill me-2"></i>
            {feedback}
          </div>
        )}
        
        <form onSubmit={handleSubmit} ref={formRef}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">Plan Title <span className="text-danger">*</span></label>
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
            <label htmlFor="description" className="form-label">Description <span className="text-danger">*</span></label>
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
              <span>Topics to Learn <span className="text-danger">*</span></span>
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
                  title={formData.topics.length === 1 ? "At least one topic is required" : "Remove topic"}
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
            <label htmlFor="timeline" className="form-label">Timeline <span className="text-danger">*</span></label>
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
          
          {/* Media upload section */}
          <div className="mb-4">
            <label className="form-label d-flex justify-content-between">
              <span>Media Attachments</span>
              <small className="text-muted">
                {existingMedia.length + mediaFiles.length}/3 files
              </small>
            </label>
            
            {mediaError && (
              <div className="alert alert-danger py-2 mb-3" role="alert">
                {mediaError}
              </div>
            )}
            
            {renderMediaPreviews()}
            
            <div className="input-group">
              <label className={`btn ${existingMedia.length + mediaFiles.length >= 3 ? 'btn-secondary disabled' : 'btn-outline-primary'}`}>
                <i className="bi bi-upload me-2"></i> Choose Files
                <input
                  type="file"
                  className="d-none"
                  accept="image/jpeg,image/png,image/gif,video/mp4,video/webm"
                  onChange={handleMediaChange}
                  multiple
                  disabled={existingMedia.length + mediaFiles.length >= 3 || submitting}
                />
              </label>
              <div className="form-control bg-light">
                {existingMedia.length + mediaFiles.length === 0 ? 
                  "No files selected" : 
                  `${existingMedia.length + mediaFiles.length} file(s) selected`}
              </div>
            </div>
            <small className="text-muted">
              Upload up to 3 images or videos (max 30 seconds) to illustrate your learning plan
            </small>
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