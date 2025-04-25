import { useState, useEffect, useCallback } from 'react';
import { LearningPlanService } from '../services/learningPlan.service';

export const useLearningPlans = () => {
  const [learningPlans, setLearningPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLearningPlans = useCallback(async () => {
    try {
      setLoading(true);
      const data = await LearningPlanService.getAll();
      setLearningPlans(data);
      setError(null);
    } catch (err) {
      setError('Failed to load learning plans. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLearningPlans();
  }, [fetchLearningPlans]);

  const addLearningPlan = useCallback(async (learningPlan) => {
    try {
      const newPlan = await LearningPlanService.create(learningPlan);
      setLearningPlans(prevPlans => [...prevPlans, newPlan]);
      return newPlan;
    } catch (err) {
      setError('Failed to create learning plan.');
      throw err;
    }
  }, []);

  const updateLearningPlan = useCallback(async (id, learningPlan) => {
    try {
      const updatedPlan = await LearningPlanService.update(id, learningPlan);
      setLearningPlans(prevPlans => 
        prevPlans.map(plan => plan.id === id ? updatedPlan : plan)
      );
      return updatedPlan;
    } catch (err) {
      setError('Failed to update learning plan.');
      throw err;
    }
  }, []);

  const deleteLearningPlan = useCallback(async (id) => {
    try {
      await LearningPlanService.delete(id);
      setLearningPlans(prevPlans => prevPlans.filter(plan => plan.id !== id));
      return true;
    } catch (err) {
      setError('Failed to delete learning plan.');
      throw err;
    }
  }, []);

  return {
    learningPlans,
    loading,
    error,
    fetchLearningPlans,
    addLearningPlan,
    updateLearningPlan,
    deleteLearningPlan
  };
};