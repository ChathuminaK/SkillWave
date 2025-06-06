package com.example.SkillWave.controller;

import com.example.SkillWave.model.LearningPlan;
import com.example.SkillWave.model.Progress;
import com.example.SkillWave.service.LearningPlanService;
import com.example.SkillWave.service.MediaService;
import com.example.SkillWave.service.ProgressService;
import com.example.SkillWave.exception.ResourceNotFoundException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/learning-plans")
@CrossOrigin(origins = "http://localhost:3000")
public class LearningPlanController {
    
    @Autowired
    private LearningPlanService learningPlanService;
    
    @Autowired
    private MediaService mediaService;
    
    @Autowired
    private ProgressService progressService;
    
    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping
    public List<LearningPlan> getAllLearningPlans() {
        return learningPlanService.getAllLearningPlans();
    }

    @GetMapping("/{id}")
    public ResponseEntity<LearningPlan> getLearningPlanById(@PathVariable Long id) {
        LearningPlan learningPlan = learningPlanService.getLearningPlanById(id);
        return ResponseEntity.ok(learningPlan);
    }

    @PostMapping
    public ResponseEntity<LearningPlan> createLearningPlan(@RequestBody LearningPlan learningPlan) {
        learningPlan.setTimeline(learningPlan.getTimeline());
        return ResponseEntity.ok(learningPlanService.createLearningPlan(learningPlan));
    }
    
