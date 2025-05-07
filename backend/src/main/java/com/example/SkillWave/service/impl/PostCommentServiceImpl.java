package com.example.SkillWave.service.impl;

import com.example.SkillWave.exception.ResourceNotFoundException;
import com.example.SkillWave.model.PostComment;
import com.example.SkillWave.repository.EducationalPostRepository;
import com.example.SkillWave.repository.PostCommentRepository;
import com.example.SkillWave.service.PostCommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PostCommentServiceImpl implements PostCommentService {
    
    @Autowired
    private PostCommentRepository commentRepository;
    
    @Autowired
    private EducationalPostRepository postRepository;
    
    @Override
    public List<PostComment> getCommentsByPostId(Long postId) {
        return commentRepository.findByPostId(postId);
    }
    
    @Override
    public Page<PostComment> getCommentsByPostId(Long postId, Pageable pageable) {
        return commentRepository.findByPostId(postId, pageable);
    }
    
    @Override
    public PostComment getCommentById(Long id) {
        return commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + id));
    }
    
    @Override
    @Transactional
    public PostComment createComment(PostComment comment) {
        // Verify post exists
        if (!postRepository.existsById(comment.getPostId())) {
            throw new ResourceNotFoundException("Post not found with id: " + comment.getPostId());
        }
        
        // Set creation time
        comment.setCreatedAt(LocalDateTime.now());
        
        // Save comment
        PostComment savedComment = commentRepository.save(comment);
        
        // Update post's comment count
        updatePostCommentCount(comment.getPostId());
        
        return savedComment;
    }
    
    @Override
    @Transactional
    public PostComment updateComment(Long id, PostComment comment) {
        PostComment existingComment = getCommentById(id);
        
        // Only update content, other fields should remain the same
        existingComment.setContent(comment.getContent());
        
        // PreUpdate will handle updatedAt and edited flag
        
        return commentRepository.save(existingComment);
    }
    
    @Override
    @Transactional
    public void deleteComment(Long id) {
        PostComment comment = getCommentById(id);
        Long postId = comment.getPostId();
        
        commentRepository.deleteById(id);
        
        // Update post's comment count
        updatePostCommentCount(postId);
    }
    
    @Override
    public List<PostComment> getCommentsByUserId(String userId) {
        return commentRepository.findByUserId(userId);
    }
    
    @Override
    public boolean isCommentOwner(Long commentId, String userId) {
        PostComment comment = getCommentById(commentId);
        return comment.getUserId().equals(userId);
    }
    
    @Override
    public long countCommentsByPostId(Long postId) {
        return commentRepository.countByPostId(postId);
    }
    
    @Override
    @Transactional
    public void deleteAllCommentsForPost(Long postId) {
        commentRepository.deleteByPostId(postId);
    }
    
    // Helper method to update the post's comment count
    private void updatePostCommentCount(Long postId) {
        postRepository.findById(postId).ifPresent(post -> {
            long commentCount = commentRepository.countByPostId(postId);
            post.setCommentsCount((int) commentCount);
            postRepository.save(post);
        });
    }
}