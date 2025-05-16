import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { currentUser } = useContext(AuthContext);
  
  const primaryMenuItems = [
    { path: '/learning-plans', icon: 'people', label: 'My Network' },
    { path: '/posts', icon: 'briefcase', label: 'Skills' },
    { path: '/progress', icon: 'clipboard-data', label: 'Progress' },
    { path: '/messaging', icon: 'chat', label: 'Messaging' },
    { path: '/notifications', icon: 'bell', label: 'Notifications' }
  ];
  
  const secondaryMenuItems = [
    { path: '/bookmarks', icon: 'bookmark', label: 'Saved Items' },
    { path: '/groups', icon: 'people-fill', label: 'Groups' },
    { path: '/events', icon: 'calendar-event', label: 'Events' },
    { path: '/learning-plans/create', icon: 'plus-circle', label: 'Create Plan' }
  ];
  
  return (
    <div className="sidebar bg-white border-end">
      <div className="sidebar-sticky">
        {/* User Profile Section */}
        <div className="p-3 border-bottom">
          <div className="text-center">
            {currentUser?.profilePictureUrl ? (
              <img 
                src={currentUser.profilePictureUrl} 
                alt={currentUser?.fullName || 'User'} 
                className="rounded-circle mb-2"
                width="70"
                height="70"
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <div className="bg-light rounded-circle mx-auto mb-2" style={{ width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="bi bi-person fs-1 text-secondary"></i>
              </div>
            )}
            <h6 className="mb-1">{currentUser?.fullName || 'User'}</h6>
            <p className="text-muted small mb-2">{currentUser?.title || 'SkillWave Member'}</p>
            
            <Link to="/profile" className="btn btn-sm btn-outline-secondary d-block w-100">View Profile</Link>
          </div>
        </div>
        
        {/* Primary Navigation */}
        <ul className="nav flex-column mt-3">
          <li className="nav-item">
            <Link to="/" className={`nav-link d-flex align-items-center px-3 py-2 ${location.pathname === '/' ? 'text-primary fw-bold' : 'text-dark'}`}>
              <i className={`bi bi-house-door me-3 ${location.pathname === '/' ? 'text-primary' : 'text-secondary'}`}></i>
              Home
            </Link>
          </li>
          
          {primaryMenuItems.map(item => (
            <li key={item.path} className="nav-item">
              <Link 
                to={item.path} 
                className={`nav-link d-flex align-items-center px-3 py-2 ${location.pathname.startsWith(item.path) ? 'text-primary fw-bold' : 'text-dark'}`}
              >
                <i className={`bi bi-${item.icon} me-3 ${location.pathname.startsWith(item.path) ? 'text-primary' : 'text-secondary'}`}></i>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        
        {/* Secondary Section */}
        <div className="mt-4 px-3">
          <h6 className="text-uppercase text-muted small fw-bold mb-2">Resources</h6>
          
          <ul className="nav flex-column">
            {secondaryMenuItems.map(item => (
              <li key={item.path} className="nav-item">
                <Link 
                  to={item.path} 
                  className={`nav-link d-flex align-items-center py-2 ${location.pathname.startsWith(item.path) ? 'text-primary fw-bold' : 'text-dark'}`}
                >
                  <i className={`bi bi-${item.icon} me-3 ${location.pathname.startsWith(item.path) ? 'text-primary' : 'text-secondary'}`}></i>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>  );
};

export default Sidebar;