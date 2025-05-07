import React, { useState } from 'react';
import api from '../../services/api.service';

const ErrorSimulator = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const simulateErrors = [
    { name: '404 Not Found', endpoint: '/api/not-found' },
    { name: '500 Server Error', endpoint: '/api/test/simulate-error' },
    { name: 'Network Timeout', timeout: 60000 },
    { name: 'Authorization Error', endpoint: '/api/auth/protected-resource' }
  ];
  
  const simulateError = async (errorType) => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      let response;
      
      switch (errorType.name) {
        case 'Network Timeout':
          response = await api.get('/api/test/ping', { timeout: 1 }); // Will timeout almost immediately
          break;
        case 'Authorization Error':
          // Temporarily remove token to simulate auth error
          const token = localStorage.getItem('auth_token');
          localStorage.removeItem('auth_token');
          response = await api.get(errorType.endpoint);
          // Restore token
          if (token) localStorage.setItem('auth_token', token);
          break;
        default:
          response = await api.get(errorType.endpoint);
      }
      
      setResult(response.data);
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="card mt-3">
      <div className="card-header bg-danger text-white">
        Error Simulation Tool
      </div>
      <div className="card-body">
        <div className="alert alert-warning">
          <i className="bi bi-exclamation-triangle me-2"></i>
          This tool helps you test how your application handles various error scenarios.
        </div>
        
        <div className="d-flex flex-wrap gap-2 mb-3">
          {simulateErrors.map((errorType) => (
            <button 
              key={errorType.name}
              className="btn btn-outline-danger" 
              onClick={() => simulateError(errorType)}
              disabled={loading}
            >
              Simulate {errorType.name}
            </button>
          ))}
        </div>
        
        {loading && (
          <div className="d-flex justify-content-center my-3">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
        
        {error && (
          <div className="alert alert-danger mb-3">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        {result && (
          <div className="mb-3">
            <h6>Response:</h6>
            <pre className="bg-light p-3 rounded" style={{maxHeight: '300px', overflow: 'auto'}}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorSimulator;