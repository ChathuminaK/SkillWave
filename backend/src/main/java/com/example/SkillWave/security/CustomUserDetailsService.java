package com.example.SkillWave.security;

import com.example.SkillWave.exception.ResourceNotFoundException;
import com.example.SkillWave.model.User;
import com.example.SkillWave.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> 
                        new UsernameNotFoundException("User not found with email : " + email));

        return UserPrincipal.create(user);
    }

    @Transactional
    public UserDetails loadUserById(String id) {
        // Check if ID is numeric (for backward compatibility)
        if (id.matches("\\d+")) {
            Long numericId = Long.parseLong(id);
            User user = userRepository.findById(numericId)
                    .orElseThrow(() -> 
                            new ResourceNotFoundException("User not found with id: " + numericId));
            return UserPrincipal.create(user);
        } else {
            // If ID is not numeric, try to find by email
            return loadUserByUsername(id);
        }
    }
}