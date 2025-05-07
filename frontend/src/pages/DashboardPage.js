import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PageHeader from '../components/common/PageHeader';
import StatsCard from '../components/dashboard/StatsCard';
import ProgressStats from '../components/dashboard/ProgressStats';
import QuickActions from '../components/dashboard/QuickActions';

const DashboardPage = () => {
  const [learningPlans, setLearningPlans] = useState([]);
  const [educationalPosts, setEducationalPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch learning plans
        const plansResponse = await axios.get('/api/learning-plans', { 
          params: { size: 3, sort: 'createdAt,desc' } 
        });
        setLearningPlans(plansResponse.data.content || []);
        
        // Fetch educational posts
        const postsResponse = await axios.get('/api/posts', { 
          params: { size: 3, sort: 'createdAt,desc' } 
        });
        setEducationalPosts(postsResponse.data.content || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  // Calculate statistics for display
  const completedPlans = 3; // This would normally come from your API
  const inProgressPlans = learningPlans.length - completedPlans;
  const totalTopics = learningPlans.reduce((sum, plan) => sum + (plan.topics?.length || 0), 0);

  return (
    <>
      <PageHeader 
        title="Dashboard" 
        subtitle="Welcome to your learning journey" 
      />
      
      {/* Stats Row */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3 mb-md-0">
          <StatsCard 
            title="Learning Plans" 
            value={learningPlans.length} 
            subtitle="Plans created" 
            type="primary" 
            icon="journal-check"
          />
        </div>
        <div className="col-md-3 mb-3 mb-md-0">
          <StatsCard 
            title="Posts" 
            value={educationalPosts.length} 
            subtitle="Educational posts" 
            type="info" 
            icon="journal-text"
          />
        </div>
        <div className="col-md-3 mb-3 mb-md-0">
          <StatsCard 
            title="Completed" 
            value={completedPlans} 
            subtitle="Plans finished" 
            type="success" 
            icon="check-circle"
          />
        </div>
        <div className="col-md-3">
          <StatsCard 
            title="Topics" 
            value={totalTopics} 
            subtitle="Topics to master" 
            type="warning" 
            icon="list-check"
          />
        </div>
      </div>
      
      {/* Progress and Quick Actions */}
      <div className="row mb-4">
        <div className="col-lg-8 mb-4 mb-lg-0">
          <ProgressStats />
        </div>
        <div className="col-lg-4">
          <QuickActions />
        </div>
      </div>
      
      {/* Recent Learning Content */}
      <div className="row">
        {/* Recent Learning Plans */}
        <div className="col-lg-6 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Learning Plans</h5>
              <Link to="/learning-plans" className="btn btn-sm btn-outline-primary">View All</Link>
            </div>
            <div className="card-body p-0">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : learningPlans.length === 0 ? (
                <div className="text-center py-5">
                  <p className="mb-0 text-muted">No learning plans found</p>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {learningPlans.map(plan => (
                    <Link 
                      key={plan.id} 
                      to={`/learning-plans/${plan.id}`}
                      className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <h6 className="mb-1">{plan.title}</h6>
                        <p className="mb-0 text-muted small">
                          {plan.description?.substring(0, 70)}
                          {plan.description?.length > 70 ? '...' : ''}
                        </p>
                      </div>
                      <span className="badge bg-primary rounded-pill">
                        {plan.topics?.length || 0} topics
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <div className="card-footer bg-white text-center">
              <Link to="/learning-plans/create" className="btn btn-primary">
                <i className="bi bi-plus-circle me-1"></i>
                Create New Plan
              </Link>
            </div>
          </div>
        </div>
        
        {/* Recent Educational Posts */}
        <div className="col-lg-6 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Educational Posts</h5>
              <Link to="/posts" className="btn btn-sm btn-outline-primary">View All</Link>
            </div>
            <div className="card-body p-0">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : educationalPosts.length === 0 ? (
                <div className="text-center py-5">
                  <p className="mb-0 text-muted">No educational posts found</p>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {educationalPosts.map(post => (
                    <Link 
                      key={post.id} 
                      to={`/posts/${post.id}`}
                      className="list-group-item list-group-item-action d-flex align-items-start"
                    >
                      {post.thumbnail && (
                        <div className="me-3" style={{ width: '60px', height: '60px' }}>
                          <img 
                            src={post.thumbnail} 
                            className="img-fluid rounded"
                            alt={post.title}
                            style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                          />
                        </div>
                      )}
                      <div>
                        <h6 className="mb-1">{post.title}</h6>
                        <p className="mb-0 text-muted small">
                          {post.excerpt?.substring(0, 60)}
                          {post.excerpt?.length > 60 ? '...' : ''}
                        </p>
                        <div className="mt-1">
                          <span className="badge bg-light text-dark me-1">
                            {post.category}
                          </span>
                          <small className="text-muted">
                            {post.readTime} min read
                          </small>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <div className="card-footer bg-white text-center">
              <Link to="/posts" className="btn btn-primary">
                <i className="bi bi-journals me-1"></i>
                Browse All Posts
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;