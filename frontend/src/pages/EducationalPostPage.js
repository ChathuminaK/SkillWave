import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PostService } from '../services/post.service';
import { CommentService } from '../services/comment.service';
import PageHeader from '../components/common/PageHeader';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorAlert from '../components/common/ErrorAlert';
import ProgressTracker from '../components/progress/ProgressTracker';

const EducationalPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [liked, setLiked] = useState(false);
  
  // Hardcoded user ID for demo
  const userId = 'user123';
  
  // Fetch post data
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        setLoading(true);
        const postData = await PostService.getPostById(id);
        setPost(postData);
        
        // Check if user has liked the post
        try {
          const hasLiked = await PostService.hasUserLiked(id, userId);
          setLiked(hasLiked);
        } catch (likeError) {
          console.error('Error checking if post is liked:', likeError);
        }
        
        // Fetch related posts
        try {
          const relatedPostsData = await PostService.getRelatedPosts(id);
          setRelatedPosts(relatedPostsData);
        } catch (relatedError) {
          console.error('Error fetching related posts:', relatedError);
        }
        
        setError(null);
      } catch (err) {
        setError('Failed to load post. It might have been deleted or does not exist.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPostData();
  }, [id]);
  
  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      if (!id) return;
      
      try {
        setCommentLoading(true);
        const response = await CommentService.getCommentsByPostId(id);
        setComments(response.comments || []);
        setCommentError(null);
      } catch (err) {
        setCommentError('Failed to load comments.');
        console.error(err);
      } finally {
        setCommentLoading(false);
      }
    };
    
    fetchComments();
  }, [id]);
  
  // Handle comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!commentText.trim()) return;
    
    try {
      const newComment = {
        postId: id,
        userId: userId,
        userName: 'John Doe', // Hardcoded for demo
        content: commentText,
      };
      
      const savedComment = await CommentService.createComment(newComment);
      setComments([savedComment, ...comments]);
      setCommentText('');
    } catch (err) {
      setCommentError('Failed to post comment. Please try again.');
      console.error(err);
    }
  };
  
  // Handle post delete
  const handleDelete = async () => {
    try {
      await PostService.deletePost(id);
      navigate('/posts');
    } catch (error) {
      setError('Failed to delete post.');
      console.error('Failed to delete post:', error);
    } finally {
      setShowDeleteModal(false);
    }
  };
  
  // Handle post like/unlike
  const handleLikeToggle = async () => {
    try {
      if (liked) {
        await PostService.unlikePost(id, userId);
        setPost({
          ...post,
          likesCount: (post.likesCount || 1) - 1
        });
      } else {
        await PostService.likePost(id, userId);
        setPost({
          ...post,
          likesCount: (post.likesCount || 0) + 1
        });
      }
      setLiked(!liked);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };
  
  // Handle progress update
  const handleProgressUpdate = async (newProgress) => {
    try {
      await PostService.updateProgress(id, userId, newProgress);
      setProgress(newProgress);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  if (loading) {
    return <LoadingSpinner message="Loading post..." />;
  }
  
  if (error || !post) {
    return (
      <div className="container py-4">
        <ErrorAlert message={error || "Post not found"} />
        <div className="text-center mt-4">
          <Link to="/posts" className="btn btn-primary">
            Back to Posts
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-4">
      {/* Post header */}
      <div className="mb-4">
        <Link to="/posts" className="btn btn-sm btn-outline-secondary mb-3">
          <i className="bi bi-arrow-left me-1"></i> Back to Posts
        </Link>
        
        <h1 className="mb-3">{post.title}</h1>
        
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <div className="me-3">
              <div className="avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                <i className="bi bi-person"></i>
              </div>
            </div>
            <div>
              <p className="mb-0 fw-bold">{post.userName || 'Anonymous'}</p>
              <p className="text-muted small mb-0">
                Published on {formatDate(post.createdAt)}
                {post.updatedAt && post.updatedAt !== post.createdAt && 
                  ` · Updated on ${formatDate(post.updatedAt)}`}
              </p>
            </div>
          </div>
          
          <div className="d-flex gap-2">
            <span className="badge bg-primary">{post.category}</span>
            <span className="badge bg-secondary">{post.difficultyLevel}</span>
            {post.estimatedTime && (
              <span className="badge bg-info">
                <i className="bi bi-clock me-1"></i> {post.estimatedTime}
              </span>
            )}
          </div>
        </div>
        
        {/* Media gallery */}
        {post.mediaUrls && post.mediaUrls.length > 0 && (
          <div className="mb-4">
            <div className="row">
              {post.mediaUrls.map((url, index) => {
                // Determine if it's an image or video based on extension
                const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
                const isVideo = /\.(mp4|webm|ogg)$/i.test(url);
                
                return (
                  <div key={index} className="col-md-4 mb-3">
                    <div className="card h-100">
                      <div className="card-img-top ratio ratio-16x9">
                        {isImage ? (
                          <img 
                            src={url} 
                            alt={`Media ${index + 1}`} 
                            className="img-fluid" 
                            style={{ objectFit: 'cover' }}
                          />
                        ) : isVideo ? (
                          <video controls className="w-100 h-100">
                            <source src={url} type={`video/${url.split('.').pop()}`} />
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <div className="d-flex align-items-center justify-content-center h-100 bg-light">
                            <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary">
                              <i className="bi bi-file-earmark me-2"></i>
                              View Document
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Post owner actions */}
        {post.userId === userId && (
          <div className="d-flex gap-2 mt-3 mb-4">
            <Link to={`/posts/edit/${id}`} className="btn btn-outline-primary">
              <i className="bi bi-pencil me-1"></i> Edit
            </Link>
            <button 
              className="btn btn-outline-danger" 
              onClick={() => setShowDeleteModal(true)}
            >
              <i className="bi bi-trash me-1"></i> Delete
            </button>
          </div>
        )}
      </div>
      
      {/* Progress tracker */}
      {post.id && (
        <ProgressTracker 
          contentId={post.id} 
          contentType="EDUCATIONAL_POST" 
        />
      )}
      
      {/* Post content */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="post-content">
            {/* Use white-space: pre-wrap to preserve line breaks */}
            <div style={{ whiteSpace: 'pre-wrap' }}>
              {post.content}
            </div>
          </div>
          
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-4">
              <h6>Tags:</h6>
              <div>
                {post.tags.map((tag, index) => (
                  <span key={index} className="badge bg-light text-dark me-2 mb-2">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Social interactions */}
          <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
            <div className="d-flex align-items-center">
              <button 
                className={`btn btn-sm ${liked ? 'btn-primary' : 'btn-outline-primary'} me-2`}
                onClick={handleLikeToggle}
              >
                <i className={`bi bi-${liked ? 'heart-fill' : 'heart'} me-1`}></i>
                {liked ? 'Liked' : 'Like'}
                {post.likesCount > 0 && ` (${post.likesCount})`}
              </button>
              
              <button className="btn btn-sm btn-outline-secondary me-2">
                <i className="bi bi-chat-text me-1"></i>
                Comments ({comments.length})
              </button>
              
              <button 
                className="btn btn-sm btn-outline-secondary"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }}
              >
                <i className="bi bi-share me-1"></i>
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Comments section */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-white">
          <h5 className="mb-0">Comments</h5>
        </div>
        
        <div className="card-body">
          {/* Comment form */}
          <form onSubmit={handleCommentSubmit} className="mb-4">
            <div className="mb-3">
              <textarea
                className="form-control"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows="3"
                required
              ></textarea>
            </div>
            <div className="text-end">
              <button type="submit" className="btn btn-primary" disabled={!commentText.trim()}>
                Post Comment
              </button>
            </div>
          </form>
          
          {commentError && <ErrorAlert message={commentError} />}
          
          {/* Comment list */}
          {commentLoading ? (
            <LoadingSpinner message="Loading comments..." />
          ) : comments.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted mb-0">No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            <div className="comments-list">
              {comments.map(comment => (
                <div key={comment.id} className="comment mb-3 p-3 border rounded">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className="d-flex align-items-center">
                      <div className="me-2">
                        <div className="avatar bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                          <i className="bi bi-person-fill"></i>
                        </div>
                      </div>
                      <div>
                        <p className="mb-0 fw-bold">{comment.userName || 'Anonymous'}</p>
                        <p className="text-muted small mb-0">
                          {formatDate(comment.createdAt)}
                        </p>
                      </div>
                    </div>
                    
                    {(comment.userId === userId || post.userId === userId) && (
                      <div className="dropdown">
                        <button className="btn btn-sm btn-link text-secondary" type="button" data-bs-toggle="dropdown">
                          <i className="bi bi-three-dots-vertical"></i>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                          {comment.userId === userId && (
                            <li>
                              <button className="dropdown-item" type="button">
                                <i className="bi bi-pencil me-2"></i>Edit
                              </button>
                            </li>
                          )}
                          <li>
                            <button 
                              className="dropdown-item text-danger" 
                              type="button"
                              onClick={async () => {
                                if (window.confirm('Are you sure you want to delete this comment?')) {
                                  try {
                                    await CommentService.deleteComment(
                                      comment.id, 
                                      userId, 
                                      post.userId
                                    );
                                    setComments(comments.filter(c => c.id !== comment.id));
                                  } catch (error) {
                                    console.error('Error deleting comment:', error);
                                  }
                                }
                              }}
                            >
                              <i className="bi bi-trash me-2"></i>Delete
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  <p className="mb-0">{comment.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-white">
            <h5 className="mb-0">Related Posts</h5>
          </div>
          
          <div className="card-body">
            <div className="row">
              {relatedPosts.map(relatedPost => (
                <div key={relatedPost.id} className="col-md-4 mb-3">
                  <div className="card h-100 hover-lift">
                    {relatedPost.thumbnail && (
                      <img 
                        src={relatedPost.thumbnail} 
                        className="card-img-top" 
                        alt={relatedPost.title}
                        style={{ height: '140px', objectFit: 'cover' }}
                      />
                    )}
                    <div className="card-body">
                      <h6 className="card-title">{relatedPost.title}</h6>
                      <p className="card-text small text-muted">
                        {relatedPost.excerpt?.substring(0, 60)}...
                      </p>
                      <Link to={`/posts/${relatedPost.id}`} className="btn btn-sm btn-outline-primary">
                        Read More
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="modal d-block" tabIndex="-1" role="dialog" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this post? This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={handleDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EducationalPostPage;