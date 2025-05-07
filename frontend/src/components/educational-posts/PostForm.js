import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { PostService } from '../../services/post.service';
import MDEditor from '@uiw/react-md-editor';

const PostForm = ({ postId, userId, userName }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    tags: '',
    media: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaPreview, setMediaPreview] = useState([]);

  // Categories for dropdown
  const categories = [
    "Programming",
    "Data Science",
    "Design",
    "Mathematics",
    "Science",
    "Languages",
    "Business",
    "Arts",
    "Health"
  ];

  // Fetch post data if editing
  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;
      
      try {
        setLoading(true);
        setIsEditing(true);
        const data = await PostService.getPostById(postId);
        
        setFormData({
          title: data.title,
          content: data.content,
          category: data.category || '',
          tags: data.tags ? data.tags.join(', ') : '',
          media: data.media || []
        });
        
        // Set media preview from existing media
        if (data.media && data.media.length > 0) {
          setMediaPreview(data.media.map(item => ({
            id: item.id,
            type: item.type,
            url: item.url,
            thumbnailUrl: item.thumbnailUrl,
            name: item.filename || 'Media file'
          })));
        }
        
        setError(null);
      } catch (err) {
        setError('Failed to load post for editing. It might have been deleted.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (value) => {
    setFormData(prev => ({ ...prev, content: value || '' }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setMediaFiles(prevFiles => [...prevFiles, ...files]);
    
    // Generate previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setMediaPreview(prevPreviews => [
          ...prevPreviews, 
          {
            id: `new-${Date.now()}-${file.name}`,
            type: file.type.includes('image') ? 'IMAGE' :
                  file.type.includes('video') ? 'VIDEO' : 'DOCUMENT',
            url: event.target.result,
            name: file.name
          }
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeMedia = (id) => {
    // Remove from previews
    setMediaPreview(prev => prev.filter(item => item.id !== id));
    
    // If it's an existing media item, mark for deletion in formData
    if (!id.toString().includes('new-')) {
      setFormData(prev => ({
        ...prev,
        media: prev.media.filter(item => item.id !== id)
      }));
    }
    
    // If it's a new file, remove from mediaFiles
    const fileNameFromId = id.toString().replace('new-', '').split('-').slice(1).join('-');
    setMediaFiles(prev => prev.filter(file => !id.toString().includes(file.name)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Prepare the post data
      const postData = new FormData();
      postData.append('title', formData.title);
      postData.append('content', formData.content);
      postData.append('category', formData.category);
      
      // Handle tags - convert from comma-separated string to array
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);
      
      tags.forEach((tag, index) => {
        postData.append(`tags[${index}]`, tag);
      });
      
      // Add author info
      postData.append('authorId', userId);
      postData.append('authorName', userName);
      
      // Add existing media if editing
      if (isEditing && formData.media) {
        formData.media.forEach((media, index) => {
          postData.append(`existingMedia[${index}]`, JSON.stringify(media));
        });
      }
      
      // Add new media files
      mediaFiles.forEach((file, index) => {
        postData.append(`media[${index}]`, file);
      });
      
      // Create or update the post
      let response;
      if (isEditing) {
        response = await PostService.updatePost(postId, postData);
      } else {
        response = await PostService.createPost(postData);
      }
      
      // Navigate to the post detail page
      navigate(`/posts/${response.id}`);
    } catch (err) {
      setError(`Failed to ${isEditing ? 'update' : 'create'} post. Please try again.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing && !formData.title) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading post data...</span>
        </div>
        <p className="mt-3">Loading post data for editing...</p>
      </div>
    );
  }

  return (
    <div className="post-form">
      <div className="card shadow-sm">
        <div className="card-header bg-white">
          <h3 className="mb-0">
            <i className="bi bi-journal-plus me-2"></i>
            {isEditing ? 'Edit Educational Post' : 'Create Educational Post'}
          </h3>
        </div>
        <div className="card-body">
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Post Title</label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                maxLength={150}
                placeholder="Enter a descriptive title for your post"
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
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div className="mb-3">
              <label htmlFor="tags" className="form-label">Tags (comma separated)</label>
              <input
                type="text"
                className="form-control"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="e.g. javascript, beginner, tutorial"
              />
              <div className="form-text">
                Separate tags with commas (e.g., javascript, beginner, tutorial)
              </div>
            </div>

            {/* Markdown Editor */}
            <div className="mb-3">
              <label className="form-label">Content</label>
              <MDEditor
                value={formData.content}
                onChange={handleContentChange}
                height={400}
                preview="edit"
              />
            </div>

            {/* Media Upload */}
            <div className="mb-3">
              <label htmlFor="media" className="form-label">Media (Images, Videos, Documents)</label>
              <input
                type="file"
                className="form-control"
                id="media"
                name="media"
                multiple
                onChange={handleFileChange}
                accept="image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx"
              />
              <div className="form-text">
                You can upload multiple files. Supported formats: images, videos, PDFs, Office documents
              </div>
            </div>

            {/* Media Preview */}
            {mediaPreview.length > 0 && (
              <div className="mb-3">
                <label className="form-label">Media Preview</label>
                <div className="row g-2">
                  {mediaPreview.map((item) => (
                    <div key={item.id} className="col-md-3 col-sm-4 col-6">
                      <div className="media-preview-item position-relative border rounded p-2">
                        {item.type === 'IMAGE' ? (
                          <img 
                            src={item.url} 
                            alt={item.name} 
                            className="img-fluid rounded mb-2"
                          />
                        ) : item.type === 'VIDEO' ? (
                          <div className="ratio ratio-16x9 mb-2">
                            <video src={item.url} controls className="rounded">
                              Your browser does not support video playback.
                            </video>
                          </div>
                        ) : (
                          <div className="document-preview p-3 text-center mb-2">
                            <i className="bi bi-file-earmark-text display-6"></i>
                          </div>
                        )}
                        
                        <div className="small text-truncate mb-1" title={item.name}>
                          {item.name}
                        </div>
                        
                        <button 
                          type="button" 
                          className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                          onClick={() => removeMedia(item.id)}
                          title="Remove"
                        >
                          <i className="bi bi-x"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="d-flex gap-2">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {isEditing ? 'Updating...' : 'Publishing...'}
                  </>
                ) : (
                  <>
                    <i className={`bi ${isEditing ? 'bi-check-circle' : 'bi-send'} me-1`}></i>
                    {isEditing ? 'Update Post' : 'Publish Post'}
                  </>
                )}
              </button>
              
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => navigate(-1)}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

PostForm.propTypes = {
  postId: PropTypes.string,
  userId: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired
};

export default PostForm;