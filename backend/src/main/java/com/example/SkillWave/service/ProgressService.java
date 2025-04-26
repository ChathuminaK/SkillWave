package com.example.SkillWave.service;

import com.example.SkillWave.model.Progress;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface ProgressService {
    
    Progress createOrUpdateProgress(Progress progress);
    
    Optional<Progress> getProgressById(Long id);
    
    Optional<Progress> getProgressByUserAndContent(String userId, Long contentId, String contentType);
    
    List<Progress> getAllProgressByUser(String userId);
    
    Page<Progress> getAllProgressByUser(String userId, Pageable pageable);
    
    List<Progress> getProgressByUserAndType(String userId, String contentType);
    
    Page<Progress> getProgressByUserAndType(String userId, String contentType, Pageable pageable);
    
    List<Progress> getCompletedProgress(String userId);
    
    Page<Progress> getCompletedProgress(String userId, Pageable pageable);
    
    Page<Progress> getProgressByTypeAndCompletion(String userId, String contentType, Boolean completed, Pageable pageable);
    
    Double getAverageProgressByUserAndType(String userId, String contentType);
    
    Map<String, Object> getProgressSummary(String userId);
    
    void deleteProgress(Long id);
    
    Progress markAsCompleted(String userId, Long contentId, String contentType);
    
    Progress updateProgressPercentage(String userId, Long contentId, String contentType, Integer percentage);
    
    Progress resetProgress(String userId, Long contentId, String contentType);
}