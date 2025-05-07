import React from 'react';
import ApiChecker from '../components/debug/ApiChecker';
import PageHeader from '../components/common/PageHeader';
import ErrorSimulator from '../components/debug/ErrorSimulator';

const DebugPage = () => {
  return (
    <div className="container py-4">
      <PageHeader 
        title="API Debug Tools" 
        subtitle="Test and troubleshoot API endpoints"
      />
      
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="card-title">API Testing Instructions</h5>
          <p className="card-text">
            Use the endpoint checker below to test API connectivity. Try these endpoints:
          </p>
          <ul>
            <li><code>/api/test/ping</code> - Basic connectivity test</li>
            <li><code>/api/learning-plans</code> - Get all learning plans</li>
            <li><code>/api/learning-plans/1</code> - Get a specific learning plan</li>
            <li><code>/api/educational-posts</code> - Get all posts</li>
          </ul>
        </div>
      </div>
      
      <ErrorSimulator />
      <ApiChecker />
    </div>
  );
};

export default DebugPage;