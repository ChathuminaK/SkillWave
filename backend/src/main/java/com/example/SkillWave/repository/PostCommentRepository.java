package com.example.SkillWave.repository;

import com.example.SkillWave.model.PostComment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostCommentRepository extends JpaRepository<PostComment, Long> {
    
    // Find comments by post ID
    List<PostComment> findByPostId(Long postId);
    
    // Find comments by post ID with pagination
    Page<PostComment> findByPostId(Long postId, Pageable pageable);
    
    // Find comments by user ID
    List<PostComment> findByUserId(String userId);
    
    // Find recent comments by post ID
    List<PostComment> findByPostIdOrderByCreatedAtDesc(Long postId);
    
    // Count comments by post ID
    long countByPostId(Long postId);
    
    // Delete all comments for a post
    void deleteByPostId(Long postId);
}