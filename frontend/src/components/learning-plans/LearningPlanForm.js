import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LearningPlanService } from '../../services/learningPlan.service';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';
import axios from 'axios';

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
  
  // Media states
  const [mediaFiles, setMediaFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [existingMedia, setExistingMedia] = useState([]);
  
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [mediaError, setMediaError] = useState(null);

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
          
          // If there are existing media files, load them
          if (data.mediaUrls && data.mediaUrls.length > 0) {
            setExistingMedia(data.mediaUrls);
          }
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

  // Handle media file selection
  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Check if adding these files would exceed the limit
    const totalFiles = files.length + mediaFiles.length + existingMedia.length;
    if (totalFiles > 3) {
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
        
        // Create preview URLs for the selected files
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

  const checkPlanExists = async (id) => {
    try {
      await LearningPlanService.getById(id);
      return true;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError(`This learning plan no longer exists. It may have been deleted.`);
        return false;
      }
      return true; // Assume it exists if we get any other error
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      
      // Create FormData for multipart/form-data
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('topics', JSON.stringify(formData.topics));
      formDataToSend.append('resources', JSON.stringify(formData.resources));
      formDataToSend.append('timeline', formData.timeline);
      
      // Add media files
      if (mediaFiles.length > 0) {
        mediaFiles.forEach(file => {
          formDataToSend.append('media', file);
        });
      }
      
      // Use the with-media endpoint
      const response = await axios.post('/api/learning-plans/with-media', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Handle successful response
      console.log('Created plan with media:', response.data);
      
      // Navigate to the learning plans list
      navigate('/learning-plans');
    } catch (error) {
      console.error('Error creating learning plan:', error);
      setError('Failed to create learning plan. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

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
        <div className="d-flex flex-wrap">
          {/* Show existing media */}
          {existingMedia.map((url, index) => (
            <div key={`existing-${index}`} className="position-relative me-2 mb-2">
              {url.includes('.mp4') || url.includes('.webm') ? (
                <video 
                  src={url} 
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }} 
                  className="rounded"
                ></video>
              ) : (
                <img 
                  src={url} 
                  alt={`Attachment ${index + 1}`} 
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }} 
                  className="rounded"
                />
              )}
              <button
                type="button"
                className="btn btn-sm btn-danger position-absolute top-0 end-0"
                onClick={() => removeExistingMedia(index)}
              >
                <i className="bi bi-x"></i>
              </button>
            </div>
          ))}
          
          {/* Show new media previews */}
          {previewUrls.map((url, index) => (
            <div key={`new-${index}`} className="position-relative me-2 mb-2">
              {url.includes('video') ? (
                <video 
                  src={url} 
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }} 
                  className="rounded"
                ></video>
              ) : (
                <img 
                  src={url} 
                  alt={`New attachment ${index + 1}`} 
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }} 
                  className="rounded"
                />
              )}
              <button
                type="button"
                className="btn btn-sm btn-danger position-absolute top-0 end-0"
                onClick={() => removeMedia(index)}
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