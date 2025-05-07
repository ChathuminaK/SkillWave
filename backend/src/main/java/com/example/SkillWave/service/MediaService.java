package com.example.SkillWave.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class MediaService {

    @Value("${app.upload.dir:./uploads}")
    private String uploadDir;
    
    @Value("${app.base.url:http://localhost:8080}")
    private String baseUrl;

    @PostConstruct
    public void init() {
        try {
            Path rootDir = Paths.get(uploadDir);
            if (!Files.exists(rootDir)) {
                Files.createDirectories(rootDir);
                System.out.println("Created root upload directory: " + rootDir);
            }
        } catch (IOException e) {
            System.err.println("Could not initialize storage: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    public List<String> uploadFiles(MultipartFile[] files, String folder, Long entityId) {
        List<String> fileUrls = new ArrayList<>();
        
        try {
            // Create entity directory if it doesn't exist
            Path entityDir = Paths.get(uploadDir, folder, entityId.toString());
            if (!Files.exists(entityDir)) {
                Files.createDirectories(entityDir);
            }
            
            for (MultipartFile file : files) {
                if (file != null && !file.isEmpty()) {
                    try {
                        // Generate a unique filename
                        String originalFilename = file.getOriginalFilename();
                        String extension = originalFilename != null ? 
                                originalFilename.substring(originalFilename.lastIndexOf(".")) : "";
                        String newFilename = UUID.randomUUID().toString() + extension;
                        
                        // Save the file
                        Path filePath = entityDir.resolve(newFilename);
                        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                        
                        // Generate the URL that can be accessed through your controller
                        String fileUrl = baseUrl + "/api/media/" + folder + "/" + entityId + "/" + newFilename;
                        fileUrls.add(fileUrl);
                        
                        System.out.println("Saved file: " + filePath + ", URL: " + fileUrl);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        return fileUrls;
    }
    
    public void deleteFile(String fileUrl) {
        try {
            // Parse the URL to get file path components
            // URL format: baseUrl + "/api/media/" + folder + "/" + entityId + "/" + filename
            String baseUrlPrefix = baseUrl + "/api/media/";
            if (fileUrl.startsWith(baseUrlPrefix)) {
                String relativePath = fileUrl.substring(baseUrlPrefix.length());
                String[] pathParts = relativePath.split("/");
                
                if (pathParts.length >= 3) {
                    String folder = pathParts[0];
                    String entityId = pathParts[1];
                    String filename = pathParts[2];
                    
                    Path filePath = Paths.get(uploadDir, folder, entityId, filename);
                    if (Files.exists(filePath)) {
                        Files.delete(filePath);
                        System.out.println("Deleted file: " + filePath);
                        
                        // Check if directory is empty and delete if it is
                        Path entityDir = Paths.get(uploadDir, folder, entityId);
                        if (Files.exists(entityDir) && Files.list(entityDir).count() == 0) {
                            Files.delete(entityDir);
                            System.out.println("Deleted empty directory: " + entityDir);
                        }
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Error deleting file: " + e.getMessage());
            e.printStackTrace();
        }
    }
}