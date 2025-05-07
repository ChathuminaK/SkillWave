package com.example.SkillWave.service.impl;

import com.example.SkillWave.exception.ResourceNotFoundException;
import com.example.SkillWave.model.EducationalPost;
import com.example.SkillWave.repository.EducationalPostRepository;
import com.example.SkillWave.service.EducationalPostService;
import com.example.SkillWave.service.MediaService;
import com.example.SkillWave.service.PostCommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class EducationalPostServiceImpl implements EducationalPostService {
    
    @Autowired
    private EducationalPostRepository postRepository;
    
    @Autowired
    private MediaService mediaService;
    
    @Autowired
    private PostCommentService commentService;
    
    @Override
    public List<EducationalPost> getAllPosts() {
        return postRepository.findAll();
    }
    
    @Override
    public Page<EducationalPost> getAllPosts(Pageable pageable) {
        return postRepository.findAll(pageable);
    }
    
    @Override
    public EducationalPost getPostById(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + id));
    }
    
    @Override
    public EducationalPost createPost(EducationalPost post) {
        post.setCreatedAt(LocalDateTime.now());
        return postRepository.save(post);
    }
    
    @Override
    @Transactional
    public EducationalPost updatePost(Long id, EducationalPost post) {
        EducationalPost existingPost = getPostById(id);
        
        // Update fields
        existingPost.setTitle(post.getTitle());
        existingPost.setContent(post.getContent());
        existingPost.setTags(post.getTags());
        existingPost.setMediaUrls(post.getMediaUrls());
        existingPost.setDifficultyLevel(post.getDifficultyLevel());
        existingPost.setCategory(post.getCategory());
        existingPost.setEstimatedTime(post.getEstimatedTime());
        existingPost.setFeatured(post.getFeatured());
        
        // The PreUpdate will handle the updatedAt field
        
        return postRepository.save(existingPost);
    }
    
    @Override
    @Transactional
    public void deletePost(Long id) {
        EducationalPost post = getPostById(id);
        
        // Delete associated media files
        if (post.getMediaUrls() != null && !post.getMediaUrls().isEmpty()) {
            for (String mediaUrl : post.getMediaUrls()) {
                try {
                    mediaService.deleteFile(mediaUrl);
                } catch (Exception e) {
                    // Log error but continue
                    System.err.println("Error deleting media file: " + e.getMessage());
                }
            }
        }
        
        // Delete associated comments
        commentService.deleteAllCommentsForPost(id);
        
        // Delete the post
        postRepository.deleteById(id);
    }
    
    @Override
    public EducationalPost createPostWithMedia(EducationalPost post, MultipartFile[] mediaFiles) {
        // First save the post to get an ID
        post.setCreatedAt(LocalDateTime.now());
        EducationalPost savedPost = postRepository.save(post);
        
        // If there are media files, upload them
        if (mediaFiles != null && mediaFiles.length > 0) {
            try {
                List<String> mediaUrls = mediaService.uploadFiles(mediaFiles, "educational-posts", savedPost.getId());
                
                if (mediaUrls != null && !mediaUrls.isEmpty()) {
                    savedPost.setMediaUrls(mediaUrls);
                    savedPost = postRepository.save(savedPost);
                }
            } catch (Exception e) {
                System.err.println("Error uploading media files: " + e.getMessage());
            }
        }
        
        return savedPost;
    }
    
    @Override
    @Transactional
    public EducationalPost updatePostWithMedia(Long id, EducationalPost post, MultipartFile[] mediaFiles) {
        EducationalPost existingPost = getPostById(id);
        
        // Update basic fields
        existingPost.setTitle(post.getTitle());
        existingPost.setContent(post.getContent());
        existingPost.setTags(post.getTags());
        existingPost.setDifficultyLevel(post.getDifficultyLevel());
        existingPost.setCategory(post.getCategory());
        existingPost.setEstimatedTime(post.getEstimatedTime());
        existingPost.setFeatured(post.getFeatured());
        
        // Handle existing media URLs
        if (post.getMediaUrls() != null) {
            // Find URLs to delete (URLs in existing but not in update)
            List<String> urlsToDelete = existingPost.getMediaUrls().stream()
                    .filter(url -> !post.getMediaUrls().contains(url))
                    .collect(Collectors.toList());
            
            // Delete removed media files
            for (String url : urlsToDelete) {
                try {
                    mediaService.deleteFile(url);
                } catch (Exception e) {
                    System.err.println("Error deleting media file: " + e.getMessage());
                }
            }
            
            // Update the media URLs list
            existingPost.setMediaUrls(post.getMediaUrls());
        }
        
        // Save the post with updated fields (except new media)
        EducationalPost updatedPost = postRepository.save(existingPost);
        
        // If there are new media files, upload them
        if (mediaFiles != null && mediaFiles.length > 0) {
            try {
                List<String> newMediaUrls = mediaService.uploadFiles(mediaFiles, "educational-posts", id);
                
                if (newMediaUrls != null && !newMediaUrls.isEmpty()) {
                    // Add new URLs to existing ones
                    List<String> allMediaUrls = new ArrayList<>(updatedPost.getMediaUrls());
                    allMediaUrls.addAll(newMediaUrls);
                    updatedPost.setMediaUrls(allMediaUrls);
                    updatedPost = postRepository.save(updatedPost);
                }
            } catch (Exception e) {
                System.err.println("Error uploading new media files: " + e.getMessage());
            }
        }
        
        return updatedPost;
    }
    
    @Override
    public List<EducationalPost> getPostsByUser(String userId) {
        return postRepository.findByUserId(userId);
    }
    
    @Override
    public List<EducationalPost> getPostsByTag(String tag) {
        return postRepository.findByTagsContaining(tag);
    }
    
    @Override
    public List<EducationalPost> getPostsByCategory(String category) {
        return postRepository.findByCategory(category);
    }
    
    @Override
    public Page<EducationalPost> getPostsByCategory(String category, Pageable pageable) {
        return postRepository.findByCategory(category, pageable);
    }
    
    @Override
    public List<EducationalPost> searchPosts(String keyword) {
        return postRepository.searchByKeyword(keyword);
    }
    
    @Override
    public List<EducationalPost> getRecentPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc();
    }
    
    @Override
    public List<EducationalPost> getPopularPosts() {
        return postRepository.findAllByOrderByLikesCountDesc();
    }
    
    @Override
    public List<EducationalPost> getTrendingPosts() {
        // Get posts from the last 7 days
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        return postRepository.findTrendingPosts(sevenDaysAgo);
    }
    
    @Override
    public List<EducationalPost> getFeaturedPosts() {
        return postRepository.findByFeaturedTrue();
    }
    
    @Override
    @Transactional
    public EducationalPost likePost(Long postId, String userId) {
        EducationalPost post = getPostById(postId);
        
        // Add user to liked by set if not already there
        if (post.getLikedBy().add(userId)) {
            // Update likes count
            post.setLikesCount(post.getLikesCount() + 1);
            return postRepository.save(post);
        }
        
        return post; // No change if already liked
    }
    
    @Override
    @Transactional
    public EducationalPost unlikePost(Long postId, String userId) {
        EducationalPost post = getPostById(postId);
        
        // Remove user from liked by set if present
        if (post.getLikedBy().remove(userId)) {
            // Update likes count
            post.setLikesCount(post.getLikesCount() - 1);
            return postRepository.save(post);
        }
        
        return post; // No change if not liked
    }
    
    @Override
    public boolean hasUserLikedPost(Long postId, String userId) {
        EducationalPost post = getPostById(postId);
        return post.getLikedBy().contains(userId);
    }
    
    @Override
    public Page<EducationalPost> advancedSearch(
            String category, 
            String difficultyLevel, 
            String tag, 
            String keyword, 
            Pageable pageable) {
        return postRepository.advancedSearch(category, difficultyLevel, tag, keyword, pageable);
    }
    
    @Override
    public Map<String, Long> getCategoryCounts() {
        List<EducationalPost> allPosts = postRepository.findAll();
        Map<String, Long> categoryCounts = new HashMap<>();
        
        for (EducationalPost post : allPosts) {
            String category = post.getCategory();
            if (category != null) {
                categoryCounts.put(category, categoryCounts.getOrDefault(category, 0L) + 1);
            }
        }
        
        return categoryCounts;
    }
    
    @Override
    public List<Map<String, Object>> getMostUsedTags(int limit) {
        List<Object[]> tagCounts = postRepository.findMostUsedTags(Pageable.ofSize(limit));
        
        return tagCounts.stream().map(obj -> {
            Map<String, Object> result = new HashMap<>();
            result.put("tag", obj[0]);
            result.put("count", obj[1]);
            return result;
        }).collect(Collectors.toList());
    }
}