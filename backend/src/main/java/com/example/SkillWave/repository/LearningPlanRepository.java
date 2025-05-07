package com.example.SkillWave.repository;

import com.example.SkillWave.model.LearningPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LearningPlanRepository extends JpaRepository<LearningPlan, Long> {

    // Find plans by user ID
    List<LearningPlan> findByUserId(String userId);
    
    // Find plans by username (case insensitive)
    List<LearningPlan> findByUserNameContainingIgnoreCase(String userName);
    
    // Find plans containing specific topic
    List<LearningPlan> findByTopicsContaining(String topic);
    
    // Search plans by title or description
    @Query("SELECT p FROM LearningPlan p WHERE LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<LearningPlan> searchByKeyword(@Param("keyword") String keyword);
    
    // Find recent plans, ordered by creation date
    List<LearningPlan> findAllByOrderByCreatedAtDesc();
    
    // Find plans with media
    @Query("SELECT p FROM LearningPlan p WHERE SIZE(p.mediaUrls) > 0")
    List<LearningPlan> findPlansWithMedia();
    
    // Find plans by topic and with media
    @Query("SELECT p FROM LearningPlan p WHERE :topic MEMBER OF p.topics AND SIZE(p.mediaUrls) > 0")
    List<LearningPlan> findByTopicWithMedia(@Param("topic") String topic);
    
    // Find plans created within a specific date range
    List<LearningPlan> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    // Find plans by multiple topics (containing any of the topics)
    @Query("SELECT p FROM LearningPlan p WHERE EXISTS (SELECT t FROM p.topics t WHERE t IN :topics)")
    List<LearningPlan> findByTopicsIn(@Param("topics") List<String> topics);
    
    // Find most popular topics across all learning plans
    @Query(value = "SELECT t, COUNT(t) as count FROM LearningPlan p JOIN p.topics t GROUP BY t ORDER BY count DESC")
    List<Object[]> findMostPopularTopics();
    
    // Find plans with resources containing specific resource
    @Query("SELECT p FROM LearningPlan p WHERE EXISTS (SELECT r FROM p.resources r WHERE LOWER(r) LIKE LOWER(CONCAT('%', :resource, '%')))")
    List<LearningPlan> findByResourceContaining(@Param("resource") String resource);
    
    // Count plans by topic
    @Query("SELECT COUNT(p) FROM LearningPlan p WHERE :topic MEMBER OF p.topics")
    Long countByTopic(@Param("topic") String topic);
    
    // Find featured plans (can be customized based on your featured criteria)
    @Query("SELECT p FROM LearningPlan p WHERE SIZE(p.mediaUrls) > 0 ORDER BY p.createdAt DESC")
    List<LearningPlan> findFeaturedPlans();
}
