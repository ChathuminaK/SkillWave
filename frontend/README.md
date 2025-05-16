# SkillWave Frontend

This document provides an overview of the SkillWave frontend application.

## Project Structure

```
src/
├── assets/             # Static assets (images, fonts, etc.)
├── components/         # Reusable UI components
│   ├── common/         # Shared components (buttons, inputs, etc.)
│   ├── course/         # Course-related components
│   ├── user/           # User-related components
│   └── layout/         # Layout components (header, footer, etc.)
├── context/            # React context providers
│   ├── AuthContext.js  # Authentication context
│   └── ThemeContext.js # Theme context
├── hooks/              # Custom React hooks
│   ├── useAuth.js      # Authentication hook
│   └── useForm.js      # Form handling hook
├── pages/              # Page components
│   ├── auth/           # Authentication pages
│   ├── course/         # Course pages
│   ├── user/           # User profile pages
│   └── dashboard/      # Dashboard pages
├── routes/             # Route configuration
│   ├── AppRoutes.js    # Main routes definition
│   ├── PrivateRoute.js # Protected route component
│   └── PublicRoute.js  # Public route component
├── services/           # API services
│   ├── api.service.js  # Base API configuration
│   ├── auth.service.js # Authentication service
│   └── ...
├── store/              # State management (if using Redux)
├── styles/             # Global styles and themes
│   ├── global.css      # Global styles
│   └── theme.js        # Theme configuration
├── utils/              # Utility functions
│   ├── validators.js   # Form validation helpers
│   └── formatters.js   # Data formatting helpers
└── App.js              # Main application component
```

## Key Features

- **Authentication**: Login, registration, and OAuth2 integration
- **Course Management**: Browse, search, and enroll in courses
- **Learning Dashboard**: Track progress and manage courses
- **User Profile**: Manage user information and preferences
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- **React**: UI library
- **React Router**: Client-side routing
- **Axios**: HTTP client for API requests
- **JWT**: JSON Web Tokens for authentication
- **CSS Modules/Styled Components**: Component styling
- **React Context API**: State management

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with:
   ```
   REACT_APP_API_URL=http://localhost:8080
   ```
4. Start the development server:
   ```
   npm start
   ```

## Authentication Flow

The application uses JWT-based authentication with refresh token mechanism:

1. User logs in and receives access and refresh tokens
2. Access token is included in all API requests
3. When the access token expires, the refresh token is used to get a new one
4. If the refresh token is invalid, the user is redirected to login

## Development Guidelines

- Follow the component-based architecture
- Use React hooks for state and side effects
- Keep components small and focused
- Use services for API communication
- Document complex components with JSDoc comments
