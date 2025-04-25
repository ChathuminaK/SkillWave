package com.example.SkillWave.exception;

public class LearningPlanNotFoundException extends RuntimeException {
    public LearningPlanNotFoundException(Long id) {
        super("Learning plan not found with id: " + id);
    }
}