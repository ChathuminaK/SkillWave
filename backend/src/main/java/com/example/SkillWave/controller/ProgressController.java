package com.example.SkillWave.controller;

import com.example.SkillWave.exception.ResourceNotFoundException;
import com.example.SkillWave.model.Progress;
import com.example.SkillWave.service.ProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/progress")
@CrossOrigin(origins = "http://localhost:3000")
public class ProgressController {
    
    @Autowired
    private ProgressService progressService;
    
    @PostMapping
    public ResponseEntity<?> createProgress(@RequestBody Progress progress) {
        // Validate required fields
        if (progress.getUserId() == null || progress.getContentId() == null || 
            progress.getContentType() == null) {
            return ResponseEntity.badRequest().body("userId, contentId, and contentType are required");
        }
        
        // Set default values if they're not provided
        if (progress.getProgressPercentage() == null) {
            progress.setProgressPercentage(0);
        }
        if (progress.getCompleted() == null) {
            progress.setCompleted(false);
        }
        
        try {
            Progress savedProgress = progressService.createOrUpdateProgress(progress);
            return new ResponseEntity<>(savedProgress, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create progress: " + e.getMessage());
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getProgressById(@PathVariable Long id) {
        try {
            Progress progress = progressService.getProgressById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Progress not found with id: " + id));
            return ResponseEntity.ok(progress);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch progress: " + e.getMessage());
        }
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getUserProgress(
            @PathVariable String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "lastAccessed") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        
        Sort.Direction sortDirection = direction.equalsIgnoreCase("asc") ? 
                Sort.Direction.ASC : Sort.Direction.DESC;
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        Page<Progress> progressPage = progressService.getAllProgressByUser(userId, pageable);
        
        Map<String, Object> response = new HashMap<>();
        response.put("progress", progressPage.getContent());
        response.put("currentPage", progressPage.getNumber());
        response.put("totalItems", progressPage.getTotalElements());
        response.put("totalPages", progressPage.getTotalPages());
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/user/{userId}/content/{contentId}/type/{contentType}")
    public ResponseEntity<Progress> getUserContentProgress(
            @PathVariable String userId,
            @PathVariable Long contentId,
            @PathVariable String contentType) {
        
        Progress progress = progressService.getProgressByUserAndContent(userId, contentId, contentType)
                .orElse(new Progress());
        
        // If no progress exists yet, initialize basic information
        if (progress.getId() == null) {
            progress.setUserId(userId);
            progress.setContentId(contentId);
            progress.setContentType(contentType);
            progress.setProgressPercentage(0);
            progress.setCompleted(false);
        }
        
        return ResponseEntity.ok(progress);
    }
    
    @GetMapping("/user/{userId}/type/{contentType}")
    public ResponseEntity<Map<String, Object>> getUserProgressByType(
            @PathVariable String userId,
            @PathVariable String contentType,
            @RequestParam(required = false) Boolean completed,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "lastAccessed") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        
        Sort.Direction sortDirection = direction.equalsIgnoreCase("asc") ? 
                Sort.Direction.ASC : Sort.Direction.DESC;
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        Page<Progress> progressPage;
        
        if (completed != null) {
            progressPage = progressService.getProgressByTypeAndCompletion(userId, contentType, completed, pageable);
        } else {
            progressPage = progressService.getProgressByUserAndType(userId, contentType, pageable);
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("progress", progressPage.getContent());
        response.put("currentPage", progressPage.getNumber());
        response.put("totalItems", progressPage.getTotalElements());
        response.put("totalPages", progressPage.getTotalPages());
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/user/{userId}/completed")
    public ResponseEntity<Map<String, Object>> getCompletedProgress(
            @PathVariable String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "lastAccessed"));
        Page<Progress> progressPage = progressService.getCompletedProgress(userId, pageable);
        
        Map<String, Object> response = new HashMap<>();
        response.put("progress", progressPage.getContent());
        response.put("currentPage", progressPage.getNumber());
        response.put("totalItems", progressPage.getTotalElements());
        response.put("totalPages", progressPage.getTotalPages());
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/user/{userId}/summary")
    public ResponseEntity<Map<String, Object>> getProgressSummary(@PathVariable String userId) {
        Map<String, Object> summary = progressService.getProgressSummary(userId);
        return ResponseEntity.ok(summary);
    }
    
    @GetMapping("/user/{userId}/learning-plans")
    public ResponseEntity<Map<String, Object>> getLearningPlanProgress(
            @PathVariable String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "lastAccessed"));
        Page<Progress> progressPage = progressService.getLearningPlanProgress(userId, pageable);
        
        Map<String, Object> response = new HashMap<>();
        response.put("progress", progressPage.getContent());
        response.put("currentPage", progressPage.getNumber());
        response.put("totalItems", progressPage.getTotalElements());
        response.put("totalPages", progressPage.getTotalPages());
        
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProgress(
            @PathVariable Long id,
            @RequestBody Progress progressDetails) {
        try {
            Progress progress = progressService.getProgressById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Progress not found with id: " + id));
            
            // Update fields, but only if provided in the request
            if (progressDetails.getProgressPercentage() != null) {
                progress.setProgressPercentage(progressDetails.getProgressPercentage());
            }
            if (progressDetails.getCompleted() != null) {
                progress.setCompleted(progressDetails.getCompleted());
            }
            if (progressDetails.getNotes() != null) {
                progress.setNotes(progressDetails.getNotes());
            }
            
            Progress updatedProgress = progressService.createOrUpdateProgress(progress);
            return ResponseEntity.ok(updatedProgress);
        } catch (ResourceNotFoundException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage() != null ? e.getMessage() : "Failed to update progress");
            return ResponseEntity.status(500).body(error);
        }
    }
    
    @PutMapping("/user/{userId}/content/{contentId}/type/{contentType}/percentage/{percentage}")
    public ResponseEntity<?> updateProgressPercentage(
            @PathVariable String userId,
            @PathVariable Long contentId,
            @PathVariable String contentType,
            @PathVariable Integer percentage) {
        try {
            Progress updatedProgress = progressService.updateProgressPercentage(userId, contentId, contentType, percentage);
            return ResponseEntity.ok(updatedProgress);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage() != null ? e.getMessage() : "Failed to update progress percentage");
            return ResponseEntity.status(500).body(error);
        }
    }
    
    @PutMapping("/user/{userId}/content/{contentId}/type/{contentType}/complete")
    public ResponseEntity<?> markAsCompleted(
            @PathVariable String userId,
            @PathVariable Long contentId,
            @PathVariable String contentType) {
        try {
            Progress progress = progressService.markAsCompleted(userId, contentId, contentType);
            return ResponseEntity.ok(progress);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage() != null ? e.getMessage() : "Failed to mark as completed");
            return ResponseEntity.status(500).body(error);
        }
    }
    
    @PutMapping("/user/{userId}/content/{contentId}/type/{contentType}/reset")
    public ResponseEntity<?> resetProgress(
            @PathVariable String userId,
            @PathVariable Long contentId,
            @PathVariable String contentType) {
        try {
            Progress progress = progressService.resetProgress(userId, contentId, contentType);
            return ResponseEntity.ok(progress);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage() != null ? e.getMessage() : "Failed to reset progress");
            return ResponseEntity.status(500).body(error);
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProgress(@PathVariable Long id) {
        try {
            progressService.deleteProgress(id);
            Map<String, Boolean> response = new HashMap<>();
            response.put("deleted", Boolean.TRUE);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage() != null ? e.getMessage() : "Failed to delete progress");
            return ResponseEntity.status(500).body(error);
        }
    }
}