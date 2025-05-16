package com.example.SkillWave.service;

import com.example.SkillWave.exception.ResourceNotFoundException;
import com.example.SkillWave.model.User;
import com.example.SkillWave.repository.UserRepository;
import com.example.SkillWave.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.transaction.annotation.Transactional;

// @Service // This line is commented out to prevent duplicate UserDetailsService beans
public class UserDetailsServiceImpl implements UserDetailsService {

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
    public UserDetails loadUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> 
                    new ResourceNotFoundException("User not found with id : " + id));
        
        return UserPrincipal.create(user);
    }
}
