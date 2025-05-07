import React, { useState } from 'react';
import api from '../../services/api.service';

const ApiChecker = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [endpoint, setEndpoint] = useState('/api/educational-posts');
  const [error, setError] = useState(null);

  const checkEndpoint = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(endpoint);
      setResult(response.data);
    } catch (err) {
      setError(err.toString());
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card mt-3">
      <div className="card-header bg-dark text-white">
        API Endpoint Checker
      </div>
      <div className="card-body">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            placeholder="API endpoint to check"
          />
          <button 
            className="btn btn-primary" 
            onClick={checkEndpoint}
            disabled={loading}
          >
            {loading ? 'Checking...' : 'Check'}
          </button>
        </div>
        
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

export default ApiChecker;