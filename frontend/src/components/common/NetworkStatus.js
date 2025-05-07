import React, { useState, useEffect } from 'react';

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showMessage, setShowMessage] = useState(false);
  
  useEffect(() => {
    // Event listener functions
    const handleOnline = () => {
      setIsOnline(true);
      setShowMessage(true);
      // Hide the message after 3 seconds
      setTimeout(() => setShowMessage(false), 3000);
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setShowMessage(true);
    };
    
    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Clean up
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  if (!showMessage) return null;
  
  return (
    <div 
      className={`network-status position-fixed bottom-0 start-50 translate-middle-x mb-3 px-4 py-2 rounded-pill shadow ${isOnline ? 'bg-success' : 'bg-danger'}`}
      style={{ zIndex: 1100 }}
    >
      <p className="text-white m-0 d-flex align-items-center">
        <i className={`bi ${isOnline ? 'bi-wifi' : 'bi-wifi-off'} me-2`}></i>
        {isOnline ? 'You are back online' : 'You are currently offline'}
      </p>
    </div>
  );
};

export default NetworkStatus;