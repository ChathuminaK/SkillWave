<<<<<<< Updated upstream
# SkillWave
 
=======
# SkillWave Learning Platform

SkillWave is a comprehensive e-learning platform that enables users to create, share, and participate in online courses.

## Project Structure

This repository contains both the backend and frontend codebases:

```
SkillWave/
├── backend/              # Spring Boot backend
│   ├── src/              # Source code
│   ├── pom.xml           # Maven configuration
│   └── README.md         # Backend documentation
├── frontend/             # React frontend
│   ├── public/           # Static files
│   ├── src/              # Source code
│   ├── package.json      # npm configuration
│   └── README.md         # Frontend documentation
├── postman/              # Postman collections for API testing
├── uploads/              # User uploaded content (media, documents, etc.)
└── README.md             # Main documentation (this file)
```

## Features

- **User Authentication**: Secure login/registration with JWT tokens and OAuth2
- **Course Management**: Create, edit, publish, and browse courses
- **Content Delivery**: Video, audio, documents, and interactive content
- **Progress Tracking**: Track learning progress across courses
- **User Dashboard**: Personalized dashboard for learners and instructors
- **Reviews & Ratings**: Course review and rating system
- **Search & Filters**: Advanced search and filtering capabilities
- **Mobile Responsive**: Works on all devices

## Tech Stack

### Backend
- Java 11
- Spring Boot
- Spring Security
- Spring Data JPA
- H2 Database (development)
- JWT Authentication
- Maven

### Frontend
- React
- React Router
- Axios
- CSS Modules/Styled Components
- JWT Handling

## Getting Started

### Prerequisites
- Java 11 or higher
- Node.js 14 or higher
- npm or yarn
- Maven

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```
2. Build the project:
   ```
   mvn clean install
   ```
3. Run the Spring Boot application:
   ```
   mvn spring-boot:run
   ```
   The backend will start at `http://localhost:8080`

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with:
   ```
   REACT_APP_API_URL=http://localhost:8080
   ```
4. Run the development server:
   ```
   npm start
   ```
   The frontend will start at `http://localhost:3000`

## API Documentation

The API documentation is available at `http://localhost:8080/swagger-ui.html` when the backend is running.

## Testing

### Backend Tests
Run the tests using Maven:
```
cd backend
mvn test
```

### Frontend Tests
Run the tests using npm:
```
cd frontend
npm test
```

### API Testing
The `postman` directory contains Postman collections for testing the API endpoints.

## Deployment

### Backend
1. Build the JAR file:
   ```
   cd backend
   mvn clean package
   ```
2. Run the JAR file:
   ```
   java -jar target/skillwave-0.0.1-SNAPSHOT.jar
   ```

### Frontend
1. Build the production bundle:
   ```
   cd frontend
   npm run build
   ```
2. Serve the static files using a web server of your choice

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
>>>>>>> Stashed changes
