import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/common/ErrorBoundary';
import { ProgressProvider } from './contexts/ProgressContext';
import { AuthProvider } from './contexts/AuthContext';
import MainLayout from './layouts/MainLayout';
import WelcomePage from './pages/WelcomePage';
import DashboardPage from './pages/DashboardPage';
import ProgressReportPage from './pages/ProgressReportPage';
import LearningPlanListPage from './pages/LearningPlanListPage';
import LearningPlanDetailPage from './pages/LearningPlanDetailPage';
import LearningPlanFormPage from './pages/LearningPlanFormPage';
import EducationalPostsPage from './pages/EducationalPostsPage';
import EducationalPostPage from './pages/EducationalPostPage';
import CreatePostPage from './pages/CreatePostPage';
import EditPostPage from './pages/EditPostPage';
import { PostProvider } from './contexts/PostContext';
import DebugPage from './pages/DebugPage';
import ErrorPage from './pages/ErrorPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/common/ProtectedRoute';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles/socialComponents.css';
import './styles/navigation.css';
import './styles/layout.css';
import './index.css';
import './styles/post.css';
import './styles/progress.css';
import './styles/welcome.css';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ProgressProvider>
          <PostProvider>
            <Router>
              <Routes>
                <Route path="/" element={<WelcomePage />} />
                
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />

                <Route path="/profile" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <ErrorBoundary>
                        <ProfilePage />
                      </ErrorBoundary>
                    </MainLayout>
                  </ProtectedRoute>
                } />

                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <ErrorBoundary>
                        <DashboardPage />
                      </ErrorBoundary>
                    </MainLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/learning-plans" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <ErrorBoundary>
                        <LearningPlanListPage />
                      </ErrorBoundary>
                    </MainLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/learning-plans/create" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <ErrorBoundary>
                        <LearningPlanFormPage />
                      </ErrorBoundary>
                    </MainLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/learning-plans/edit/:id" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <ErrorBoundary>
                        <LearningPlanFormPage />
                      </ErrorBoundary>
                    </MainLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/learning-plans/:id" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <ErrorBoundary>
                        <LearningPlanDetailPage />
                      </ErrorBoundary>
                    </MainLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/progress" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <ErrorBoundary>
                        <ProgressReportPage />
                      </ErrorBoundary>
                    </MainLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/posts/create" element={
                  <MainLayout>
                    <ErrorBoundary>
                      <CreatePostPage />
                    </ErrorBoundary>
                  </MainLayout>
                } />
                
                <Route path="/posts/edit/:id" element={
                  <MainLayout>
                    <ErrorBoundary>
                      <EditPostPage />
                    </ErrorBoundary>
                  </MainLayout>
                } />
                
                <Route path="/posts/:id" element={
                  <MainLayout>
                    <ErrorBoundary>
                      <EducationalPostPage />
                    </ErrorBoundary>
                  </MainLayout>
                } />
                
                <Route path="/posts" element={
                  <MainLayout>
                    <ErrorBoundary>
                      <EducationalPostsPage />
                    </ErrorBoundary>
                  </MainLayout>
                } />
                
                {process.env.NODE_ENV === 'development' && (
                  <Route path="/debug" element={
                    <MainLayout>
                      <DebugPage />
                    </MainLayout>
                  } />
                )}

                <Route path="*" element={<ErrorPage />} />
              </Routes>
            </Router>
          </PostProvider>
        </ProgressProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;