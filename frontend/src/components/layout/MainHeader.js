import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const MainHeader = () => {
  const location = useLocation();
  
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <strong>Skill</strong>Wave
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/' ? 'active fw-bold' : ''}`}
                to="/"
              >
                <i className="bi bi-speedometer2 me-1"></i>
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname.startsWith('/learning-plans') ? 'active fw-bold' : ''}`}
                to="/learning-plans"
              >
                <i className="bi bi-journal-check me-1"></i>
                Learning Plans
              </Link>
            </li>
            {/* Educational Posts Navbar Link */}
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname.startsWith('/posts') ? 'active fw-bold' : ''}`}
                to="/posts"
              >
                <i className="bi bi-journal-text me-1"></i>
                Educational Posts
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/progress' ? 'active fw-bold' : ''}`}
                to="/progress"
              >
                <i className="bi bi-graph-up me-1"></i>
                Progress
              </Link>
            </li>
          </ul>
          <div className="d-flex">
            <div className="dropdown">
              <button className="btn btn-outline-light dropdown-toggle" type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                <i className="bi bi-person-circle me-1"></i> John Doe
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                <li><a className="dropdown-item" href="#!">Profile</a></li>
                <li><a className="dropdown-item" href="#!">Settings</a></li>
                <li><hr className="dropdown-divider" /></li>
                <li><a className="dropdown-item" href="#!">Logout</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MainHeader;