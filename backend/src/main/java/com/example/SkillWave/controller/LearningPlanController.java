package com.example.SkillWave.controller;

import com.example.SkillWave.model.LearningPlan;
import com.example.SkillWave.model.Progress;
import com.example.SkillWave.service.LearningPlanService;
import com.example.SkillWave.service.MediaService;
import com.example.SkillWave.service.ProgressService;
import com.example.SkillWave.repository.LearningPlanRepository;
import com.example.SkillWave.exception.ResourceNotFoundException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
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

    @Autowired
    private LearningPlanRepository learningPlanRepository;

    @GetMapping
    public List<LearningPlan> getAllLearningPlans() {
        return learningPlanService.getAllLearningPlans();
    }

    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    public ResponseEntity<LearningPlan> getLearningPlanById(@PathVariable Long id) {
        LearningPlan learningPlan = learningPlanService.getLearningPlanById(id);
        // Initialize collections to prevent LazyInitializationException
        if (learningPlan.getTopics() != null) {
            learningPlan.getTopics().size(); // Force initialization
        }
        if (learningPlan.getResources() != null) {
            learningPlan.getResources().size(); // Force initialization
        }
        if (learningPlan.getMediaUrls() != null) {
            learningPlan.getMediaUrls().size(); // Force initialization
        }
        return ResponseEntity.ok(learningPlan);
    }

    @PostMapping
    public ResponseEntity<LearningPlan> createLearningPlan(@RequestBody LearningPlan learningPlan) {
        learningPlan.setTimeline(learningPlan.getTimeline());
        return ResponseEntity.ok(learningPlanService.createLearningPlan(learningPlan));
    }
    
    @PostMapping("/with-media")
    public ResponseEntity<?> createLearningPlanWithMedia(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("topics") String topicsJson,
            @RequestParam("resources") String resourcesJson,
            @RequestParam("timeline") String timeline,
            @RequestParam(value = "userId", required = false) String userId,
            @RequestParam(value = "user_id", required = false) String user_id,
            @RequestParam(value = "userName", required = false) String userName,
            @RequestParam(value = "user_name", required = false) String user_name,
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
            // Set user info from either camelCase or snake_case
            learningPlan.setUserId(userId != null ? userId : user_id);
            learningPlan.setUserName(userName != null ? userName : user_name);
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
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage() != null ? e.getMessage() : "Failed to create learning plan");
            return ResponseEntity.status(500).body(error);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<LearningPlan> updateLearningPlan(@PathVariable Long id, @RequestBody LearningPlan learningPlan) {
        LearningPlan updatedPlan = learningPlanService.updateLearningPlan(id, learningPlan);
        updatedPlan.setTimeline(learningPlan.getTimeline() != null ? learningPlan.getTimeline() : "");
        return ResponseEntity.ok(updatedPlan);
    }
    
    @PutMapping("/{id}/with-media")
    public ResponseEntity<?> updateLearningPlanWithMedia(
            @PathVariable Long id,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("topics") String topicsJson,
            @RequestParam("resources") String resourcesJson,
            @RequestParam("timeline") String timeline,
            @RequestParam(value = "userId", required = false) String userId,
            @RequestParam(value = "user_id", required = false) String user_id,
            @RequestParam(value = "userName", required = false) String userName,
            @RequestParam(value = "user_name", required = false) String user_name,
            @RequestParam(value = "existingMedia", required = false) String existingMediaJson,
            @RequestParam(value = "media", required = false) MultipartFile[] mediaFiles) {
        System.out.println("Updating learning plan ID: " + id);
        try {
            if (id == null) {
                return ResponseEntity.badRequest().body("Learning plan ID cannot be null");
            }
            boolean exists = learningPlanService.existsById(id);
            if (!exists) {
                return ResponseEntity.status(404).body("Learning plan not found with id: " + id);
            }
            LearningPlan existingPlan = learningPlanService.getLearningPlanById(id);
            if (existingPlan == null) {
                return ResponseEntity.status(404).body("Learning plan not found with id: " + id);
            }
            
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
            existingPlan.setTitle(title != null ? title : "");
            existingPlan.setDescription(description != null ? description : "");
            
            // Handle topics carefully by clearing and re-adding
            existingPlan.getTopics().clear();
            existingPlan.getTopics().addAll(topics);
            
            existingPlan.setResources(resources);
            existingPlan.setTimeline(timeline != null ? timeline : "");
            // Set user info from either camelCase or snake_case
            existingPlan.setUserId(userId != null ? userId : user_id);
            existingPlan.setUserName(userName != null ? userName : user_name);
            if (existingPlan.getMediaUrls() == null) {
                existingPlan.setMediaUrls(new ArrayList<>());
            }
            List<String> deletedMediaUrls = new ArrayList<>();
            for (String url : existingPlan.getMediaUrls()) {
                if (!existingMediaUrls.contains(url)) {
                    deletedMediaUrls.add(url);
                }
            }
            for (String url : deletedMediaUrls) {
                try {
                    mediaService.deleteFile(url);
                } catch (Exception e) {
                    System.err.println("Error deleting file: " + url);
                    e.printStackTrace();
                }
            }
            existingPlan.setMediaUrls(new ArrayList<>(existingMediaUrls));
            if (mediaFiles != null && mediaFiles.length > 0) {
                try {
                    System.out.println("Uploading " + mediaFiles.length + " new media files");
                    List<MultipartFile> validFiles = new ArrayList<>();
                    for (MultipartFile file : mediaFiles) {
                        if (file != null && !file.isEmpty()) {
                            validFiles.add(file);
                        }
                    }
                    if (!validFiles.isEmpty()) {
                        MultipartFile[] validFilesArray = validFiles.toArray(new MultipartFile[0]);
                        List<String> newMediaUrls = mediaService.uploadFiles(validFilesArray, "learning-plans", id);
                        if (newMediaUrls != null && !newMediaUrls.isEmpty()) {
                            List<String> allMediaUrls = new ArrayList<>(existingPlan.getMediaUrls());
                            allMediaUrls.addAll(newMediaUrls);
                            existingPlan.setMediaUrls(allMediaUrls);
                        }
                    }
                } catch (Exception e) {
                    System.err.println("Error processing new media files: " + e.getMessage());
                    e.printStackTrace();
                }
            }
            LearningPlan updatedPlan = learningPlanService.updateLearningPlan(id, existingPlan);
            return ResponseEntity.ok(updatedPlan);
        } catch (Exception e) {
            System.err.println("Error updating learning plan with media: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to update learning plan with media: " + e.getMessage());
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
    
    @GetMapping("/repair-database")
    public ResponseEntity<Map<String, Object>> repairDatabase() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Check if learning plan with ID 3 exists
            boolean planExists = learningPlanService.existsById(3L);
            response.put("planWithId3Exists", planExists);
            
            if (!planExists) {
                // Create temporary plan if needed
                LearningPlan tempPlan = new LearningPlan();
                tempPlan.setId(3L);  // Force ID (note: this might not work with all JPA providers)
                tempPlan.setTitle("Temporary Plan");
                tempPlan.setDescription("This plan was created to fix database integrity issues");
                tempPlan.setUserId("admin");
                
                try {
                    learningPlanRepository.save(tempPlan);
                    response.put("tempPlanCreated", true);
                } catch (Exception e) {
                    response.put("tempPlanCreationError", e.getMessage());
                }
            }
            
            // Return useful debugging info
            response.put("status", "success");
            response.put("message", "Database repair operation completed");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    // Helper method to parse JSON arrays
    private List<String> parseJsonArray(String json) {
        try {
            if (json == null || json.trim().isEmpty()) {
                return new ArrayList<>();
            }
            return objectMapper.readValue(json, objectMapper.getTypeFactory().constructCollectionType(List.class, String.class));
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }
}
