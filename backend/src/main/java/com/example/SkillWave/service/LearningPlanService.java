package com.example.SkillWave.service;

import com.example.SkillWave.model.LearningPlan;
import java.util.List;

public interface LearningPlanService {
    List<LearningPlan> getAllLearningPlans();
    LearningPlan getLearningPlanById(Long id);
    LearningPlan createLearningPlan(LearningPlan learningPlan);
    LearningPlan updateLearningPlan(Long id, LearningPlan learningPlan);
    void deleteLearningPlan(Long id);
}
