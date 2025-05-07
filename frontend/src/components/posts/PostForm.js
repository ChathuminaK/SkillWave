import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PostService } from '../../services/post.service';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';

const PostForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    difficultyLevel: 'BEGINNER',
    estimatedTime: '',
    tags: []
  });
  
  const [tagInput, setTagInput] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [existingMedia, setExistingMedia] = useState([]);
  const [removedMedia, setRemovedMedia] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0); // Used to track upload progress
  
  // For this demo, we'll use a hardcoded user ID
  // In a real app, this would come from authentication
  const userId = 'user123';
  const userName = 'John Doe';
  
  // Available categories and difficulty levels
  const categories = [
    'Programming', 'Data Science', 'Design', 'Mathematics',
    'Science', 'Languages', 'Business', 'Arts', 'Health'
  ];
  
  const difficultyLevels = [
    { value: 'BEGINNER', label: 'Beginner' },
    { value: 'INTERMEDIATE', label: 'Intermediate' },
    { value: 'ADVANCED', label: 'Advanced' }
  ];

  // Fetch post data if in edit mode
  useEffect(() => {
    const fetchPost = async () => {
      if (isEditMode) {
        try {
          setLoading(true);
          const post = await PostService.getPostById(id);
          
          setFormData({
            title: post.title || '',
            content: post.content || '',
            category: post.category || '',
            difficultyLevel: post.difficultyLevel || 'BEGINNER',
            estimatedTime: post.estimatedTime || '',
            tags: post.tags || []
          });
          
          if (post.mediaUrls && post.mediaUrls.length > 0) {
            setExistingMedia(post.mediaUrls);
          }
          
          setError(null);
        } catch (err) {
          setError('Failed to load post for editing. It may have been deleted.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchPost();
  }, [id, isEditMode]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle content changes directly
  const handleContentChange = (e) => {
    setFormData({
      ...formData,
      content: e.target.value
    });
  };
  
  // Handle tag input
  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };
  
  // Add tag when Enter is pressed
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
      
      if (!formData.tags.includes(newTag)) {
        setFormData({
          ...formData,
          tags: [...formData.tags, newTag]
        });
      }
      
      setTagInput('');
    }
  };
  
  // Remove a tag
  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };
  
  // Handle file input change
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file count
    if (mediaFiles.length + existingMedia.length + files.length > 3) {
      setError('You can only upload up to 3 files total');
      return;
    }
    
    setMediaFiles([...mediaFiles, ...files]);
    
    // Generate preview URLs for the new files
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrls(prev => [...prev, {
          file: file.name,
          url: reader.result,
          type: file.type
        }]);
      };
      reader.readAsDataURL(file);
    });
  };
  
  // Remove a file from the selected files
  const removeFile = (fileName) => {
    setMediaFiles(mediaFiles.filter(file => file.name !== fileName));
    setPreviewUrls(previewUrls.filter(preview => preview.file !== fileName));
  };
  
  // Remove existing media
  const removeExistingMedia = (url) => {
    setExistingMedia(existingMedia.filter(mediaUrl => mediaUrl !== url));
    setRemovedMedia([...removedMedia, url]);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content) {
      setError('Title and content are required.');
      return;
    }

    // Simulate upload progress updates
    const updateProgress = (progress) => {
      setUploadProgress(progress);
    };
    
    try {
      setLoading(true);
      setError(null);
      
      // Create FormData object for multipart/form-data
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('difficultyLevel', formData.difficultyLevel);
      formDataToSend.append('estimatedTime', formData.estimatedTime);
      formDataToSend.append('userId', userId);
      formDataToSend.append('userName', userName);
      
      // Add tags
      if (formData.tags.length > 0) {
        formDataToSend.append('tags', JSON.stringify(formData.tags));
      }
      
      // Add existing media for edit mode
      if (isEditMode && existingMedia.length > 0) {
        formDataToSend.append('existingMedia', JSON.stringify(existingMedia));
      }
      
      // Add media files
      if (mediaFiles.length > 0) {
        mediaFiles.forEach(file => {
          formDataToSend.append('media', file);
        });
      }
      
      // Fake progress updates during upload
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += 10;
        if (progress <= 90) updateProgress(progress);
      }, 300);

      try {
        let result;
        if (isEditMode) {
          result = await PostService.updatePostWithMedia(id, formDataToSend);
        } else {
          result = await PostService.createPostWithMedia(formDataToSend);
        }
        
        // Final progress update
        updateProgress(100);
        clearInterval(progressInterval);
        
        // Redirect to the post detail page
        navigate(`/posts/${result.id}`);
      } catch (error) {
        clearInterval(progressInterval);
        throw error;
      }
    } catch (err) {
      setError(`Failed to ${isEditMode ? 'update' : 'create'} post. Please try again.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading && isEditMode && !formData.title) {
    return <LoadingSpinner message="Loading post data..." />;
  }

  return (
    <div className="post-form-container">
      <div className="card shadow-sm">
        <div className="card-header bg-white">
          <h3 className="mb-0">{isEditMode ? 'Edit Post' : 'Create New Educational Post'}</h3>
        </div>
        <div className="card-body">
          {error && (
            <ErrorAlert message={error} />
          )}
          
          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Title *</label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="Enter a descriptive title"
              />
            </div>
            
            {/* Category */}
            <div className="mb-3">
              <label htmlFor="category" className="form-label">Category</label>
              <select
                className="form-select"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div className="row">
              {/* Difficulty Level */}
              <div className="col-md-6 mb-3">
                <label htmlFor="difficultyLevel" className="form-label">Difficulty Level</label>
                <select
                  className="form-select"
                  id="difficultyLevel"
                  name="difficultyLevel"
                  value={formData.difficultyLevel}
                  onChange={handleInputChange}
                >
                  {difficultyLevels.map(level => (
                    <option key={level.value} value={level.value}>{level.label}</option>
                  ))}
                </select>
              </div>
              
              {/* Estimated Time */}
              <div className="col-md-6 mb-3">
                <label htmlFor="estimatedTime" className="form-label">Estimated Time to Complete</label>
                <input
                  type="text"
                  className="form-control"
                  id="estimatedTime"
                  name="estimatedTime"
                  value={formData.estimatedTime}
                  onChange={handleInputChange}
                  placeholder="e.g. 30 minutes, 2 hours"
                />
              </div>
            </div>
            
            {/* Tags */}
            <div className="mb-3">
              <label htmlFor="tags" className="form-label">Tags</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  id="tags"
                  value={tagInput}
                  onChange={handleTagInputChange}
                  onKeyDown={handleTagKeyDown}
                  placeholder="Add tags and press Enter"
                />
                <button 
                  className="btn btn-outline-secondary" 
                  type="button"
                  onClick={() => {
                    if (tagInput.trim()) {
                      const newTag = tagInput.trim();
                      if (!formData.tags.includes(newTag)) {
                        setFormData({
                          ...formData,
                          tags: [...formData.tags, newTag]
                        });
                      }
                      setTagInput('');
                    }
                  }}
                >
                  Add
                </button>
              </div>
              <div className="form-text">Press Enter to add a tag</div>
              
              {formData.tags.length > 0 && (
                <div className="mt-2">
                  {formData.tags.map(tag => (
                    <span key={tag} className="badge bg-primary me-1 mb-1 p-2">
                      {tag}
                      <button 
                        type="button" 
                        className="btn-close btn-close-white ms-2" 
                        aria-label="Remove tag" 
                        onClick={() => removeTag(tag)}
                        style={{ fontSize: '0.5rem' }}
                      />
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            {/* Content - Simple Textarea */}
            <div className="mb-3">
              <label htmlFor="content" className="form-label">Content *</label>
              <textarea
                className="form-control"
                id="content"
                name="content"
                rows="10"
                value={formData.content}
                onChange={handleContentChange}
                required
                placeholder="Write your educational content here. You can use markdown formatting."
              ></textarea>
            </div>
            
            {/* Media Upload */}
            <div className="mb-3">
              <label htmlFor="media" className="form-label">Media Files</label>
              <input
                type="file"
                className="form-control"
                id="media"
                multiple
                onChange={handleFileChange}
                accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
              />
              <div className="form-text">
                You can upload up to 3 images, videos, or documents to enhance your post.
              </div>
            </div>
            
            {/* Upload Progress */}
            {loading && uploadProgress > 0 && (
              <div className="mb-3">
                <label className="form-label">Upload Progress</label>
                <div className="progress" style={{ height: '20px' }}>
                  <div 
                    className="progress-bar bg-primary" 
                    role="progressbar" 
                    style={{ width: `${uploadProgress}%` }} 
                    aria-valuenow={uploadProgress} 
                    aria-valuemin="0" 
                    aria-valuemax="100"
                  >
                    {uploadProgress}%
                  </div>
                </div>
              </div>
            )}
            
            {/* Preview of new files */}
            {previewUrls.length > 0 && (
              <div className="mb-3">
                <label className="form-label">New Media Files</label>
                <div className="row g-2">
                  {previewUrls.map((preview, index) => (
                    <div key={index} className="col-md-3 col-sm-4 col-6">
                      <div className="card h-100">
                        <div className="card-img-top position-relative" style={{ height: '120px' }}>
                          {preview.type.startsWith('image/') ? (
                            <img 
                              src={preview.url} 
                              alt={preview.file} 
                              className="img-fluid h-100 w-100" 
                              style={{ objectFit: 'cover' }}
                            />
                          ) : preview.type.startsWith('video/') ? (
                            <div className="d-flex align-items-center justify-content-center h-100 bg-light">
                              <i className="bi bi-film fs-1"></i>
                            </div>
                          ) : (
                            <div className="d-flex align-items-center justify-content-center h-100 bg-light">
                              <i className="bi bi-file-earmark fs-1"></i>
                            </div>
                          )}
                          <button
                            type="button"
                            className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                            onClick={() => removeFile(preview.file)}
                          >
                            <i className="bi bi-x"></i>
                          </button>
                        </div>
                        <div className="card-body p-2">
                          <p className="card-text small text-truncate">{preview.file}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Existing Media Preview (for edit mode) */}
            {existingMedia.length > 0 && (
              <div className="mb-3">
                <label className="form-label">Existing Media Files</label>
                <div className="row g-2">
                  {existingMedia.map((url, index) => (
                    <div key={index} className="col-md-3 col-sm-4 col-6">
                      <div className="card h-100">
                        <div className="card-img-top position-relative" style={{ height: '120px' }}>
                          {url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png') || url.endsWith('.gif') ? (
                            <img 
                              src={url} 
                              alt={`Media ${index + 1}`} 
                              className="img-fluid h-100 w-100" 
                              style={{ objectFit: 'cover' }}
                            />
                          ) : url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg') ? (
                            <div className="d-flex align-items-center justify-content-center h-100 bg-light">
                              <i className="bi bi-film fs-1"></i>
                            </div>
                          ) : (
                            <div className="d-flex align-items-center justify-content-center h-100 bg-light">
                              <i className="bi bi-file-earmark fs-1"></i>
                            </div>
                          )}
                          <button
                            type="button"
                            className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                            onClick={() => removeExistingMedia(url)}
                          >
                            <i className="bi bi-x"></i>
                          </button>
                        </div>
                        <div className="card-body p-2">
                          <p className="card-text small text-truncate">{url.split('/').pop()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Submit Buttons */}
            <div className="d-flex justify-content-between mt-4">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => navigate('/posts')}
                disabled={loading}
              >
                Cancel
              </button>
              
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {isEditMode ? 'Updating...' : 'Publishing...'}
                  </>
                ) : (
                  <>{isEditMode ? 'Update Post' : 'Publish Post'}</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostForm;