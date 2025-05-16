import React, { useState, useEffect } from 'react';
import ApiChecker from '../components/debug/ApiChecker';
import PageHeader from '../components/common/PageHeader';
import ErrorSimulator from '../components/debug/ErrorSimulator';
import SessionValidator from '../components/debug/SessionValidator';
import { testBackendConnection } from '../utils/debugHelper';
import api from '../services/api.service';

const DebugPage = () => {
  const [connectionStatus, setConnectionStatus] = useState({ testing: false, result: null });
  const [authStatus, setAuthStatus] = useState({ testing: false, result: null });

  useEffect(() => {
    // Test backend connection on component mount
    handleTestConnection();
  }, []);

  const handleTestConnection = async () => {
    setConnectionStatus({ testing: true, result: null });
    const result = await testBackendConnection();
    setConnectionStatus({ testing: false, result });
  };

  const handleTestAuth = async () => {
    setAuthStatus({ testing: true, result: null });
    try {
      const response = await api.get('/api/auth/current-user');
      setAuthStatus({ 
        testing: false, 
        result: { 
          success: true, 
          data: response.data 
        } 
      });
    } catch (error) {
      setAuthStatus({ 
        testing: false, 
        result: { 
          success: false, 
          error: error.response?.data || error.message
        } 
      });
    }
  };

  return (
    <div className="container py-4">
      <PageHeader 
        title="API Debug Tools" 
        subtitle="Test and troubleshoot API endpoints"
      />
      
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-primary text-white">
          Backend Connection Status
        </div>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-0">Connection Status:</h5>
              {connectionStatus.testing ? (
                <span className="text-secondary">Testing connection...</span>
              ) : connectionStatus.result ? (
                connectionStatus.result.success ? (
                  <span className="text-success">✅ Connected to backend</span>
                ) : (
                  <span className="text-danger">❌ Connection failed: {connectionStatus.result.error || `Status ${connectionStatus.result.status}`}</span>
                )
              ) : (
                <span className="text-secondary">Not tested yet</span>
              )}
            </div>
            <button 
              className="btn btn-primary" 
              onClick={handleTestConnection}
              disabled={connectionStatus.testing}
            >
              {connectionStatus.testing ? 'Testing...' : 'Test Connection'}
            </button>
          </div>
          {connectionStatus.result?.message && (
            <div className="mt-2">
              <small className="text-muted">Server response: {connectionStatus.result.message}</small>
            </div>
          )}
        </div>
      </div>
      
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-info text-white">
          Authentication Status
        </div>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-0">Auth Status:</h5>
              {authStatus.testing ? (
                <span className="text-secondary">Testing authentication...</span>
              ) : authStatus.result ? (
                authStatus.result.success ? (
                  <span className="text-success">✅ Authenticated</span>
                ) : (
                  <span className="text-danger">❌ Not authenticated: {JSON.stringify(authStatus.result.error)}</span>
                )
              ) : (
                <span className="text-secondary">Not tested yet</span>
              )}
            </div>
            <button 
              className="btn btn-info" 
              onClick={handleTestAuth}
              disabled={authStatus.testing}
            >
              {authStatus.testing ? 'Testing...' : 'Test Auth'}
            </button>
          </div>
          {authStatus.result?.data && (
            <div className="mt-2">
              <pre className="bg-light p-2 rounded">
                {JSON.stringify(authStatus.result.data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
      
      <SessionValidator />
      
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