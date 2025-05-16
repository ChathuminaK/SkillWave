# SkillWave API Testing

This directory contains Postman files for testing the SkillWave application API. The collection includes requests for functionality that may not yet be implemented in the frontend.

## Files

- `SkillWave_API_Collection.postman_collection.json`: Collection of API requests organized by feature
- `SkillWave_Environment.postman_environment.json`: Environment variables for testing

## Setup Instructions

1. Install [Postman](https://www.postman.com/downloads/)
2. Import the collection and environment files
3. Select the "SkillWave Environment" from the environment dropdown
4. Update the environment variables as needed (especially `userEmail` and `userPassword`)

## Authentication Flow

Before testing protected endpoints:

1. Run the "Register" request if you need a new account, or "Login" if you already have one
2. The response will automatically set your `accessToken`, `refreshToken`, and `userId` in the environment variables
3. All subsequent requests will use the token for authentication
4. If your token expires, use the "Refresh Token" request to get a new one

## Testing Progress Tracking

The Progress Tracking folder contains requests for the progress tracking functionality that may not be fully implemented in the frontend:

1. Get a user's progress with pagination
2. Get progress summary stats
3. Create new progress records
4. Update progress percentage
5. Mark items as completed
6. Reset progress

To test a complete flow:
1. Create a progress record for a learning plan
2. Update the progress percentage
3. Mark it as completed
4. View the completed progress list
5. Reset the progress if needed

## Debugging Session Errors

If you encounter session errors like:
```
Request requested invalid session id 2DD7BA946346BF3C9663C7B632BDBA36
```

This indicates a session token issue. Try:
1. Getting a fresh access token via the "Login" or "Refresh Token" request
2. Checking if your token has expired
3. Verifying that your request includes the proper Authorization header

## Session vs JWT

The SkillWave application uses JWT tokens for authentication rather than traditional sessions. The session error might be occurring when:
- A session cookie is being sent but no longer valid
- The server is attempting to validate a session that was cleared
- There's a mismatch between authentication methods

This collection is designed to use JWT token-based authentication, which should avoid these session issues.