    @PostMapping("/with-media")
    public ResponseEntity<LearningPlan> createLearningPlanWithMedia(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("topics") String topicsJson,
            @RequestParam("resources") String resourcesJson,
            @RequestParam("timeline") String timeline,
            @RequestParam(value = "media", required = false) MultipartFile[] mediaFiles) {
        
        try {
            // Parse JSON arrays
            List<String> topics = parseJsonArray(topicsJson);
            List<String> resources = parseJsonArray(resourcesJson);
            
            // Create and save the learning plan first to get an ID
            LearningPlan learningPlan = new LearningPlan();
            learningPlan.setTitle(title);
            learningPlan.setDescription(description);
            learningPlan.setTopics(topics);
            learningPlan.setResources(resources);
            learningPlan.setTimeline(timeline);
            
            // Initialize empty media URLs list
            learningPlan.setMediaUrls(new ArrayList<>());
            
            // Save to get ID
            LearningPlan savedPlan = learningPlanService.createLearningPlan(learningPlan);
            
            // Now handle media files if any
            if (mediaFiles != null && mediaFiles.length > 0) {
                List<String> mediaUrls = mediaService.uploadFiles(mediaFiles, "learning-plans", savedPlan.getId());
                savedPlan.setMediaUrls(mediaUrls);
                
                // Update the plan with media URLs
                savedPlan = learningPlanService.updateLearningPlan(savedPlan.getId(), savedPlan);
            }
            
            return ResponseEntity.ok(savedPlan);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<LearningPlan> updateLearningPlan(@PathVariable Long id, @RequestBody LearningPlan learningPlan) {
        LearningPlan updatedPlan = learningPlanService.updateLearningPlan(id, learningPlan);
        updatedPlan.setTimeline(learningPlan.getTimeline() != null ? learningPlan.getTimeline() : "");
        return ResponseEntity.ok(updatedPlan);
    }
    
    @PutMapping("/{id}/with-media")
    public ResponseEntity<LearningPlan> updateLearningPlanWithMedia(
            @PathVariable Long id,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("topics") String topicsJson,
            @RequestParam("resources") String resourcesJson,
            @RequestParam("timeline") String timeline,
            @RequestParam(value = "existingMedia", required = false) String existingMediaJson,
            @RequestParam(value = "media", required = false) MultipartFile[] mediaFiles) {
        
        System.out.println("Updating learning plan ID: " + id);
        
        try {
            // Basic validation
            if (id == null) {
                throw new IllegalArgumentException("Learning plan ID cannot be null");
            }
            
            // Check if plan exists
            boolean exists = learningPlanService.existsById(id);
            if (!exists) {
                throw new RuntimeException("Learning plan not found with id: " + id);
            }
            
            // Get existing plan
            LearningPlan existingPlan = learningPlanService.getLearningPlanById(id);
            
            // Parse JSON values with null checks
            List<String> topics = new ArrayList<>();
            if (topicsJson != null && !topicsJson.isEmpty()) {
                topics = parseJsonArray(topicsJson);
            }
            
            List<String> resources = new ArrayList<>();
            if (resourcesJson != null && !resourcesJson.isEmpty()) {
                resources = parseJsonArray(resourcesJson);
            }
            
            List<String> existingMediaUrls = new ArrayList<>();
            if (existingMediaJson != null && !existingMediaJson.isEmpty()) {
                existingMediaUrls = parseJsonArray(existingMediaJson);
                System.out.println("Parsed existing media URLs: " + existingMediaUrls);
            }
            
            // Update basic fields with null safety
            existingPlan.setTitle(title != null ? title : "");
            existingPlan.setDescription(description != null ? description : "");
            existingPlan.setTopics(topics);
            existingPlan.setResources(resources);
            existingPlan.setTimeline(timeline != null ? timeline : "");
            
            // Ensure media URLs list is initialized
            if (existingPlan.getMediaUrls() == null) {
                existingPlan.setMediaUrls(new ArrayList<>());
            }
            
            // Handle deleted media files
            List<String> deletedMediaUrls = new ArrayList<>();
            for (String url : existingPlan.getMediaUrls()) {
                if (!existingMediaUrls.contains(url)) {
                    deletedMediaUrls.add(url);
                }
            }
            
            // Delete removed files
            for (String url : deletedMediaUrls) {
                try {
                    mediaService.deleteFile(url);
                } catch (Exception e) {
                    System.err.println("Error deleting file: " + url);
                    e.printStackTrace();
                    // Continue with next file
                }
            }
            
            // Update the media URLs list
            existingPlan.setMediaUrls(new ArrayList<>(existingMediaUrls));
            
            // Process new media files if present
            if (mediaFiles != null && mediaFiles.length > 0) {
                try {
                    System.out.println("Uploading " + mediaFiles.length + " new media files");
                    
                    // Filter out null files
                    List<MultipartFile> validFiles = new ArrayList<>();
                    for (MultipartFile file : mediaFiles) {
                        if (file != null && !file.isEmpty()) {
                            validFiles.add(file);
                        }
                    }
                    
                    if (!validFiles.isEmpty()) {
                        // Convert List back to array for the service call
                        MultipartFile[] validFilesArray = validFiles.toArray(new MultipartFile[0]);
                        
                        // Upload files
                        List<String> newMediaUrls = mediaService.uploadFiles(validFilesArray, "learning-plans", id);
                        
                        // Add new URLs to existing ones
                        if (newMediaUrls != null && !newMediaUrls.isEmpty()) {
                            List<String> allMediaUrls = new ArrayList<>(existingPlan.getMediaUrls());
                            allMediaUrls.addAll(newMediaUrls);
                            existingPlan.setMediaUrls(allMediaUrls);
                        }
                    }
                } catch (Exception e) {
                    System.err.println("Error processing new media files: " + e.getMessage());
                    e.printStackTrace();
                    // Continue with update even if media upload fails
                }
            }
            
            // Save updates
            LearningPlan updatedPlan = learningPlanService.updateLearningPlan(id, existingPlan);
            return ResponseEntity.ok(updatedPlan);
            
        } catch (Exception e) {
            System.err.println("Error updating learning plan with media: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to update learning plan with media: " + e.getMessage(), e);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLearningPlan(@PathVariable Long id) {
        try {
            // Get learning plan to delete its media
            LearningPlan plan = learningPlanService.getLearningPlanById(id);
            
            // Delete associated media files
            if (plan.getMediaUrls() != null && !plan.getMediaUrls().isEmpty()) {
                System.out.println("Deleting " + plan.getMediaUrls().size() + " media files for plan " + id);
                for (String url : plan.getMediaUrls()) {
                    mediaService.deleteFile(url);
                }
            }
            
            // Delete the learning plan
            learningPlanService.deleteLearningPlan(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            System.err.println("Error deleting learning plan: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to delete learning plan: " + e.getMessage(), e);
        }
    }
    
    @GetMapping("/{id}/progress/{userId}")
    public ResponseEntity<?> getLearningPlanProgressForUser(
            @PathVariable Long id, 
            @PathVariable String userId) {
        
        // First check if the learning plan exists
        LearningPlan plan = learningPlanService.getLearningPlanById(id);
        if (plan == null) {
            throw new ResourceNotFoundException("Learning plan not found with id: " + id);
        }
        
        // Then get or initialize the progress
        Optional<Progress> progressOptional = progressService.getProgressByUserAndContent(userId, id, "LEARNING_PLAN");
        Progress progress = progressOptional.orElse(new Progress());
        
        // If no progress exists yet, initialize basic information
        if (progress.getId() == null) {
            progress.setUserId(userId);
            progress.setContentId(id);
            progress.setContentType("LEARNING_PLAN");
            progress.setProgressPercentage(0);
            progress.setCompleted(false);
        }
        
        // Return a response combining plan and progress data
        Map<String, Object> response = new HashMap<>();
        response.put("plan", plan);
        response.put("progress", progress);
        
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/progress/{userId}/{percentage}")
    public ResponseEntity<Progress> updateLearningPlanProgress(
            @PathVariable Long id,
            @PathVariable String userId,
            @PathVariable Integer percentage) {
        
        // First check if the learning plan exists
        LearningPlan plan = learningPlanService.getLearningPlanById(id);
        if (plan == null) {
            throw new ResourceNotFoundException("Learning plan not found with id: " + id);
        }
        
        // Update the progress
        Progress updatedProgress = progressService.updateProgressPercentage(userId, id, "LEARNING_PLAN", percentage);
        
        return ResponseEntity.ok(updatedProgress);
    }
    
    // Helper method to parse JSON arrays
    private List<String> parseJsonArray(String json) {
        try {
            if (json == null || json.trim().isEmpty()) {
                return new ArrayList<>();
            }
            return objectMapper.readValue(json, List.class);
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }
}
