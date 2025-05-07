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

---

## Features

- **Skill-Sharing Posts & Notifications**
  - Create posts with up to 3 photos or short videos (max 30 seconds)
  - Describe skills, learning processes, and tips
  - Real-time notifications for likes and comments

- **User Interaction & Authentication**
  - Like and comment on posts (with edit/delete/moderation)
  - Secure login via OAuth 2.0 (social media)
  - JWT-based API authentication

- **User Profiles & Social Features**
  - Customizable public profiles
  - Follow/unfollow users
  - Search and filter by skill, category, or username

- **Learning Progress & Plan Sharing**
  - Track learning journeys and achievements
  - Share and follow customizable learning plans

- **Media Handling**
  - Secure upload, storage, and viewing of images/videos (AWS S3)

---

## System Architecture

- **Backend:** REST API (Java, Spring Boot)
- **Frontend:** React.js (JavaScript, CSS, HTML)
- **Media Storage:** AWS S3
- **Authentication:** OAuth 2.0, JWT
- **Database:** (Specify here, e.g., PostgreSQL or MongoDB if applicable)
- **Deployment:** (Specify here, e.g., Docker, AWS, Heroku, etc.)

### High-Level Diagrams

*See `/docs` or assignment report for:*
- Overall Architecture Diagram
- REST API Architecture Diagram
- Frontend Architecture Diagram

---

## Tech Stack

- **Frontend:** JavaScript, React.js, HTML, CSS
- **Backend:** Java, Spring Boot
- **Storage:** AWS S3
- **Authentication:** OAuth 2.0, JWT
- **Other:** (Add any other relevant tools or frameworks)

---

## Getting Started

### Prerequisites

- Node.js, npm/yarn
- Java (JDK 11+)
- (Database setup: add instructions if needed)
- AWS account (for media storage) or mock S3

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/ChathuminaK/SkillWave.git
cd SkillWave

# Setup backend (Java/Spring Boot)
cd backend
# Configure environment variables (DB, AWS, etc.)
# Build and run (example)
./mvnw spring-boot:run
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

*Note: Adjust directory names as per your project structure.*

---

## Functional Overview

### 1. Skill-sharing Posts & Notifications
- Backend: Endpoints for post creation, media upload (AWS S3), notifications, search, validation
- Frontend: Post creation UI, media previews, feed, notification center, media viewer

### 2. User Interaction & Authentication
- Backend: OAuth 2.0, JWT, endpoints for likes/comments, moderation, security
- Frontend: Rich text editor, content display, comment section, analytics

### 3. User Profiles & Social Features
- Backend: Learning plan endpoints, progress tracking, recommendations
- Frontend: Learning plan UI, progress visualization, dashboard

### 4. Learning Progress & Plan Sharing
- Backend: Secure uploads, organization, notifications, sharing
- Frontend: Drag-and-drop upload, gallery, social UI, optimized viewing

---

## Contributors

| Student ID   | Name              | Major Contributions                   |
|--------------|-------------------|----------------------------------------|
| IT22318848   | Sammani WMWL      | Posts & Notifications Mgmt (Backend/Frontend)   |
| IT22926494   | Manawadu GMST     | User Interaction & Authentication      |
| IT22366818   | Dissanayake DMVS  | Profiles & Social Features             |
| IT22893802   | Kaushal RKAC      | Learning Progress & Plan Sharing       |

---

## License

This project is for educational purposes as part of the Programming Applications and Frameworks (IT3030) course at the Sri Lanka Institute of Information Technology.

---

## References

*Add references and external resources here as needed.*
