package com.example.SkillWave.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class LearningPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String title = "";  // Initialize with empty string instead of null
    
    @Column(length = 1000)
    private String description = "";  // Initialize with empty string instead of null
    
    @ElementCollection
    private List<String> topics = new ArrayList<>();
    
    @ElementCollection
    private List<String> resources = new ArrayList<>();
    
    private String timeline = "";  // Initialize with empty string instead of null
    
    @ElementCollection
    private List<String> mediaUrls = new ArrayList<>();

    // Default constructor
    public LearningPlan() {
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getTopics() {
        return topics;
    }

    public void setTopics(List<String> topics) {
        this.topics = topics;
    }

    public List<String> getResources() {
        return resources;
    }

    public void setResources(List<String> resources) {
        this.resources = resources;
    }

    public String getTimeline() {
        return timeline;
    }

    public void setTimeline(String timeline) {
        this.timeline = timeline;
    }

    public List<String> getMediaUrls() {
        return mediaUrls;
    }

    public void setMediaUrls(List<String> mediaUrls) {
        this.mediaUrls = mediaUrls;
    }
}