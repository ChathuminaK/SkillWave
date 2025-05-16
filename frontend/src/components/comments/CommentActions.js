import React, { useState, useRef, useEffect } from 'react';

const CommentActions = ({ comment, isAuthor, isPostOwner, onReply, onEdit, onDelete }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleAction = (action) => {
    setShowDropdown(false);
    
    switch(action) {
      case 'reply':
        onReply();
        break;
      case 'edit':
        onEdit();
        break;
      case 'delete':
        onDelete();
        break;
      case 'report':
        alert('Comment reported. Our moderators will review it.');
        break;
      default:
        break;
    }
  };

  return (
    <div className="dropdown" ref={dropdownRef}>
      <button
        className="btn btn-sm btn-link text-muted p-0"
        onClick={toggleDropdown}
        aria-expanded={showDropdown}
      >
        <i className="bi bi-three-dots"></i>
      </button>
      
      <ul className={`dropdown-menu dropdown-menu-end ${showDropdown ? 'show' : ''}`}>
        <li>
          <button 
            className="dropdown-item" 
            onClick={() => handleAction('reply')}
          >
            <i className="bi bi-reply me-2"></i>
            Reply
          </button>
        </li>
        
        {isAuthor && (
          <li>
            <button 
              className="dropdown-item" 
              onClick={() => handleAction('edit')}
            >
              <i className="bi bi-pencil me-2"></i>
              Edit
            </button>
          </li>
        )}
        
        {(isAuthor || isPostOwner) && (
          <li>
            <button 
              className="dropdown-item text-danger" 
              onClick={() => handleAction('delete')}
            >
              <i className="bi bi-trash me-2"></i>
              Delete
            </button>
          </li>
        )}
        
        {!isAuthor && !isPostOwner && (
          <li>
            <button 
              className="dropdown-item" 
              onClick={() => handleAction('report')}
            >
              <i className="bi bi-flag me-2"></i>
              Report
            </button>
          </li>
        )}
      </ul>
    </div>
  );
};

export default CommentActions;