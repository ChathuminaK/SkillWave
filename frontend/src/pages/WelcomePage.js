import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const WelcomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="welcome-page">
      {/* Hero Section */}
      <header className="bg-primary text-white py-5">
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-3 fw-bold mb-4">Share Your Skills, Expand Your Knowledge</h1>
              <p className="lead mb-4">
                Join SkillWave, the platform where passionate learners share and acquire new skills through 
                structured learning plans, educational posts, and collaborative progress tracking.
              </p>
              <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                {isAuthenticated ? (
                  <Link to="/dashboard" className="btn btn-light btn-lg px-4 me-md-2">
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link to="/register" className="btn btn-light btn-lg px-4 me-md-2">
                      Get Started
                    </Link>
                    <Link to="/login" className="btn btn-outline-light btn-lg px-4">
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="col-lg-6 d-none d-lg-block">
              <img 
                src="/images/hero-illustration.svg" 
                alt="SkillWave Learning Platform" 
                className="img-fluid" 
              />
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-5">
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Powerful Learning Features</h2>
            <p className="lead text-muted">Everything you need to create, share, and track your learning journey</p>
          </div>
          
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="feature-icon bg-primary bg-gradient text-white rounded-circle mb-3">
                    <i className="bi bi-journal-text"></i>
                  </div>
                  <h5 className="card-title">Skill Sharing Posts</h5>
                  <p className="card-text">Create rich media posts with up to 3 photos or videos to share your skills with the community.</p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="feature-icon bg-primary bg-gradient text-white rounded-circle mb-3">
                    <i className="bi bi-graph-up"></i>
                  </div>
                  <h5 className="card-title">Progress Tracking</h5>
                  <p className="card-text">Track your learning progress and share updates on your journey to mastery.</p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="feature-icon bg-primary bg-gradient text-white rounded-circle mb-3">
                    <i className="bi bi-journals"></i>
                  </div>
                  <h5 className="card-title">Learning Plans</h5>
                  <p className="card-text">Create structured learning plans with topics, resources, and completion timelines.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-light py-5">
        <div className="container py-5 text-center">
          <h2 className="fw-bold mb-4">Ready to Start Your Learning Journey?</h2>
          <p className="lead text-muted mb-4">
            Join thousands of learners sharing their knowledge and skills on SkillWave.
          </p>
          {isAuthenticated ? (
            <Link to="/learning-plans/create" className="btn btn-primary btn-lg px-5">
              Create Your First Learning Plan
            </Link>
          ) : (
            <Link to="/register" className="btn btn-primary btn-lg px-5">
              Sign Up Now
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-4">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h5 className="mb-3">SkillWave</h5>
              <p className="mb-0">© 2025 SkillWave. All rights reserved.</p>
            </div>
            <div className="col-md-6 text-md-end">
              <ul className="list-inline mb-0">
                <li className="list-inline-item"><a href="#" className="text-white">Terms</a></li>
                <li className="list-inline-item"><a href="#" className="text-white">Privacy</a></li>
                <li className="list-inline-item"><a href="#" className="text-white">Support</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WelcomePage;