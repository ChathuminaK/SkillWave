# SkillWave Backend Architecture

This document outlines the backend structure of the SkillWave application.

## Package Structure

```
com.example.SkillWave/
├── config/             # Configuration classes
│   ├── SecurityConfig.java
│   ├── WebMvcConfig.java
│   ├── JwtConfig.java
│   └── CorsConfig.java
├── controller/         # REST controllers
│   ├── AuthController.java
│   ├── CourseController.java
│   ├── UserController.java
│   ├── ProgressController.java
│   └── MediaController.java
├── model/              # Entity classes
│   ├── User.java
│   ├── Course.java
│   ├── Lesson.java
│   ├── Progress.java
│   └── ...
├── repository/         # Data access layer
│   ├── UserRepository.java
│   ├── CourseRepository.java
│   └── ...
├── service/            # Business logic
│   ├── impl/           # Service implementations
│   ├── AuthService.java
│   ├── CourseService.java
│   └── ...
├── security/           # Security related classes
│   ├── JwtTokenProvider.java
│   ├── CustomUserDetailsService.java
│   └── oauth2/         # OAuth2 authentication
├── exception/          # Custom exceptions
│   ├── ResourceNotFoundException.java
│   ├── BadRequestException.java
│   └── ...
├── dto/                # Data Transfer Objects
│   ├── request/        # Request DTOs
│   ├── response/       # Response DTOs
│   └── mapper/         # DTO mappers
└── util/               # Utility classes
```

## Key Components

### Security
The application uses Spring Security with JWT for authentication. OAuth2 integration is available for Google and GitHub logins.

### Controllers
RESTful controllers define the API endpoints. They validate input, delegate to services, and return appropriate responses.

### Services
Services contain the business logic and transaction management. They interact with repositories and external systems.

### Repositories
JPA repositories handle database operations. Custom queries are defined when needed.

### Models
JPA entities represent database tables. Relationships are established using annotations.

### DTOs
Data Transfer Objects separate the API contracts from the internal models. Mappers convert between entities and DTOs.

## Database Structure

H2 database is used in development with tables for users, courses, lessons, progress tracking, etc.

## Authentication Flow

1. User logs in with credentials or OAuth2 provider
2. Backend validates and returns JWT access and refresh tokens
3. Frontend stores tokens and includes them in subsequent requests
4. Token refresh happens automatically when needed

## API Documentation

The API documentation is available at `/swagger-ui.html` when the application is running.
