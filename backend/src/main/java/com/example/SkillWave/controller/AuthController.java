package com.example.SkillWave.controller;

import com.example.SkillWave.exception.BadRequestException;
import com.example.SkillWave.exception.ResourceNotFoundException;
import com.example.SkillWave.model.User;
import com.example.SkillWave.payload.JwtAuthenticationResponse;
import com.example.SkillWave.payload.LoginRequest;
import com.example.SkillWave.payload.SignUpRequest;
import com.example.SkillWave.payload.RefreshTokenRequest;
import com.example.SkillWave.repository.UserRepository;
import com.example.SkillWave.security.CurrentUser;
import com.example.SkillWave.security.JwtTokenProvider;
import com.example.SkillWave.security.UserPrincipal;
import com.example.SkillWave.security.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;    

    @Autowired
    private JwtTokenProvider tokenProvider;
    
    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );        
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = tokenProvider.generateToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(authentication);
        
        // Find the user and update last login time
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + loginRequest.getEmail()));        
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);
        
        JwtAuthenticationResponse response = new JwtAuthenticationResponse(jwt, refreshToken);
        response.setUserId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setProvider(user.getProvider());
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) {
        // Check if the email is already in use
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new BadRequestException("Email is already taken");
        }

        // Create user
        User user = new User();
        user.setName(signUpRequest.getName());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        user.setEmailVerified(false);
        user.setProvider("local");
        user.setAuthProvider("local");
        user.setCreatedAt(LocalDateTime.now());
        user.setLastLogin(LocalDateTime.now());
          // Set default roles
        Set<String> roles = new HashSet<>();
        roles.add("ROLE_USER");
        user.setRoles(roles);
        
        // Save the user
        userRepository.save(user);
        
        // Generate JWT token
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(signUpRequest.getEmail(), signUpRequest.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(authentication);
        
        JwtAuthenticationResponse response = new JwtAuthenticationResponse(jwt, refreshToken);
        response.setUserId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setProvider(user.getProvider());
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get current user information based on JWT token
     */
    @GetMapping("/current-user")
    public ResponseEntity<?> getCurrentUser(@CurrentUser UserPrincipal userPrincipal) {
        // If no authenticated user is found
        if (userPrincipal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Not authenticated"));
        }
        
        try {
            User user = userRepository.findById(userPrincipal.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userPrincipal.getId()));
            
            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("name", user.getName());
            response.put("email", user.getEmail());
            response.put("profilePictureUrl", user.getProfilePictureUrl());
            response.put("roles", user.getRoles());
            response.put("provider", user.getProvider());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error retrieving user details", 
                                "message", e.getMessage()));
        }
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@RequestBody RefreshTokenRequest refreshTokenRequest) {
        try {
            // Validate the refresh token
            String refreshToken = refreshTokenRequest.getRefreshToken();
            if (refreshToken == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Refresh token is required"));
            }
            
            // Verify the refresh token
            if (!tokenProvider.validateToken(refreshToken)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Invalid refresh token"));
            }
            
            // Get user information from the token
            String email = tokenProvider.getUsernameFromToken(refreshToken);
            UserDetails userDetails = customUserDetailsService.loadUserByUsername(email);
            
            // Create authentication object
            UsernamePasswordAuthenticationToken authentication = 
                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
              // Generate new access token
            String newAccessToken = tokenProvider.generateToken(authentication);
            
            // Optionally generate new refresh token with extended expiry
            String newRefreshToken = tokenProvider.generateRefreshToken(authentication);
            
            // Fetch user information to include in response
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
            
            JwtAuthenticationResponse response = new JwtAuthenticationResponse(newAccessToken, newRefreshToken);
            response.setUserId(user.getId());
            response.setName(user.getName());
            response.setEmail(user.getEmail());
            response.setProvider(user.getProvider());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to refresh token", "message", e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser(@CurrentUser UserPrincipal userPrincipal) {
        // Since we're using stateless JWT tokens, the client should remove the token
        // But we can still invalidate sessions or perform server-side actions if needed
        
        try {
            if (userPrincipal != null) {
                // Optional: Update last activity timestamp in the user record
                User user = userRepository.findById(userPrincipal.getId())
                        .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userPrincipal.getId()));
                user.setLastLogin(LocalDateTime.now());
                userRepository.save(user);
                
                // Log the logout action
                logger.info("User logged out: {}", userPrincipal.getEmail());
            }
            
            return ResponseEntity.ok(Map.of(
                "message", "You have been successfully logged out"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Logout failed", "message", e.getMessage()));
        }
    }
}