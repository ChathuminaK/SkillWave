package com.example.SkillWave.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
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
        
        if (files == null || files.length == 0) {
            return fileUrls;
        }
        
        try {
            // Create directory path
            Path directoryPath = Paths.get(uploadDir, folder, entityId.toString());
            Files.createDirectories(directoryPath);
            
            for (MultipartFile file : files) {
                if (file != null && !file.isEmpty()) {
                    // Generate a unique filename
                    String originalFilename = file.getOriginalFilename();
                    String fileExtension = "";
                    if (originalFilename != null && originalFilename.contains(".")) {
                        fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
                    }
                    String newFilename = UUID.randomUUID().toString() + fileExtension;
                    
                    // Save the file
                    Path filePath = directoryPath.resolve(newFilename);
                    Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                    
                    // Generate the URL that can be accessed through your controller
                    String fileUrl = baseUrl + "/api/media/" + folder + "/" + entityId + "/" + newFilename;
                    fileUrls.add(fileUrl);
                    
                    System.out.println("Saved file: " + filePath + ", URL: " + fileUrl);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        return fileUrls;
    }
    
    public void deleteFile(String fileUrl) {
        if (fileUrl == null || fileUrl.isEmpty()) {
            System.out.println("No file URL provided for deletion");
            return;
        }
        
        try {
            // Extract path from URL
            if (!fileUrl.startsWith(baseUrl)) {
                System.err.println("Invalid file URL format: " + fileUrl);
                return;
            }
            
            String relativePath = fileUrl.substring(baseUrl.length() + "/api/media/".length());
            Path filePath = Paths.get(uploadDir, relativePath);
            
            System.out.println("Attempting to delete file: " + filePath.toAbsolutePath());
            
            // Delete file if it exists
            if (Files.exists(filePath)) {
                Files.delete(filePath);
                System.out.println("Successfully deleted file: " + filePath);
            } else {
                System.out.println("File not found for deletion: " + filePath);
            }
        } catch (IOException e) {
            e.printStackTrace();
            System.err.println("Failed to delete file: " + fileUrl + " - " + e.getMessage());
            // Don't throw exception to allow process to continue
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Unexpected error when deleting file: " + e.getMessage());
            // Don't throw exception to allow process to continue
        }
    }
}