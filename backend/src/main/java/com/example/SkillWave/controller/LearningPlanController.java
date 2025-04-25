package com.example.SkillWave.controller;

import com.example.SkillWave.model.LearningPlan;
import com.example.SkillWave.service.LearningPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/learning-plans")
public class LearningPlanController {

    private final LearningPlanService learningPlanService;

    @Autowired
    public LearningPlanController(LearningPlanService learningPlanService) {
        this.learningPlanService = learningPlanService;
    }

    @GetMapping
    public ResponseEntity<List<LearningPlan>> getAllLearningPlans() {
        List<LearningPlan> learningPlans = learningPlanService.getAllLearningPlans();
        return new ResponseEntity<>(learningPlans, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LearningPlan> getLearningPlanById(@PathVariable Long id) {
        LearningPlan learningPlan = learningPlanService.getLearningPlanById(id);
        return new ResponseEntity<>(learningPlan, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<LearningPlan> createLearningPlan(@RequestBody LearningPlan learningPlan) {
        LearningPlan createdLearningPlan = learningPlanService.createLearningPlan(learningPlan);
        return new ResponseEntity<>(createdLearningPlan, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LearningPlan> updateLearningPlan(@PathVariable Long id, @RequestBody LearningPlan learningPlan) {
        LearningPlan updatedLearningPlan = learningPlanService.updateLearningPlan(id, learningPlan);
        return new ResponseEntity<>(updatedLearningPlan, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLearningPlan(@PathVariable Long id) {
        learningPlanService.deleteLearningPlan(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
