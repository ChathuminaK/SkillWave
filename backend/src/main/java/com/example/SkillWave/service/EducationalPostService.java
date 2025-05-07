package com.example.SkillWave.service;

import com.example.SkillWave.model.EducationalPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public interface EducationalPostService {
    
    // Basic CRUD operations
    List<EducationalPost> getAllPosts();
    Page<EducationalPost> getAllPosts(Pageable pageable);
    EducationalPost getPostById(Long id);
    EducationalPost createPost(EducationalPost post);
    EducationalPost updatePost(Long id, EducationalPost post);
    void deletePost(Long id);
    
    // Media operations
    EducationalPost createPostWithMedia(EducationalPost post, MultipartFile[] mediaFiles);
    EducationalPost updatePostWithMedia(Long id, EducationalPost post, MultipartFile[] mediaFiles);
    
    // Search and query operations
    List<EducationalPost> getPostsByUser(String userId);
    List<EducationalPost> getPostsByTag(String tag);
    List<EducationalPost> getPostsByCategory(String category);
    Page<EducationalPost> getPostsByCategory(String category, Pageable pageable);
    List<EducationalPost> searchPosts(String keyword);
    List<EducationalPost> getRecentPosts();
    List<EducationalPost> getPopularPosts();
    List<EducationalPost> getTrendingPosts();
    List<EducationalPost> getFeaturedPosts();
    
    // Like functionality
    EducationalPost likePost(Long postId, String userId);
    EducationalPost unlikePost(Long postId, String userId);
    boolean hasUserLikedPost(Long postId, String userId);
    
    // Advanced search
    Page<EducationalPost> advancedSearch(
        String category,
        String difficultyLevel,
        String tag,
        String keyword,
        Pageable pageable
    );
    
    // Analytics
    Map<String, Long> getCategoryCounts();
    List<Map<String, Object>> getMostUsedTags(int limit);
}