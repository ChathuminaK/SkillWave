import React, { useState } from 'react';
import MainHeader from './MainHeader';
import Sidebar from './Sidebar';
import Footer from './Footer';

const MainLayout = ({ children, useSidebar = false }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className={`app-container ${useSidebar ? 'with-sidebar' : ''}`}>
      {useSidebar ? (
        <>
          <div className={`sidebar-wrapper ${sidebarOpen ? 'open' : 'closed'}`}>
            <Sidebar />
          </div>
          <div className="main-content-wrapper">
            <button 
              className="sidebar-toggle btn btn-sm btn-light"
              onClick={toggleSidebar}
              aria-label="Toggle Sidebar"
            >
              <i className={`bi bi-${sidebarOpen ? 'chevron-left' : 'chevron-right'}`}></i>
            </button>
            <main>
              <div className="container-fluid py-4">
                {children}
              </div>
            </main>
            <Footer />
          </div>
        </>
      ) : (
        <>
          <MainHeader />
          <main>
            <div className="container py-4">
              {children}
            </div>
          </main>
          <Footer />
        </>
      )}
    </div>
  );
};

export default MainLayout;