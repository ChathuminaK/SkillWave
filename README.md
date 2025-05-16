# SkillWave

SkillWave is a comprehensive skill-sharing and learning platform designed to connect individuals passionate about developing and sharing various skills—such as coding, cooking, photography, and DIY crafts. The platform enables users to create accounts, follow others, share posts with photos or videos, and track their learning progress. SkillWave aims to build a vibrant community where users can connect, inspire, and learn from each other's experiences and expertise.

## Table of Contents

- [Features](#features)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Functional Overview](#functional-overview)
- [Contributors](#contributors)
- [License](#license)
- [References](#references)

---

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

This project is for educational purposes as part of the Programming Applications and Frameworks (IT3030) course at the Sri Lanka Institute of Information Technology.

---

## References

- [Spring Boot Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [JWT Authentication](https://jwt.io/introduction/)
- [OAuth 2.0 Specification](https://oauth.net/2/)
- [React Router Documentation](https://reactrouter.com/)
- [Spring Security Documentation](https://docs.spring.io/spring-security/reference/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [H2 Database Documentation](https://www.h2database.com/html/main.html)
- [Spring Data JPA Documentation](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/)
- [Material UI Documentation](https://mui.com/getting-started/usage/)
- [React Context API](https://reactjs.org/docs/context.html)
- [Axios HTTP Client](https://axios-http.com/docs/intro)
- [JSON Web Token (JWT) Best Practices](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-jwt-bcp)
- [Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/standards-guidelines/wcag/)
- [RESTful API Design](https://restfulapi.net/)
- [Testing Library Documentation](https://testing-library.com/docs/)
- [Jest Testing Framework](https://jestjs.io/docs/getting-started)
- [Spring Boot Testing Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.testing)
- [React Hooks Documentation](https://reactjs.org/docs/hooks-intro.html)
- [Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
