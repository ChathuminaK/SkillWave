import React, { useState } from 'react';
import PropTypes from 'prop-types';

const PostFilter = ({ currentCategory, sortBy, sortDirection, onCategoryChange, onSortChange }) => {
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  
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
  
  const sortOptions = [
    { value: 'createdAt', label: 'Date Posted', icon: 'bi-calendar' },
    { value: 'likeCount', label: 'Most Popular', icon: 'bi-heart' },
    { value: 'commentCount', label: 'Most Discussed', icon: 'bi-chat' },
    { value: 'title', label: 'Title (A-Z)', icon: 'bi-sort-alpha-down' }
  ];
  
  const handleCategorySelect = (category) => {
    if (category === currentCategory) {
      // If clicking the active category, clear filter
      onCategoryChange(null);
    } else {
      onCategoryChange(category);
    }
  };
  
  const handleSortSelect = (sortOption) => {
    // Toggle direction if selecting the same sort option
    const newDirection = 
      sortOption === sortBy && sortDirection === 'desc' ? 'asc' : 'desc';
    
    onSortChange(sortOption, newDirection);
  };
  
  return (
    <div className="post-filter bg-light p-3 rounded mb-4">
      <div className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <i className="bi bi-funnel me-2"></i>
          Filters & Sorting
        </h5>
        <button 
          className="btn btn-sm btn-link" 
          onClick={() => setIsFilterExpanded(!isFilterExpanded)}
          aria-expanded={isFilterExpanded}
        >
          {isFilterExpanded ? 'Collapse' : 'Expand'} Filters
          <i className={`bi ms-1 ${isFilterExpanded ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
        </button>
      </div>
      
      {isFilterExpanded && (
        <div className="mt-3">
          <div className="mb-3">
            <h6 className="mb-2">Categories</h6>
            <div className="d-flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  className={`btn btn-sm ${
                    currentCategory === category ? 'btn-primary' : 'btn-outline-secondary'
                  }`}
                  onClick={() => handleCategorySelect(category)}
                >
                  {category}
                </button>
              ))}
              
              {currentCategory && (
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => onCategoryChange(null)}
                >
                  <i className="bi bi-x-circle me-1"></i>
                  Clear Filter
                </button>
              )}
            </div>
          </div>
          
          <div>
            <h6 className="mb-2">Sort By</h6>
            <div className="d-flex flex-wrap gap-2">
              {sortOptions.map(option => (
                <button
                  key={option.value}
                  className={`btn btn-sm ${
                    sortBy === option.value ? 'btn-primary' : 'btn-outline-secondary'
                  }`}
                  onClick={() => handleSortSelect(option.value)}
                >
                  <i className={`bi ${option.icon} me-1`}></i>
                  {option.label}
                  {sortBy === option.value && (
                    <i className={`bi ms-1 ${
                      sortDirection === 'desc' ? 'bi-arrow-down-short' : 'bi-arrow-up-short'
                    }`}></i>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

PostFilter.propTypes = {
  currentCategory: PropTypes.string,
  sortBy: PropTypes.string.isRequired,
  sortDirection: PropTypes.string.isRequired,
  onCategoryChange: PropTypes.func.isRequired,
  onSortChange: PropTypes.func.isRequired
};

export default PostFilter;