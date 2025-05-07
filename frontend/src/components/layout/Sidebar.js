import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/dashboard', icon: 'speedometer2', label: 'Dashboard' },
    { path: '/learning-plans', icon: 'journal-check', label: 'Learning Plans' },
    { path: '/posts', icon: 'journal-text', label: 'Educational Posts' },
    { path: '/progress', icon: 'graph-up', label: 'Progress' },
    { path: '/bookmarks', icon: 'bookmark', label: 'Bookmarks' },
    { path: '/settings', icon: 'gear', label: 'Settings' },
  ];
  
  return (
    <div className="sidebar bg-dark text-white">
      <div className="sidebar-sticky">
        <div className="sidebar-header p-3 mb-3 border-bottom border-secondary">
          <Link to="/dashboard" className="text-decoration-none text-white">
            <h3 className="mb-0"><strong>Skill</strong>Wave</h3>
          </Link>
        </div>
        
        <ul className="nav flex-column">
          {menuItems.map(item => (
            <li key={item.path} className="nav-item">
              <Link 
                to={item.path} 
                className={`nav-link text-white py-3 ${location.pathname.startsWith(item.path) ? 'active bg-primary' : ''}`}
              >
                <i className={`bi bi-${item.icon} me-2`}></i>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        
        <div className="mt-auto p-3">
          <div className="user-info d-flex align-items-center">
            <div className="user-avatar me-2">
              <i className="bi bi-person-circle fs-3"></i>
            </div>
            <div>
              <h6 className="mb-0">John Doe</h6>
              <small className="text-muted">john.doe@example.com</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;