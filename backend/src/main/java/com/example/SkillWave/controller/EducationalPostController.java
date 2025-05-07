package com.example.SkillWave.controller;

import com.example.SkillWave.model.EducationalPost;
import com.example.SkillWave.model.Progress;
import com.example.SkillWave.service.EducationalPostService;
import com.example.SkillWave.service.ProgressService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/educational-posts")
@CrossOrigin(origins = "http://localhost:3000")
public class EducationalPostController {
    
    @Autowired
    private EducationalPostService postService;
    
    @Autowired
    private ProgressService progressService;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    // Get all posts with pagination
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        
        Sort.Direction sortDirection = direction.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        
        Page<EducationalPost> postPage = postService.getAllPosts(pageable);
        
        Map<String, Object> response = new HashMap<>();
        response.put("posts", postPage.getContent());
        response.put("currentPage", postPage.getNumber());
        response.put("totalItems", postPage.getTotalElements());
        response.put("totalPages", postPage.getTotalPages());
        
        return ResponseEntity.ok(response);
    }
    
    // Get post by ID
    @GetMapping("/{id}")
    public ResponseEntity<EducationalPost> getPostById(@PathVariable Long id) {
        try {
            EducationalPost post = postService.getPostById(id);
            return ResponseEntity.ok(post);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Create a new post
    @PostMapping
    public ResponseEntity<EducationalPost> createPost(@RequestBody EducationalPost post) {
        EducationalPost createdPost = postService.createPost(post);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPost);
    }
    
    // Create a post with media
    @PostMapping("/with-media")
    public ResponseEntity<EducationalPost> createPostWithMedia(
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam(value = "tags", required = false) String tagsJson,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "difficultyLevel", required = false) String difficultyLevel,
            @RequestParam(value = "estimatedTime", required = false) String estimatedTime,
            @RequestParam(value = "userId", required = false) String userId,
            @RequestParam(value = "userName", required = false) String userName,
            @RequestParam(value = "media", required = false) MultipartFile[] mediaFiles) {
        
        try {
            // Create post object
            EducationalPost post = new EducationalPost();
            post.setTitle(title);
            post.setContent(content);
            post.setCategory(category);
            post.setDifficultyLevel(difficultyLevel);
            post.setEstimatedTime(estimatedTime);
            post.setUserId(userId);
            post.setUserName(userName);
            
            // Parse tags if provided
            if (tagsJson != null && !tagsJson.isEmpty()) {
                List<String> tags = objectMapper.readValue(tagsJson, List.class);
                post.setTags(tags);
            }
            
            // Create post with media
            EducationalPost createdPost = postService.createPostWithMedia(post, mediaFiles);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdPost);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Update a post
    @PutMapping("/{id}")
    public ResponseEntity<EducationalPost> updatePost(@PathVariable Long id, @RequestBody EducationalPost post) {
        try {
            EducationalPost updatedPost = postService.updatePost(id, post);
            return ResponseEntity.ok(updatedPost);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Update a post with media
    @PutMapping("/{id}/with-media")
    public ResponseEntity<EducationalPost> updatePostWithMedia(
            @PathVariable Long id,
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam(value = "tags", required = false) String tagsJson,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "difficultyLevel", required = false) String difficultyLevel,
            @RequestParam(value = "estimatedTime", required = false) String estimatedTime,
            @RequestParam(value = "existingMedia", required = false) String existingMediaJson,
            @RequestParam(value = "media", required = false) MultipartFile[] mediaFiles) {
        
        try {
            // Create post object with updated values
            EducationalPost post = new EducationalPost();
            post.setTitle(title);
            post.setContent(content);
            post.setCategory(category);
            post.setDifficultyLevel(difficultyLevel);
            post.setEstimatedTime(estimatedTime);
            
            // Parse JSON values
            if (tagsJson != null && !tagsJson.isEmpty()) {
                List<String> tags = objectMapper.readValue(tagsJson, List.class);
                post.setTags(tags);
            }
            
            if (existingMediaJson != null && !existingMediaJson.isEmpty()) {
                List<String> existingMedia = objectMapper.readValue(existingMediaJson, List.class);
                post.setMediaUrls(existingMedia);
            }
            
            // Update post with media
            EducationalPost updatedPost = postService.updatePostWithMedia(id, post, mediaFiles);
            return ResponseEntity.ok(updatedPost);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Delete a post
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        try {
            postService.deletePost(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get posts by user ID
    // get post
    @GetMapping("/by-user/{userId}")
    public ResponseEntity<List<EducationalPost>> getPostsByUser(@PathVariable String userId) {
        List<EducationalPost> posts = postService.getPostsByUser(userId);
        return ResponseEntity.ok(posts);
    }
    
    // Get posts by tag
    @GetMapping("/by-tag/{tag}")
    public ResponseEntity<List<EducationalPost>> getPostsByTag(@PathVariable String tag) {
        List<EducationalPost> posts = postService.getPostsByTag(tag);
        return ResponseEntity.ok(posts);
    }
    
    // Get posts by category with pagination

    //get post
    @GetMapping("/by-category/{category}")
    public ResponseEntity<Map<String, Object>> getPostsByCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<EducationalPost> postPage = postService.getPostsByCategory(category, pageable);
        
        Map<String, Object> response = new HashMap<>();
        response.put("posts", postPage.getContent());
        response.put("currentPage", postPage.getNumber());
        response.put("totalItems", postPage.getTotalElements());
        response.put("totalPages", postPage.getTotalPages());
        
        return ResponseEntity.ok(response);
    }
    
    // Search posts

    // search

    @GetMapping("/search")
    public ResponseEntity<List<EducationalPost>> searchPosts(@RequestParam String keyword) {
        List<EducationalPost> posts = postService.searchPosts(keyword);
        return ResponseEntity.ok(posts);
    }
    
    // Advanced search with pagination
    @GetMapping("/advanced-search")
    public ResponseEntity<Map<String, Object>> advancedSearch(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String difficultyLevel,
            @RequestParam(required = false) String tag,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        
        Sort.Direction sortDirection = direction.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        
        Page<EducationalPost> postPage = postService.advancedSearch(category, difficultyLevel, tag, keyword, pageable);
        
        Map<String, Object> response = new HashMap<>();
        response.put("posts", postPage.getContent());
        response.put("currentPage", postPage.getNumber());
        response.put("totalItems", postPage.getTotalElements());
        response.put("totalPages", postPage.getTotalPages());
        
        return ResponseEntity.ok(response);
    }
    
    // Get recent posts
    @GetMapping("/recent")
    public ResponseEntity<List<EducationalPost>> getRecentPosts() {
        List<EducationalPost> posts = postService.getRecentPosts();
        return ResponseEntity.ok(posts);
    }
    
    // Get popular posts
    @GetMapping("/popular")
    public ResponseEntity<List<EducationalPost>> getPopularPosts() {
        List<EducationalPost> posts = postService.getPopularPosts();
        return ResponseEntity.ok(posts);
    }
    
    // Get trending posts
    @GetMapping("/trending")
    public ResponseEntity<List<EducationalPost>> getTrendingPosts() {
        List<EducationalPost> posts = postService.getTrendingPosts();
        return ResponseEntity.ok(posts);
    }
    
    // Get featured posts
    @GetMapping("/featured")
    public ResponseEntity<List<EducationalPost>> getFeaturedPosts() {
        List<EducationalPost> posts = postService.getFeaturedPosts();
        return ResponseEntity.ok(posts);
    }
    
    // Like a post
    @PostMapping("/{id}/like")
    public ResponseEntity<EducationalPost> likePost(
            @PathVariable Long id, 
            @RequestParam String userId) {
        try {
            EducationalPost post = postService.likePost(id, userId);
            return ResponseEntity.ok(post);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Unlike a post
    @PostMapping("/{id}/unlike")
    public ResponseEntity<EducationalPost> unlikePost(
            @PathVariable Long id, 
            @RequestParam String userId) {
        try {
            EducationalPost post = postService.unlikePost(id, userId);
            return ResponseEntity.ok(post);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Check if user has liked a post
    @GetMapping("/{id}/has-liked")
    public ResponseEntity<Map<String, Boolean>> hasUserLikedPost(
            @PathVariable Long id, 
            @RequestParam String userId) {
        try {
            boolean hasLiked = postService.hasUserLikedPost(id, userId);
            Map<String, Boolean> response = new HashMap<>();
            response.put("hasLiked", hasLiked);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get category counts
    @GetMapping("/analytics/category-counts")
    public ResponseEntity<Map<String, Long>> getCategoryCounts() {
        Map<String, Long> categoryCounts = postService.getCategoryCounts();
        return ResponseEntity.ok(categoryCounts);
    }
    
    // Get most used tags
    @GetMapping("/analytics/most-used-tags")
    public ResponseEntity<List<Map<String, Object>>> getMostUsedTags(
            @RequestParam(defaultValue = "10") int limit) {
        List<Map<String, Object>> tags = postService.getMostUsedTags(limit);
        return ResponseEntity.ok(tags);
    }
    
    @GetMapping("/{id}/progress/{userId}")
    public ResponseEntity<?> getPostProgressForUser(
            @PathVariable Long id, 
            @PathVariable String userId) {
        
        // First check if the post exists
        EducationalPost post = postService.getPostById(id);
        
        // Then get or initialize the progress
        Progress progress = progressService.getProgressByUserAndContent(userId, id, "EDUCATIONAL_POST")
                .orElse(new Progress());
        
        // If no progress exists yet, initialize basic information
        if (progress.getId() == null) {
            progress.setUserId(userId);
            progress.setContentId(id);
            progress.setContentType("EDUCATIONAL_POST");
            progress.setProgressPercentage(0);
            progress.setCompleted(false);
        }
        
        // Return a response combining post and progress data
        Map<String, Object> response = new HashMap<>();
        response.put("post", post);
        response.put("progress", progress);
        
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/progress/{userId}/{percentage}")
    public ResponseEntity<Progress> updatePostProgress(
            @PathVariable Long id,
            @PathVariable String userId,
            @PathVariable Integer percentage) {
        
        // First check if the post exists
        EducationalPost post = postService.getPostById(id);
        
        // Update the progress
        Progress updatedProgress = progressService.updateProgressPercentage(userId, id, "EDUCATIONAL_POST", percentage);
        
        return ResponseEntity.ok(updatedProgress);
    }
}