import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorAlert from '../components/common/ErrorAlert';
import FloatingActionButton from '../components/common/FloatingActionButton';
import { usePostContext } from '../contexts/PostContext';
import { useAuth } from '../contexts/AuthContext';

const EducationalPostsPage = () => {
  const { 
    posts, 
    categories,
    selectedCategory,
    loading, 
    error, 
    hasMore,
    totalElements,
    changeCategory,
    loadMorePosts,
    deletePost
  } = usePostContext();

  const { currentUser } = useAuth();
  const userId = currentUser?.id;

  const renderPostCard = (post) => {
    const isAuthor = post.userId === userId;
    
    return (
      <div className="col-md-6 col-lg-4 mb-4" key={post.id}>
        <div className="card h-100 shadow-sm hover-lift">
          {post.thumbnail || (post.mediaUrls && post.mediaUrls.length > 0) ? (
            <div className="ratio ratio-16x9">
              <img 
                src={post.thumbnail || post.mediaUrls[0]} 
                className="card-img-top"
                alt={post.title}
                style={{ objectFit: 'cover' }}
              />
            </div>
          ) : null}
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-2">
              {post.category && (
                <Link 
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    changeCategory(post.category);
                  }}
                  className="badge bg-light text-dark text-decoration-none"
                >
                  {post.category}
                </Link>
              )}
              <small className="text-muted">
                {post.estimatedTime || '5 min read'}
              </small>
            </div>
            <h5 className="card-title">{post.title}</h5>
            <p className="card-text text-muted">
              {post.content?.length > 120 
                ? `${post.content.substring(0, 120).replace(/<[^>]*>/g, '')}...` 
                : post.content?.replace(/<[^>]*>/g, '')}
            </p>
          </div>
          <div className="card-footer bg-white">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                {post.author?.avatar ? (
                  <img 
                    src={post.author.avatar} 
                    alt={post.author?.name || post.userName}
                    className="rounded-circle me-2"
                    width="24"
                    height="24"
                  />
                ) : (
                  <i className="bi bi-person-circle me-2"></i>
                )}
                <small className="text-muted">{post.author?.name || post.userName}</small>
              </div>
              <Link to={`/posts/${post.id}`} className="btn btn-sm btn-outline-primary">
                Read More
              </Link>
            </div>
          </div>
          {isAuthor && (
            <div className="position-absolute top-0 end-0 m-2">
              <div className="dropdown">
                <button 
                  className="btn btn-sm btn-light rounded-circle" 
                  type="button" 
                  id={`dropdown-${post.id}`}
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-three-dots-vertical"></i>
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby={`dropdown-${post.id}`}>
                  <li>
                    <Link 
                      className="dropdown-item" 
                      to={`/posts/edit/${post.id}`}
                    >
                      <i className="bi bi-pencil me-2"></i>
                      Edit
                    </Link>
                  </li>
                  <li>
                    <button 
                      className="dropdown-item text-danger" 
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this post?')) {
                          deletePost(post.id);
                        }
                      }}
                    >
                      <i className="bi bi-trash me-2"></i>
                      Delete
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container py-4">
      <PageHeader 
        title="Educational Posts" 
        subtitle="Expand your knowledge with our educational resources"
      />
      
      <div className="row mb-4">
        <div className="col-md-8">
          <div className="d-flex flex-wrap">
            <button 
              className={`btn btn-filter me-2 mb-2 ${selectedCategory === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => changeCategory('all')}
            >
              All Topics
            </button>
            
            {categories.map(category => (
              <button 
                key={category}
                className={`btn btn-filter me-2 mb-2 ${selectedCategory === category ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => changeCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        <div className="col-md-4">
          <form className="d-flex">
            <input 
              type="text" 
              className="form-control me-2" 
              placeholder="Search posts..." 
            />
            <button type="submit" className="btn btn-outline-primary">
              <i className="bi bi-search"></i>
            </button>
          </form>
        </div>
      </div>
      
      {error && <ErrorAlert message={error} />}
      
      <div className="row">
        {posts.length === 0 && !loading ? (
          <div className="col-12 text-center py-5">
            <div className="display-6 text-muted mb-3">
              <i className="bi bi-journal-text"></i>
            </div>
            <h3>No posts found</h3>
            <p className="text-muted">
              {selectedCategory !== 'all' ? 
                `Try selecting a different category or check back later for new content on ${selectedCategory}.` : 
                'Try adjusting your search criteria or check back later for new content.'}
            </p>
            <Link to="/posts/create" className="btn btn-primary mt-3">
              <i className="bi bi-plus-lg me-2"></i>
              Create Your First Post
            </Link>
          </div>
        ) : (
          posts.map(post => renderPostCard(post))
        )}
      </div>
      
      {loading && (
        <div className="text-center my-4">
          <LoadingSpinner message="Loading posts..." />
        </div>
      )}
      
      {!loading && hasMore && posts.length > 0 && (
        <div className="text-center mt-4">
          <button 
            className="btn btn-outline-primary"
            onClick={loadMorePosts}
          >
            Load More Posts
          </button>
        </div>
      )}
      
      {!loading && posts.length > 0 && (
        <div className="text-center text-muted mt-3">
          <small>Showing {posts.length} of {totalElements} posts</small>
        </div>
      )}
      
      <FloatingActionButton 
        to="/posts/create" 
        icon="plus-lg" 
        label="Create New Post" 
      />
    </div>
  );
};

export default EducationalPostsPage;