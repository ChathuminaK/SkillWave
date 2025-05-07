import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import NetworkStatus from '../components/common/NetworkStatus';

const MainLayout = ({ children, useSidebar = false }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  if (useSidebar) {
    return (
      <div className="main-layout d-flex flex-column min-vh-100">
        <Header />
        <div className="container-fluid flex-grow-1">
          <div className="row">
            <div className={`sidebar-wrapper col-md-3 col-lg-2 ${sidebarOpen ? '' : 'collapsed'}`}>
              <button 
                className="sidebar-toggle btn btn-sm btn-light d-md-none"
                onClick={toggleSidebar}
                aria-label="Toggle Sidebar"
              >
                <i className={`bi bi-${sidebarOpen ? 'chevron-left' : 'chevron-right'}`}></i>
              </button>
              {/* Your sidebar content here */}
            </div>
            <main className={`col-md-${sidebarOpen ? '9' : '12'} col-lg-${sidebarOpen ? '10' : '12'}`}>
              <div className="py-4">
                {children}
              </div>
            </main>
          </div>
        </div>
        <Footer />
        <NetworkStatus />
      </div>
    );
  }
  
  return (
    <div className="main-layout d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1">
        <div className="container py-4">
          {children}
        </div>
      </main>
      <Footer />
      <NetworkStatus />
    </div>
  );
};

export default MainLayout;