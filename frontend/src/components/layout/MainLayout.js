import React from 'react';
import Header from './Header';
import Footer from './Footer';

const MainLayout = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1">
        <div className="container-fluid py-4 page-container">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;