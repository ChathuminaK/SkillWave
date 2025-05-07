package com.example.SkillWave.repository;

import com.example.SkillWave.model.Progress;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProgressRepository extends JpaRepository<Progress, Long> {
    
    Optional<Progress> findByUserIdAndContentIdAndContentType(String userId, Long contentId, String contentType);
    
    List<Progress> findByUserId(String userId);
    
    Page<Progress> findByUserId(String userId, Pageable pageable);
    
    List<Progress> findByUserIdAndContentType(String userId, String contentType);
    
    Page<Progress> findByUserIdAndContentType(String userId, String contentType, Pageable pageable);
    
    List<Progress> findByUserIdAndCompleted(String userId, Boolean completed);
    
    Page<Progress> findByUserIdAndCompleted(String userId, Boolean completed, Pageable pageable);
    
    @Query("SELECT p FROM Progress p WHERE p.userId = ?1 AND p.contentType = ?2 AND p.completed = ?3")
    Page<Progress> findUserProgressByTypeAndCompletion(String userId, String contentType, Boolean completed, Pageable pageable);
    
    @Query("SELECT AVG(p.progressPercentage) FROM Progress p WHERE p.userId = ?1 AND p.contentType = ?2")
    Double getAverageProgressByUserAndType(String userId, String contentType);
    
    long countByUserIdAndCompleted(String userId, Boolean completed);
    
    @Query("SELECT COUNT(p) FROM Progress p WHERE p.userId = ?1 AND p.progressPercentage > 0 AND p.progressPercentage < 100")
    long countInProgressByUser(String userId);
}