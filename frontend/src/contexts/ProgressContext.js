import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ProgressService } from '../services/progress.service';

const ProgressContext = createContext();

export const useProgress = () => useContext(ProgressContext);

export const ProgressProvider = ({ children }) => {
  // In a real app, this would come from authentication
  // Hard-coding for demo purposes
  const [userId] = useState('user123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progressItems, setProgressItems] = useState([]);
  const [completedItems, setCompletedItems] = useState([]);
  const [progressSummary, setProgressSummary] = useState(null);
  
  // Fetch progress summary
  const fetchProgressSummary = useCallback(async () => {
    try {
      setLoading(true);
      const summary = await ProgressService.getProgressSummary(userId);
      setProgressSummary(summary);
      setError(null);
    } catch (err) {
      console.error('Error fetching progress summary:', err);
      setError('Failed to load progress summary. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [userId]);
  
  // Fetch user progress
  const fetchUserProgress = useCallback(async (page = 0, size = 10) => {
    try {
      setLoading(true);
      const data = await ProgressService.getUserProgress(userId, page, size);
      setProgressItems(data.progress || []);
      setError(null);
      return data;
    } catch (err) {
      console.error('Error fetching user progress:', err);
      setError('Failed to load your progress. Please try again.');
      return { progress: [], currentPage: 0, totalItems: 0, totalPages: 0 };
    } finally {
      setLoading(false);
    }
  }, [userId]);
  
  // Fetch completed progress items
  const fetchCompletedProgress = useCallback(async (page = 0, size = 10) => {
    try {
      setLoading(true);
      const data = await ProgressService.getCompletedProgress(userId, page, size);
      setCompletedItems(data.progress || []);
      setError(null);
      return data;
    } catch (err) {
      console.error('Error fetching completed progress:', err);
      setError('Failed to load your completed items. Please try again.');
      return { progress: [], currentPage: 0, totalItems: 0, totalPages: 0 };
    } finally {
      setLoading(false);
    }
  }, [userId]);
  
  // Create new progress
  const createProgress = useCallback(async (contentId, contentType) => {
    try {
      setLoading(true);
      const newProgress = await ProgressService.createProgress({
        userId,
        contentId,
        contentType,
        progressPercentage: 0,
        completed: false
      });
      
      // Update the local state with the new progress item
      setProgressItems(prev => [newProgress, ...prev]);
      
      return newProgress;
    } catch (err) {
      console.error('Error creating progress:', err);
      throw new Error('Failed to create progress tracking');
    } finally {
      setLoading(false);
    }
  }, [userId]);
  
  // Update progress percentage
  const updateProgressPercentage = useCallback(async (contentId, contentType, percentage) => {
    try {
      setLoading(true);
      const updatedProgress = await ProgressService.updateProgressPercentage(
        userId, contentId, contentType, percentage
      );
      
      // Update the local state
      setProgressItems(prev => prev.map(item => 
        item.contentId === contentId && item.contentType === contentType
          ? updatedProgress
          : item
      ));
      
      return updatedProgress;
    } catch (err) {
      console.error('Error updating progress:', err);
      throw new Error('Failed to update progress');
    } finally {
      setLoading(false);
    }
  }, [userId]);
  
  // Mark content as completed
  const markAsCompleted = useCallback(async (contentId, contentType) => {
    try {
      setLoading(true);
      const updatedProgress = await ProgressService.markAsCompleted(
        userId, contentId, contentType
      );
      
      // Update both progress lists
      setProgressItems(prev => prev.filter(item => 
        !(item.contentId === contentId && item.contentType === contentType)
      ));
      
      setCompletedItems(prev => [updatedProgress, ...prev]);
      
      // Update the summary
      fetchProgressSummary();
      
      return updatedProgress;
    } catch (err) {
      console.error('Error marking as completed:', err);
      throw new Error('Failed to mark as completed');
    } finally {
      setLoading(false);
    }
  }, [userId, fetchProgressSummary]);
  
  // Reset progress
  const resetProgress = useCallback(async (contentId, contentType) => {
    try {
      setLoading(true);
      const resetItem = await ProgressService.resetProgress(
        userId, contentId, contentType
      );
      
      // Update the local state
      setCompletedItems(prev => prev.filter(item => 
        !(item.contentId === contentId && item.contentType === contentType)
      ));
      
      setProgressItems(prev => [resetItem, ...prev]);
      
      // Update the summary
      fetchProgressSummary();
      
      return resetItem;
    } catch (err) {
      console.error('Error resetting progress:', err);
      throw new Error('Failed to reset progress');
    } finally {
      setLoading(false);
    }
  }, [userId, fetchProgressSummary]);
  
  // Load initial data
  useEffect(() => {
    fetchProgressSummary();
  }, [fetchProgressSummary]);
  
  const contextValue = {
    userId,
    loading,
    error,
    progressItems,
    completedItems,
    progressSummary,
    fetchProgressSummary,
    fetchUserProgress,
    fetchCompletedProgress,
    createProgress,
    updateProgressPercentage,
    markAsCompleted,
    resetProgress
  };
  
  return (
    <ProgressContext.Provider value={contextValue}>
      {children}
    </ProgressContext.Provider>
  );
};