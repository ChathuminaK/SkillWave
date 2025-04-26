package com.example.SkillWave.controller;

import com.example.SkillWave.model.LearningPlan;
import com.example.SkillWave.service.LearningPlanService;
import com.example.SkillWave.service.MediaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*")
public class TestController {

    @Autowired
    private LearningPlanService learningPlanService;
    
    @Autowired
    private MediaService mediaService;

    @PostMapping("/sample-plan-with-media")
    public ResponseEntity<LearningPlan> createSamplePlanWithMedia(@RequestParam("file") MultipartFile file) {
        try {
            // Create a sample learning plan
            LearningPlan plan = new LearningPlan();
            plan.setTitle("Sample Plan with Media");
            plan.setDescription("This is a sample learning plan created with a media file");
            plan.setTopics(Arrays.asList("Sample Topic 1", "Sample Topic 2"));
            plan.setResources(Arrays.asList("Sample Resource 1", "Sample Resource 2"));
            plan.setTimeline("4 weeks");
            
            // Save the plan to get an ID
            LearningPlan savedPlan = learningPlanService.createLearningPlan(plan);
            
            // Upload the media file
            if (file != null && !file.isEmpty()) {
                MultipartFile[] files = {file};
                List<String> mediaUrls = mediaService.uploadFiles(files, "learning-plans", savedPlan.getId());
                
                savedPlan.setMediaUrls(mediaUrls);
                savedPlan = learningPlanService.updateLearningPlan(savedPlan.getId(), savedPlan);
            }
            
            return ResponseEntity.ok(savedPlan);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/ping")
    public Map<String, Object> ping() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "API is reachable");
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }
    
    @PostMapping("/echo")
    public Map<String, Object> echo(@RequestBody(required = false) Map<String, Object> body) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("received", body != null ? body : "No body sent");
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }
}