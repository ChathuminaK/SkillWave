package com.example.SkillWave.service;

import com.example.SkillWave.exception.LearningPlanNotFoundException;
import com.example.SkillWave.model.LearningPlan;
import com.example.SkillWave.repository.LearningPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class LearningPlanServiceImpl implements LearningPlanService {

    private final LearningPlanRepository learningPlanRepository;

    @Autowired
    public LearningPlanServiceImpl(LearningPlanRepository learningPlanRepository) {
        this.learningPlanRepository = learningPlanRepository;
    }

    @Override
    public List<LearningPlan> getAllLearningPlans() {
        return learningPlanRepository.findAll();
    }

    @Override
    public LearningPlan getLearningPlanById(Long id) {
        return learningPlanRepository.findById(id)
                .orElseThrow(() -> new LearningPlanNotFoundException(id));
    }

    @Override
    public LearningPlan createLearningPlan(LearningPlan learningPlan) {
        return learningPlanRepository.save(learningPlan);
    }

    @Override
    public LearningPlan updateLearningPlan(Long id, LearningPlan learningPlan) {
        LearningPlan existingLearningPlan = learningPlanRepository.findById(id)
                .orElseThrow(() -> new LearningPlanNotFoundException(id));

        existingLearningPlan.setTitle(learningPlan.getTitle());
        existingLearningPlan.setDescription(learningPlan.getDescription());
        existingLearningPlan.setTopics(learningPlan.getTopics());
        existingLearningPlan.setResources(learningPlan.getResources());
        existingLearningPlan.setTimeline(learningPlan.getTimeline());

        return learningPlanRepository.save(existingLearningPlan);
    }

    @Override
    public void deleteLearningPlan(Long id) {
        learningPlanRepository.deleteById(id);
    }
}