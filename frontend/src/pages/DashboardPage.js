import React from 'react';
import PageHeader from '../components/common/PageHeader';
import StatsCard from '../components/dashboard/StatsCard';
import RecentLearningPlans from '../components/dashboard/RecentLearningPlans';
import QuickActions from '../components/dashboard/QuickActions';
import { useLearningPlans } from '../hooks/useLearningPlans';

const DashboardPage = () => {
  const { learningPlans, loading } = useLearningPlans();
  
  // Calculate statistics
  const completedPlans = 3; // This would normally come from your API
  const inProgressPlans = learningPlans.length - completedPlans;
  const totalTopics = learningPlans.reduce((sum, plan) => sum + plan.topics.length, 0);

  return (
    <>
      <PageHeader 
        title="Dashboard" 
        subtitle="Welcome to your learning journey dashboard" 
      />
      
      {/* Stats Row */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3 mb-md-0">
          <StatsCard 
            title="Total Plans" 
            value={learningPlans.length} 
            subtitle="Learning plans created" 
            type="primary" 
          />
        </div>
        <div className="col-md-3 mb-3 mb-md-0">
          <StatsCard 
            title="Completed" 
            value={completedPlans} 
            subtitle="Plans completed" 
            type="success" 
          />
        </div>
        <div className="col-md-3 mb-3 mb-md-0">
          <StatsCard 
            title="In Progress" 
            value={inProgressPlans} 
            subtitle="Plans currently active" 
            type="warning" 
          />
        </div>
        <div className="col-md-3">
          <StatsCard 
            title="Topics" 
            value={totalTopics} 
            subtitle="Topics to master" 
            type="info" 
          />
        </div>
      </div>
      
      {/* Recent Activity and Quick Start */}
      <div className="row">
        <div className="col-lg-8 mb-4 mb-lg-0">
          <RecentLearningPlans learningPlans={learningPlans} loading={loading} />
        </div>
        <div className="col-lg-4">
          <QuickActions />
        </div>
      </div>
    </>
  );
};

export default DashboardPage;