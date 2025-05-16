package com.example.SkillWave.controller;

import com.example.SkillWave.model.LearningPlan;
import com.example.SkillWave.repository.LearningPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/database")
@CrossOrigin(origins = "http://localhost:3000")
public class DatabaseRepairController {
    
    @Autowired
    private LearningPlanRepository learningPlanRepository;
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @GetMapping("/repair-learning-plan")
    public ResponseEntity<Map<String, Object>> repairLearningPlanIssue() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Check if learning plan with ID 3 exists
            boolean planExists = learningPlanRepository.existsById(3L);
            response.put("planWithId3Exists", planExists);
            
            if (!planExists) {
                // Create plan with ID 3 to fix the foreign key constraint
                LearningPlan tempPlan = new LearningPlan();
                tempPlan.setTitle("Temporary Plan");
                tempPlan.setDescription("This plan was created to resolve database constraints");
                tempPlan.setUserId("admin");
                tempPlan.setCreatedAt(LocalDateTime.now());
                
                // Using direct SQL to set ID
                jdbcTemplate.update(
                    "INSERT INTO learning_plan (id, title, description, user_id, created_at) VALUES (?, ?, ?, ?, ?)", 
                    3, "Temporary Plan", "Created to fix FK constraint", "admin", LocalDateTime.now()
                );
                
                response.put("tempPlanCreated", true);
                
                // Update sequence if it exists
                try {
                    jdbcTemplate.update("ALTER SEQUENCE IF EXISTS learning_plan_seq RESTART WITH 100");
                    response.put("sequenceUpdated", true);
                } catch (Exception e) {
                    response.put("sequenceUpdateError", e.getMessage());
                }
                
                // Update constraint to include CASCADE DELETE
                try {
                    jdbcTemplate.update("ALTER TABLE learning_plan_topics DROP CONSTRAINT IF EXISTS FKN70IGL07IIDJGQETOK6Y0AGW6");
                    jdbcTemplate.update(
                        "ALTER TABLE learning_plan_topics ADD CONSTRAINT FKN70IGL07IIDJGQETOK6Y0AGW6 " +
                        "FOREIGN KEY (learning_plan_id) REFERENCES learning_plan(id) ON DELETE CASCADE"
                    );
                    response.put("constraintUpdated", true);
                } catch (Exception e) {
                    response.put("constraintUpdateError", e.getMessage());
                }
            }
            
            // Return statistics
            response.put("totalLearningPlans", learningPlanRepository.count());
            response.put("repairDate", LocalDateTime.now());
            response.put("status", "success");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}
