package com.example.SkillWave.controller;

import com.example.SkillWave.model.PostComment;
import com.example.SkillWave.service.PostCommentService;
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
@RequestMapping("/api/comments")
@CrossOrigin(origins = "http://localhost:3000")
public class PostCommentController {
    
    @Autowired
    private PostCommentService commentService;
    
    // Get comments for a post
    @GetMapping("/post/{postId}")
    public ResponseEntity<List<PostComment>> getCommentsByPostId(@PathVariable Long postId) {
        List<PostComment> comments = commentService.getCommentsByPostId(postId);
        return ResponseEntity.ok(comments);
    }
    
    // Get comments for a post with pagination
    @GetMapping("/post/{postId}/paginated")
    public ResponseEntity<Map<String, Object>> getCommentsByPostIdPaginated(
            @PathVariable Long postId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        
        Sort.Direction sortDirection = direction.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        
        Page<PostComment> commentPage = commentService.getCommentsByPostId(postId, pageable);
        
        Map<String, Object> response = new HashMap<>();
        response.put("comments", commentPage.getContent());
        response.put("currentPage", commentPage.getNumber());
        response.put("totalItems", commentPage.getTotalElements());
        response.put("totalPages", commentPage.getTotalPages());
        
        return ResponseEntity.ok(response);
    }
    
    // Get comment by ID
    @GetMapping("/{id}")
    public ResponseEntity<PostComment> getCommentById(@PathVariable Long id) {
        try {
            PostComment comment = commentService.getCommentById(id);
            return ResponseEntity.ok(comment);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Create a new comment
    @PostMapping
    public ResponseEntity<PostComment> createComment(@RequestBody PostComment comment) {
        try {
            PostComment createdComment = commentService.createComment(comment);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdComment);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Update a comment
    @PutMapping("/{id}")
    public ResponseEntity<PostComment> updateComment(
            @PathVariable Long id, 
            @RequestBody PostComment comment,
            @RequestParam String userId) {
        try {
            // Verify the user is the owner of the comment
            if (!commentService.isCommentOwner(id, userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            PostComment updatedComment = commentService.updateComment(id, comment);
            return ResponseEntity.ok(updatedComment);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Delete a comment
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long id,
            @RequestParam String userId,
            @RequestParam(required = false) String postOwnerId) {
        try {
            // Check if the user is either the comment owner or the post owner
            boolean isCommentOwner = commentService.isCommentOwner(id, userId);
            boolean isPostOwner = (postOwnerId != null && postOwnerId.equals(userId));
            
            if (!isCommentOwner && !isPostOwner) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            commentService.deleteComment(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Get comments by user ID
    @GetMapping("/by-user/{userId}")
    public ResponseEntity<List<PostComment>> getCommentsByUserId(@PathVariable String userId) {
        List<PostComment> comments = commentService.getCommentsByUserId(userId);
        return ResponseEntity.ok(comments);
    }
    
    // Count comments for a post
    @GetMapping("/count/post/{postId}")
    public ResponseEntity<Map<String, Long>> countCommentsByPostId(@PathVariable Long postId) {
        long count = commentService.countCommentsByPostId(postId);
        Map<String, Long> response = new HashMap<>();
        response.put("count", count);
        return ResponseEntity.ok(response);
    }
}