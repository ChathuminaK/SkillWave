package com.example.SkillWave.service.impl;

import com.example.SkillWave.exception.ResourceNotFoundException;
import com.example.SkillWave.model.Progress;
import com.example.SkillWave.repository.ProgressRepository;
import com.example.SkillWave.service.ProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ProgressServiceImpl implements ProgressService {

    @Autowired
    private ProgressRepository progressRepository;
    
    @Override
    public Progress createOrUpdateProgress(Progress progress) {
        if (progress.getId() == null) {
            progress.setCreatedAt(LocalDateTime.now());
        }
        
        progress.setLastAccessed(LocalDateTime.now());
        progress.setUpdatedAt(LocalDateTime.now());
        
        // Check if progress already exists for this user and content
        Optional<Progress> existingProgress = progressRepository
                .findByUserIdAndContentIdAndContentType(
                        progress.getUserId(), 
                        progress.getContentId(), 
                        progress.getContentType());
        
        if (existingProgress.isPresent()) {
            Progress existing = existingProgress.get();
            existing.setProgressPercentage(progress.getProgressPercentage());
            existing.setCompleted(progress.getCompleted());
            existing.setNotes(progress.getNotes());
            existing.setLastAccessed(LocalDateTime.now());
            existing.setUpdatedAt(LocalDateTime.now());
            return progressRepository.save(existing);
        }
        
        return progressRepository.save(progress);
    }

    @Override
    public Optional<Progress> getProgressById(Long id) {
        return progressRepository.findById(id);
    }

    @Override
    public Optional<Progress> getProgressByUserAndContent(String userId, Long contentId, String contentType) {
        return progressRepository.findByUserIdAndContentIdAndContentType(userId, contentId, contentType);
    }

    @Override
    public List<Progress> getAllProgressByUser(String userId) {
        return progressRepository.findByUserId(userId);
    }

    @Override
    public Page<Progress> getAllProgressByUser(String userId, Pageable pageable) {
        return progressRepository.findByUserId(userId, pageable);
    }

    @Override
    public List<Progress> getProgressByUserAndType(String userId, String contentType) {
        return progressRepository.findByUserIdAndContentType(userId, contentType);
    }

    @Override
    public Page<Progress> getProgressByUserAndType(String userId, String contentType, Pageable pageable) {
        return progressRepository.findByUserIdAndContentType(userId, contentType, pageable);
    }

    @Override
    public List<Progress> getCompletedProgress(String userId) {
        return progressRepository.findByUserIdAndCompleted(userId, true);
    }

    @Override
    public Page<Progress> getCompletedProgress(String userId, Pageable pageable) {
        return progressRepository.findByUserIdAndCompleted(userId, true, pageable);
    }

    @Override
    public Page<Progress> getProgressByTypeAndCompletion(String userId, String contentType, Boolean completed, Pageable pageable) {
        return progressRepository.findUserProgressByTypeAndCompletion(userId, contentType, completed, pageable);
    }

    @Override
    public Double getAverageProgressByUserAndType(String userId, String contentType) {
        Double average = progressRepository.getAverageProgressByUserAndType(userId, contentType);
        return average != null ? average : 0.0;
    }

    @Override
    public Map<String, Object> getProgressSummary(String userId) {
        Map<String, Object> summary = new HashMap<>();
        
        // Get counts
        long totalItems = progressRepository.countByUserIdAndCompleted(userId, true) + 
                          progressRepository.countByUserIdAndCompleted(userId, false);
        long completedItems = progressRepository.countByUserIdAndCompleted(userId, true);
        long inProgressItems = progressRepository.countInProgressByUser(userId);
        
        // Calculate overall completion percentage
        double overallPercentage = totalItems > 0 ? 
                ((double) completedItems / totalItems) * 100 : 0;
        
        // Get averages by content type
        Double avgEducationalPostProgress = progressRepository
                .getAverageProgressByUserAndType(userId, "EDUCATIONAL_POST");
        Double avgLearningPlanProgress = progressRepository
                .getAverageProgressByUserAndType(userId, "LEARNING_PLAN");
        
        // Build summary
        summary.put("totalItems", totalItems);
        summary.put("completedItems", completedItems);
        summary.put("inProgressItems", inProgressItems);
        summary.put("overallCompletionPercentage", Math.round(overallPercentage));
        summary.put("educationalPostProgress", avgEducationalPostProgress != null ? Math.round(avgEducationalPostProgress) : 0);
        summary.put("learningPlanProgress", avgLearningPlanProgress != null ? Math.round(avgLearningPlanProgress) : 0);
        
        return summary;
    }

    @Override
    public void deleteProgress(Long id) {
        progressRepository.deleteById(id);
    }

    @Override
    public Progress markAsCompleted(String userId, Long contentId, String contentType) {
        Progress progress = progressRepository
                .findByUserIdAndContentIdAndContentType(userId, contentId, contentType)
                .orElse(new Progress());
        
        progress.setUserId(userId);
        progress.setContentId(contentId);
        progress.setContentType(contentType);
        progress.setProgressPercentage(100);
        progress.setCompleted(true);
        progress.setLastAccessed(LocalDateTime.now());
        
        return createOrUpdateProgress(progress);
    }

    @Override
    public Progress updateProgressPercentage(String userId, Long contentId, String contentType, Integer percentage) {
        if (percentage < 0 || percentage > 100) {
            throw new IllegalArgumentException("Progress percentage must be between 0 and 100");
        }
        
        Progress progress = progressRepository
                .findByUserIdAndContentIdAndContentType(userId, contentId, contentType)
                .orElse(new Progress());
        
        progress.setUserId(userId);
        progress.setContentId(contentId);
        progress.setContentType(contentType);
        progress.setProgressPercentage(percentage);
        progress.setCompleted(percentage == 100);
        progress.setLastAccessed(LocalDateTime.now());
        
        return createOrUpdateProgress(progress);
    }

    @Override
    public Progress resetProgress(String userId, Long contentId, String contentType) {
        Progress progress = progressRepository
                .findByUserIdAndContentIdAndContentType(userId, contentId, contentType)
                .orElseThrow(() -> new ResourceNotFoundException("Progress not found"));
        
        progress.setProgressPercentage(0);
        progress.setCompleted(false);
        progress.setLastAccessed(LocalDateTime.now());
        
        return progressRepository.save(progress);
    }

    @Override
    public Page<Progress> getLearningPlanProgress(String userId, Pageable pageable) {
        return progressRepository.findByUserIdAndContentType(userId, "LEARNING_PLAN", pageable);
    }
}