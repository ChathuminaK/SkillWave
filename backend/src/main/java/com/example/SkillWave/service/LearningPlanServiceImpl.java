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
        if (id == null) {
            throw new IllegalArgumentException("Learning plan ID cannot be null");
        }
        
        if (learningPlan == null) {
            throw new IllegalArgumentException("Learning plan cannot be null");
        }
        
        LearningPlan existingLearningPlan = learningPlanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Learning plan not found with id: " + id));

        // Update basic fields with null checks
        if (learningPlan.getTitle() != null) {
            existingLearningPlan.setTitle(learningPlan.getTitle());
        }
        
        if (learningPlan.getDescription() != null) {
            existingLearningPlan.setDescription(learningPlan.getDescription());
        }
        
        if (learningPlan.getTopics() != null) {
            existingLearningPlan.setTopics(learningPlan.getTopics());
        }
        
        if (learningPlan.getResources() != null) {
            existingLearningPlan.setResources(learningPlan.getResources());
        }
        
        if (learningPlan.getTimeline() != null) {
            existingLearningPlan.setTimeline(learningPlan.getTimeline());
        }
        
        // Handle mediaUrls with null checks
        if (learningPlan.getMediaUrls() != null) {
            existingLearningPlan.setMediaUrls(learningPlan.getMediaUrls());
        }

        return learningPlanRepository.save(existingLearningPlan);
    }

    @Override
    public void deleteLearningPlan(Long id) {
        learningPlanRepository.deleteById(id);
    }

    @Override
    public boolean existsById(Long id) {
        if (id == null) {
            return false;
        }
        return learningPlanRepository.existsById(id);
    }
}