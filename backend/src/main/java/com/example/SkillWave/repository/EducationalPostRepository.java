package com.example.SkillWave.repository;

import com.example.SkillWave.model.EducationalPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EducationalPostRepository extends JpaRepository<EducationalPost, Long> {
    
    // Find posts by user ID
    List<EducationalPost> findByUserId(String userId);
    
    // Find posts by username
    List<EducationalPost> findByUserNameContainingIgnoreCase(String userName);
    
    // Find posts by tag
    List<EducationalPost> findByTagsContaining(String tag);
    
    // Find posts by category
    List<EducationalPost> findByCategory(String category);
    
    // Find posts by difficulty level
    List<EducationalPost> findByDifficultyLevel(String difficultyLevel);
    
    // Search posts by title or content
    @Query("SELECT p FROM EducationalPost p WHERE LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(p.content) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<EducationalPost> searchByKeyword(@Param("keyword") String keyword);
    
    // Find posts with pageable support for pagination
    Page<EducationalPost> findAll(Pageable pageable);
    
    // Find posts by category with pagination
    Page<EducationalPost> findByCategory(String category, Pageable pageable);
    
    // Find recent posts
    List<EducationalPost> findAllByOrderByCreatedAtDesc();
    
    // Find recent posts with pagination
    Page<EducationalPost> findAllByOrderByCreatedAtDesc(Pageable pageable);
    
    // Find popular posts (most liked)
    List<EducationalPost> findAllByOrderByLikesCountDesc();
    
    // Find trending posts (combination of recent and popular)
    @Query("SELECT p FROM EducationalPost p WHERE p.createdAt >= :sinceDate ORDER BY p.likesCount DESC, p.commentsCount DESC")
    List<EducationalPost> findTrendingPosts(@Param("sinceDate") LocalDateTime sinceDate);
    
    // Find featured posts
    List<EducationalPost> findByFeaturedTrue();
    
    // Find posts with media
    @Query("SELECT p FROM EducationalPost p WHERE SIZE(p.mediaUrls) > 0")
    List<EducationalPost> findPostsWithMedia();
    
    // Count posts by category
    long countByCategory(String category);
    
    // Find most used tags
    @Query("SELECT t, COUNT(t) FROM EducationalPost p JOIN p.tags t GROUP BY t ORDER BY COUNT(t) DESC")
    List<Object[]> findMostUsedTags(Pageable pageable);
    
    // Advanced search with multiple criteria
    @Query("SELECT p FROM EducationalPost p WHERE " +
           "(:category IS NULL OR p.category = :category) AND " +
           "(:difficultyLevel IS NULL OR p.difficultyLevel = :difficultyLevel) AND " +
           "(:tag IS NULL OR :tag MEMBER OF p.tags) AND " +
           "(:keyword IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.content) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<EducationalPost> advancedSearch(
        @Param("category") String category,
        @Param("difficultyLevel") String difficultyLevel,
        @Param("tag") String tag,
        @Param("keyword") String keyword,
        Pageable pageable
    );
}