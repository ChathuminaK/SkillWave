import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AuthService } from '../services/auth.service';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  // Get redirect path from location state or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    // If user is already authenticated, redirect
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
    
    // Check for OAuth callback
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    
    if (token) {
      handleOAuthSuccess(token);
    }
  }, [isAuthenticated, navigate, from, location.search]);

  const handleOAuthSuccess = async (token) => {
    try {
      localStorage.setItem('auth_token', token);
      // Remove the token from URL for security reasons
      window.history.replaceState({}, document.title, window.location.pathname);
      // Reload the page to apply the new token
      window.location.href = from;
    } catch (err) {
      setError('OAuth authentication failed');
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      
      // Validate input
      if (!formData.email.trim() || !formData.password.trim()) {
        setError('Please enter both email and password');
        return;
      }
      
      await login(formData.email, formData.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to log in. Please check your credentials.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = AuthService.getOAuthLoginUrl('google');
  };

  const handleGithubLogin = () => {
    window.location.href = AuthService.getOAuthLoginUrl('github');
  };

  return (
    <div className="container-fluid">
      <div className="row min-vh-100">
        <div className="col-md-6 bg-primary d-flex align-items-center justify-content-center">
          <div className="text-center text-white p-5">
            <h1 className="display-4 fw-bold mb-4">SkillWave</h1>
            <p className="lead">Share your skills and learn from others in our collaborative learning community.</p>
            <img 
              src="/images/login-illustration.svg" 
              alt="Learning illustration" 
              className="img-fluid mt-4" 
              style={{ maxWidth: '80%' }}
            />
          </div>
        </div>
        
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <div className="card border-0 shadow-sm p-4" style={{ maxWidth: '400px', width: '100%' }}>
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Welcome Back</h2>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="d-grid gap-2 mb-4">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Logging in...
                      </>
                    ) : 'Sign In'}
                  </button>
                </div>
              </form>
              
              <div className="text-center mb-3">
                <p className="text-muted">Or continue with</p>
                <div className="d-flex justify-content-center gap-3">
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                  >
                    <i className="bi bi-google me-2"></i>Google
                  </button>
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={handleGithubLogin}
                    disabled={loading}
                  >
                    <i className="bi bi-github me-2"></i>GitHub
                  </button>
                </div>
              </div>
              
              <div className="text-center">
                <p className="mb-1">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-decoration-none">Register now</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;