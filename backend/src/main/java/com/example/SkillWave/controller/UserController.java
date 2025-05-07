package com.example.SkillWave.controller;

import com.example.SkillWave.exception.ResourceNotFoundException;
import com.example.SkillWave.model.User;
import com.example.SkillWave.repository.UserRepository;
import com.example.SkillWave.security.CurrentUser;
import com.example.SkillWave.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/me")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getCurrentUser(@CurrentUser UserPrincipal userPrincipal) {
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userPrincipal.getId()));
                
        // Remove sensitive information
        user.setPassword(null);
        
        return ResponseEntity.ok(user);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserProfile(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        
        // Don't expose sensitive data
        user.setPassword(null);
        
        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("name", user.getName());
        response.put("email", user.getEmail());
        response.put("profilePictureUrl", user.getProfilePictureUrl());
        response.put("bio", user.getBio());
        response.put("createdAt", user.getCreatedAt());
        
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/me")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> updateUser(@CurrentUser UserPrincipal userPrincipal, @RequestBody User userRequest) {
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userPrincipal.getId()));
        
        // Only allow updating certain fields
        if (userRequest.getBio() != null) {
            user.setBio(userRequest.getBio());
        }
        if (userRequest.getName() != null) {
            user.setName(userRequest.getName());
        }
        
        User updatedUser = userRepository.save(user);
        
        // Don't return password
        updatedUser.setPassword(null);
        
        return ResponseEntity.ok(updatedUser);
    }
}