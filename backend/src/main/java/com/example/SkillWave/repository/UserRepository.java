package com.example.SkillWave.repository;

import com.example.SkillWave.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByProviderIdAndAuthProvider(String providerId, String authProvider);
    Boolean existsByEmail(String email);
}