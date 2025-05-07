import React from 'react';
import PostCard from './PostCard';
import PostFilter from './PostFilter';
import { usePostContext } from '../../contexts/PostContext';

const PostList = () => {
  const { 
    posts, 
    loading, 
    error, 
    totalPages, 
    currentPage, 
    fetchPosts, 
    changeCategory,
    changeSorting,
    currentCategory,
    sortBy,
    sortDirection
  } = usePostContext();

  const handlePageChange = (newPage) => {
    fetchPosts(newPage);
  };

  if (loading && posts.length === 0) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading posts...</span>
        </div>
        <p className="mt-3">Loading educational posts...</p>
      </div>
    );
  }

  if (error && posts.length === 0) {
    return (
      <div className="alert alert-danger my-4" role="alert">
        <h4 className="alert-heading">Error Loading Posts</h4>
        <p>{error}</p>
        <hr />
        <p className="mb-0">
          <button 
            className="btn btn-outline-danger" 
            onClick={() => fetchPosts(currentPage)}
          >
            <i className="bi bi-arrow-clockwise me-1"></i>
            Try Again
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="post-list">
      {/* Filters and sorting */}
      <PostFilter 
        currentCategory={currentCategory}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onCategoryChange={changeCategory}
        onSortChange={changeSorting}
      />

      {/* Show "no posts" message if needed */}
      {posts.length === 0 && (
        <div className="alert alert-info text-center my-4">
          <i className="bi bi-journal-x fs-4 d-block mb-2"></i>
          <h5>No Posts Found</h5>
          <p className="mb-0">
            {currentCategory 
              ? `No posts available in the "${currentCategory}" category.` 
              : "No educational posts are available at this time."}
          </p>
        </div>
      )}

      {/* Display posts */}
      <div className="row g-4">
        {posts.map(post => (
          <div key={post.id} className="col-md-6 col-lg-4">
            <PostCard post={post} />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav aria-label="Post pagination" className="my-4">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
              <button 
                className="page-link" 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
              >
                Previous
              </button>
            </li>
            
            {[...Array(totalPages).keys()].map(page => (
              <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                <button 
                  className="page-link" 
                  onClick={() => handlePageChange(page)}
                >
                  {page + 1}
                </button>
              </li>
            ))}
            
            <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
              <button 
                className="page-link" 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}

      {/* Loading indicator for pagination */}
      {loading && posts.length > 0 && (
        <div className="text-center py-3">
          <div className="spinner-border spinner-border-sm text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <span className="ms-2">Loading more posts...</span>
        </div>
      )}
    </div>
  );
};

export default PostList;