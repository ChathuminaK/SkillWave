import api from './api.service';

export const LearningPlanService = {
  // Get all learning plans
  getAll: async () => {
    const response = await api.get('/learning-plans');
    return response.data;
  },

  // Get a specific learning plan by ID
  getById: async (id) => {
    const response = await api.get(`/learning-plans/${id}`);
    return response.data;
  },

  // Create a new learning plan
  create: async (learningPlan) => {
    const response = await api.post('/learning-plans', learningPlan);
    return response.data;
  },

  // Update an existing learning plan
  update: async (id, learningPlan) => {
    const response = await api.put(`/learning-plans/${id}`, learningPlan);
    return response.data;
  },

  // Delete a learning plan
  delete: async (id) => {
    await api.delete(`/learning-plans/${id}`);
    return true;
  }
};