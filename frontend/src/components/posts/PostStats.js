import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const PostStats = ({ postId, initialStats }) => {
  const [stats, setStats] = useState(initialStats || {
    views: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    bookmarks: 0
  });
  const [userInteractions, setUserInteractions] = useState({
    liked: false,
    bookmarked: false
  });
  const [loading, setLoading] = useState(false);
  // In a real app, get this from authentication context
  const currentUserId = 'user123';

  useEffect(() => {
    // Check if user has already liked or bookmarked this post
    const checkUserInteractions = async () => {
      try {
        const response = await axios.get(`/api/posts/${postId}/user-interactions`, {
          params: { userId: currentUserId }
        });
        setUserInteractions(response.data);
      } catch (error) {
        console.error('Error checking user interactions:', error);
      }
    };

    checkUserInteractions();
  }, [postId, currentUserId]);

  const handleLike = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const action = userInteractions.liked ? 'unlike' : 'like';
      const response = await axios.post(`/api/posts/${postId}/${action}`, {
        userId: currentUserId
      });
      
      setStats(prev => ({
        ...prev,
        likes: response.data.likeCount
      }));
      
      setUserInteractions(prev => ({
        ...prev,
        liked: !prev.liked
      }));
    } catch (error) {
      console.error('Error updating like status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const action = userInteractions.bookmarked ? 'unbookmark' : 'bookmark';
      const response = await axios.post(`/api/posts/${postId}/${action}`, {
        userId: currentUserId
      });
      
      setStats(prev => ({
        ...prev,
        bookmarks: response.data.bookmarkCount
      }));
      
      setUserInteractions(prev => ({
        ...prev,
        bookmarked: !prev.bookmarked
      }));
    } catch (error) {
      console.error('Error updating bookmark status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      // Generate share link or dialog
      const shareUrl = `${window.location.origin}/posts/${postId}`;
      
      // Use the Web Share API if available
      if (navigator.share) {
        await navigator.share({
          title: 'Check out this educational post!',
          text: 'I found this interesting post on SkillWave',
          url: shareUrl
        });
      } else {
        // Fallback to copying to clipboard
        navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
      }
      
      // Increment share count on the server
      const response = await axios.post(`/api/posts/${postId}/share`, {
        userId: currentUserId
      });
      
      setStats(prev => ({
        ...prev,
        shares: response.data.shareCount
      }));
    } catch (error) {
      console.error('Error sharing post:', error);
    }
  };

  return (
    <div className="post-stats">
      <div className="d-flex justify-content-between align-items-center mb-3 py-2 border-top border-bottom">
        <div className="d-flex align-items-center text-muted small">
          <span>
            <i className="bi bi-eye me-1"></i>
            {stats.views} {stats.views === 1 ? 'view' : 'views'}
          </span>
          <span className="mx-2">•</span>
          <span>
            <i className="bi bi-chat-dots me-1"></i>
            {stats.comments} {stats.comments === 1 ? 'comment' : 'comments'}
          </span>
        </div>
        <div>
          <span className="badge bg-light text-dark">
            Educational Content
          </span>
        </div>
      </div>
      
      <div className="d-flex justify-content-between">
        <button
          className={`btn btn-action ${userInteractions.liked ? 'text-primary' : ''}`}
          onClick={handleLike}
          disabled={loading}
        >
          <i className={`bi ${userInteractions.liked ? 'bi-hand-thumbs-up-fill' : 'bi-hand-thumbs-up'} me-1`}></i>
          {stats.likes > 0 && <span>{stats.likes}</span>}
          <span className="ms-1 d-none d-md-inline">
            {userInteractions.liked ? 'Liked' : 'Like'}
          </span>
        </button>
        
        <Link to={`/posts/${postId}#comments`} className="btn btn-action">
          <i className="bi bi-chat me-1"></i>
          {stats.comments > 0 && <span>{stats.comments}</span>}
          <span className="ms-1 d-none d-md-inline">Comment</span>
        </Link>
        
        <button className="btn btn-action" onClick={handleShare}>
          <i className="bi bi-share me-1"></i>
          {stats.shares > 0 && <span>{stats.shares}</span>}
          <span className="ms-1 d-none d-md-inline">Share</span>
        </button>
        
        <button
          className={`btn btn-action ${userInteractions.bookmarked ? 'text-warning' : ''}`}
          onClick={handleBookmark}
          disabled={loading}
        >
          <i className={`bi ${userInteractions.bookmarked ? 'bi-bookmark-fill' : 'bi-bookmark'} me-1`}></i>
          {stats.bookmarks > 0 && <span>{stats.bookmarks}</span>}
          <span className="ms-1 d-none d-md-inline">
            {userInteractions.bookmarked ? 'Saved' : 'Save'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default PostStats;