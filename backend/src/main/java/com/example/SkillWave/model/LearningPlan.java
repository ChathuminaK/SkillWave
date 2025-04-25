package com.example.SkillWave.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class LearningPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String description;
    @ElementCollection
    private List<String> topics;
    @ElementCollection
    private List<String> resources;
    private String timeline;

    // Constructors, getters, and setters
    public LearningPlan() {}

    public LearningPlan(String title, String description, List<String> topics, List<String> resources, String timeline) {
        this.title = title;
        this.description = description;
        this.topics = topics;
        this.resources = resources;
        this.timeline = timeline;
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
}