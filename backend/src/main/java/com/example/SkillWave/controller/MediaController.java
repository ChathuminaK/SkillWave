package com.example.SkillWave.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/media")
@CrossOrigin(origins = "http://localhost:3000")
public class MediaController {

    @Value("${app.upload.dir:${user.home}/uploads}")
    private String uploadDir;

    @Value("${app.base.url:http://localhost:8080}")
    private String baseUrl;

    @GetMapping("/{folder}/{entityId}/{filename:.+}")
    public ResponseEntity<Resource> serveFile(
            @PathVariable String folder,
            @PathVariable Long entityId,
            @PathVariable String filename) {

        try {
            Path filePath = Paths.get(uploadDir)
                    .resolve(folder)
                    .resolve(String.valueOf(entityId))
                    .resolve(filename);
            
            System.out.println("Attempting to serve file: " + filePath.toAbsolutePath());
            
            if (!Files.exists(filePath)) {
                System.out.println("File not found: " + filePath);
                return ResponseEntity.notFound().build();
            }
            
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists() && resource.isReadable()) {
                // Determine content type
                String contentType;
                String fileExtension = getFileExtension(filename);
                
                switch (fileExtension.toLowerCase()) {
                    case "png":
                        contentType = MediaType.IMAGE_PNG_VALUE;
                        break;
                    case "jpg":
                    case "jpeg":
                        contentType = MediaType.IMAGE_JPEG_VALUE;
                        break;
                    case "gif":
                        contentType = "image/gif";
                        break;
                    case "mp4":
                        contentType = "video/mp4";
                        break;
                    case "webm":
                        contentType = "video/webm";
                        break;
                    default:
                        contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
                }
                
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .header(HttpHeaders.CONTENT_TYPE, contentType)
                        .body(resource);
            } else {
                System.out.println("File is not readable: " + filePath);
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            System.err.println("Malformed URL: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            System.err.println("Error serving file: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
    
    private String getFileExtension(String filename) {
        if (filename.contains(".")) {
            return filename.substring(filename.lastIndexOf(".") + 1);
        }
        return "";
    }

    @PostMapping("/test-upload")
    public ResponseEntity<Map<String, Object>> testUpload(
            @RequestParam("file") MultipartFile file) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            if (file == null || file.isEmpty()) {
                response.put("success", false);
                response.put("message", "No file provided or file is empty");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Get file details
            response.put("filename", file.getOriginalFilename());
            response.put("size", file.getSize());
            response.put("contentType", file.getContentType());
            
            // Create test directory
            Path testDir = Paths.get(uploadDir, "test");
            if (!Files.exists(testDir)) {
                Files.createDirectories(testDir);
            }
            
            // Save the file
            Path filePath = testDir.resolve(file.getOriginalFilename());
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            response.put("success", true);
            response.put("savedAt", filePath.toString());
            response.put("message", "File uploaded successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/upload-test")
    public ResponseEntity<Map<String, Object>> uploadTestWithUrl(@RequestParam("file") MultipartFile file) {
        Map<String, Object> response = new HashMap<>();
        
        if (file.isEmpty()) {
            response.put("success", false);
            response.put("message", "Please select a file to upload");
            return ResponseEntity.badRequest().body(response);
        }
        
        try {
            // Create test directory
            Path testDir = Paths.get(uploadDir, "test");
            Files.createDirectories(testDir);
            
            // Generate unique filename
            String filename = UUID.randomUUID() + "-" + file.getOriginalFilename();
            Path targetPath = testDir.resolve(filename);
            
            // Save file
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
            
            // Create URL
            String fileUrl = baseUrl + "/api/media/test/" + filename;
            
            response.put("success", true);
            response.put("message", "File uploaded successfully");
            response.put("filename", filename);
            response.put("url", fileUrl);
            response.put("path", targetPath.toString());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Failed to upload file: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/check-directory")
    public ResponseEntity<Map<String, Object>> checkDirectory() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Check main upload directory
            Path rootDir = Paths.get(uploadDir);
            boolean rootExists = Files.exists(rootDir);
            boolean rootIsWritable = Files.isWritable(rootDir);
            
            response.put("uploadDirectory", rootDir.toAbsolutePath().toString());
            response.put("directoryExists", rootExists);
            response.put("directoryIsWritable", rootIsWritable);
            
            // Try to create test directory
            if (rootExists) {
                try {
                    Path testDir = rootDir.resolve("test");
                    if (!Files.exists(testDir)) {
                        Files.createDirectories(testDir);
                        response.put("testDirectoryCreated", true);
                    } else {
                        response.put("testDirectoryCreated", "already exists");
                    }
                    
                    // Try to write a test file
                    try {
                        Path testFile = testDir.resolve("test-write.txt");
                        Files.writeString(testFile, "Test write access: " + System.currentTimeMillis());
                        Files.delete(testFile);
                        response.put("writeTest", "success");
                    } catch (Exception e) {
                        response.put("writeTest", "failed: " + e.getMessage());
                    }
                } catch (Exception e) {
                    response.put("testDirectoryCreation", "failed: " + e.getMessage());
                }
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            response.put("error", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}