import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import DashboardPage from './pages/DashboardPage';
import LearningPlanListPage from './pages/LearningPlanListPage';
import LearningPlanDetailPage from './pages/LearningPlanDetailPage';
import LearningPlanFormPage from './pages/LearningPlanFormPage';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <MainLayout>
            <DashboardPage />
          </MainLayout>
        } />
        <Route path="/learning-plans" element={
          <MainLayout>
            <LearningPlanListPage />
          </MainLayout>
        } />
        {/* Important: Specific routes should come before dynamic routes */}
        <Route path="/learning-plans/create" element={
          <MainLayout>
            <LearningPlanFormPage />
          </MainLayout>
        } />
        <Route path="/learning-plans/edit/:id" element={
          <MainLayout>
            <LearningPlanFormPage />
          </MainLayout>
        } />
        <Route path="/learning-plans/:id" element={
          <MainLayout>
            <LearningPlanDetailPage />
          </MainLayout>
        } />
      </Routes>
    </Router>
  );
}

export default App;