import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const location = useLocation();
  const { currentUser, logout, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <header className="navbar navbar-expand-lg navbar-light bg-white border-bottom py-0 sticky-top">
      <div className="container">
        <Link className="navbar-brand py-0 me-2" to="/">
          <div className="d-flex align-items-center">
            <div className="bg-primary rounded p-1 me-1">
              <span className="text-white fw-bold h5 mb-0">S</span>
            </div>
            <div className="d-none d-sm-block">
              <span className="fw-bold text-primary">Skill</span><span className="fw-bold">Wave</span>
            </div>
          </div>
        </Link>
        
        <div className="ms-2 me-auto d-none d-md-block" style={{ width: '280px' }}>
          <div className="position-relative">
            <span className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted">
              <i className="bi bi-search"></i>
            </span>
            <input 
              type="text" 
              className="form-control bg-light py-2 ps-5" 
              placeholder="Search skills, topics, plans..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item mx-1">
              <Link 
                className={`nav-link d-flex flex-column align-items-center px-3 py-2 ${location.pathname === '/' ? 'active' : ''}`}
                to="/dashboard"
              >
                <i className="bi bi-house-door fs-5"></i>
                <span className="small">Home</span>
              </Link>
            </li>
            <li className="nav-item mx-1">
              <Link 
                className={`nav-link d-flex flex-column align-items-center px-3 py-2 ${location.pathname.includes('/learning-plans') && !location.pathname.includes('/create') ? 'active' : ''}`}
                to="/learning-plans"
              >
                <i className="bi bi-journal-text fs-5"></i>
                <span className="small">My Network</span>
              </Link>
            </li>
            <li className="nav-item mx-1">
              <Link 
                className={`nav-link d-flex flex-column align-items-center px-3 py-2 ${location.pathname.includes('/learning-plans/create') ? 'active' : ''}`}
                to="/learning-plans/create"
              >
                <i className="bi bi-plus-circle fs-5"></i>
                <span className="small">Create</span>
              </Link>
            </li>
            <li className="nav-item mx-1">
              <Link 
                className={`nav-link d-flex flex-column align-items-center px-3 py-2 ${location.pathname === '/progress' ? 'active' : ''}`}
                to="/progress"
              >
                <i className="bi bi-graph-up fs-5"></i>
                <span className="small">Progress</span>
              </Link>
            </li>          </ul>
          <div className="d-flex">
            {isAuthenticated ? (
              <div className="dropdown">
                <button 
                  className="btn btn-outline-light dropdown-toggle d-flex align-items-center" 
                  type="button" 
                  id="userDropdown" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                >
                  {currentUser?.profilePictureUrl ? (
                    <img 
                      src={currentUser.profilePictureUrl} 
                      alt={currentUser.fullName}
                      className="rounded-circle me-2"
                      width="24"
                      height="24"
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <i className="bi bi-person-circle me-2"></i>
                  )}
                  {currentUser?.fullName || 'User'}
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      <i className="bi bi-person me-2"></i>Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/progress">
                      <i className="bi bi-graph-up me-2"></i>Progress
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item" onClick={logout}>
                      <i className="bi bi-box-arrow-right me-2"></i>Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex">
                <Link to="/login" className="btn btn-outline-light me-2">
                  Login
                </Link>
                <Link to="/register" className="btn btn-light">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>      </div>
    </header>
  );
};

export default Header;