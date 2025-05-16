import React, { useState } from 'react';
import api from '../../services/api.service';
import { TokenUtil } from '../../services/token.util';

const SessionValidator = () => {
  const [validationResult, setValidationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const validateSession = async () => {
    setLoading(true);
    setError(null);
    try {
      // Get the token from storage
      const token = TokenUtil.getToken();
      
      // Check if token exists
      if (!token) {
        setValidationResult({
          valid: false,
          reason: 'No authentication token found. Please login first.'
        });
        return;
      }
      
      // Check token expiration
      const isExpiring = TokenUtil.isTokenExpiring(60);
      
      // Make a request to check if the session is valid
      const response = await api.get('/api/auth/current-user');
      
      // Get the JSESSIONID cookie if present
      const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {});
      
      setValidationResult({
        valid: true,
        user: response.data,
        tokenExpiring: isExpiring,
        sessionId: cookies['JSESSIONID'] || 'No session cookie found',
        tokenData: {
          exp: TokenUtil.getTokenExpiry(),
          iat: TokenUtil.getTokenIssuedAt(),
          sub: TokenUtil.getTokenSubject()
        }
      });
    } catch (err) {
      console.error('Session validation error:', err);
      setValidationResult({
        valid: false,
        reason: err.response?.data?.message || err.message || 'Session validation failed',
        status: err.response?.status
      });
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  const clearSession = () => {
    TokenUtil.removeTokens();
    document.cookie = 'JSESSIONID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    setValidationResult({
      valid: false,
      reason: 'Session manually cleared'
    });
  };

  return (
    <div className="card mt-3">
      <div className="card-header bg-info text-white">
        Session Validator
      </div>
      <div className="card-body">
        <div className="d-flex flex-wrap justify-content-between mb-3">
          <button 
            className="btn btn-primary" 
            onClick={validateSession}
            disabled={loading}
          >
            {loading ? 'Validating...' : 'Validate Session'}
          </button>
          <button 
            className="btn btn-danger" 
            onClick={clearSession}
          >
            Clear Session
          </button>
        </div>
        
        {error && (
          <div className="alert alert-danger mb-3">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        {validationResult && (
          <div className={`alert ${validationResult.valid ? 'alert-success' : 'alert-warning'}`}>
            <div className="d-flex justify-content-between align-items-center">
              <strong>Session Status: {validationResult.valid ? 'Valid' : 'Invalid'}</strong>
              <button 
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? 'Hide Details' : 'Show Details'}
              </button>
            </div>
            
            {!validationResult.valid && (
              <p className="mb-1 mt-2">Reason: {validationResult.reason}</p>
            )}
            
            {validationResult.valid && !showDetails && (
              <p className="mb-1 mt-2">
                Logged in as: {validationResult.user.email}
                {validationResult.tokenExpiring && (
                  <span className="text-warning ms-2">(Token is expiring soon)</span>
                )}
              </p>
            )}
            
            {showDetails && (
              <div className="mt-3">
                <h6>Session Details:</h6>
                <pre className="bg-light p-3 rounded" style={{maxHeight: '300px', overflow: 'auto'}}>
                  {JSON.stringify(validationResult, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
        
        <div className="mt-3">
          <h6>Common Session Issues:</h6>
          <ul>
            <li><strong>Invalid session ID</strong> - Your JSESSIONID cookie is not recognized by the server</li>
            <li><strong>Expired token</strong> - Your JWT token has expired</li>
            <li><strong>Missing token</strong> - No JWT token found in local storage</li>
            <li><strong>Server-side timeout</strong> - Your session timed out on the server</li>
            <li><strong>CORS issues</strong> - Cross-Origin issues preventing cookies from being sent</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SessionValidator;
