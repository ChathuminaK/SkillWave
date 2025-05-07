package com.example.SkillWave.service;

import com.example.SkillWave.model.PostComment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface PostCommentService {
    
    // Basic CRUD operations
    List<PostComment> getCommentsByPostId(Long postId);
    Page<PostComment> getCommentsByPostId(Long postId, Pageable pageable);
    PostComment getCommentById(Long id);
    PostComment createComment(PostComment comment);
    PostComment updateComment(Long id, PostComment comment);
    void deleteComment(Long id);
    
    // User-specific operations
    List<PostComment> getCommentsByUserId(String userId);
    boolean isCommentOwner(Long commentId, String userId);
    
    // Additional operations
    long countCommentsByPostId(Long postId);
    void deleteAllCommentsForPost(Long postId);
}