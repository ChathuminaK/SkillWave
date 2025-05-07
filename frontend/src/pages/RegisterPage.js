import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AuthService } from '../services/auth.service';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setError('');
      setLoading(true);
      
      await AuthService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      setSuccess(true);
      
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/login', { 
          state: { message: 'Registration successful! Please log in with your new account.' }
        });
      }, 3000);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register. Please try again later.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegistration = () => {
    window.location.href = AuthService.getOAuthRegistrationUrl('google');
  };

  const handleGithubRegistration = () => {
    window.location.href = AuthService.getOAuthRegistrationUrl('github');
  };

  return (
    <div className="container-fluid">
      <div className="row min-vh-100">
        <div className="col-md-6 bg-primary d-flex align-items-center justify-content-center">
          <div className="text-center text-white p-5">
            <h1 className="display-4 fw-bold mb-4">SkillWave</h1>
            <p className="lead">Join our community of learners and share your knowledge with others.</p>
            <img 
              src="/images/register-illustration.svg" 
              alt="Registration illustration" 
              className="img-fluid mt-4" 
              style={{ maxWidth: '80%' }}
            />
          </div>
        </div>
        
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <div className="card border-0 shadow-sm p-4" style={{ maxWidth: '450px', width: '100%' }}>
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Create an Account</h2>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="alert alert-success" role="alert">
                  Registration successful! Redirecting you to login page...
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
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
                    minLength="8"
                  />
                  <small className="text-muted">Must be at least 8 characters long</small>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="d-grid gap-2 mb-4">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading || success}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Creating account...
                      </>
                    ) : 'Register'}
                  </button>
                </div>
              </form>
              
              <div className="text-center mb-3">
                <p className="text-muted">Or register with</p>
                <div className="d-flex justify-content-center gap-3">
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={handleGoogleRegistration}
                    disabled={loading || success}
                  >
                    <i className="bi bi-google me-2"></i>Google
                  </button>
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={handleGithubRegistration}
                    disabled={loading || success}
                  >
                    <i className="bi bi-github me-2"></i>GitHub
                  </button>
                </div>
              </div>
              
              <div className="text-center">
                <p className="mb-1">
                  Already have an account?{' '}
                  <Link to="/login" className="text-decoration-none">Log in</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;