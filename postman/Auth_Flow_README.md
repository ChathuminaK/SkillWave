# SkillWave Authentication Flow

This document describes the authentication flow in the SkillWave application and how to test it using Postman.

## Authentication Flow Overview

1. **Registration**: Create a new user account
2. **Login**: Authenticate with credentials to receive tokens
3. **Token Usage**: Use access token for authenticated endpoints
4. **Token Refresh**: Refresh expired access tokens
5. **Logout**: End the user session

## Session Management

SkillWave uses a hybrid approach to session management:

- **JWT Tokens**: Primary authentication method using Bearer tokens
- **Stateless Architecture**: No server-side session storage
- **Optional Cookies**: Some endpoints may use cookies for special flows (like OAuth)

## Understanding Session Errors

The log snippet below shows a common session error:

```
2025-05-14T23:24:08.726+05:30 DEBUG 19160 --- [SkillWave] [nio-8080-exec-3] o.s.s.w.session.SessionManagementFilter  : Request requested invalid session id 2DD7BA946346BF3C9663C7B632BDBA36
2025-05-14T23:24:08.727+05:30 DEBUG 19160 --- [SkillWave] [nio-8080-exec-3] o.s.security.web.FilterChainProxy        : Securing GET 
2025-05-14T23:24:08.727+05:30 DEBUG 19160 --- [SkillWave] [nio-8080-exec-3] o.s.s.w.a.AnonymousAuthenticationFilter  : Set SecurityContextHolder to anonymous SecurityContext
```

This occurs when:

1. A client provides an invalid or expired session ID (JSESSIONID cookie)
2. The server can't find a matching session in memory
3. The security system falls back to anonymous authentication
4. The request likely fails with a 401 Unauthorized response

## Common Causes of Invalid Sessions

1. **Expired Session**: The session has timed out on the server
2. **Cleared Server Sessions**: Server restarted or sessions were cleared
3. **Invalid Cookie**: The cookie was tampered with or is corrupt
4. **Cross-Server Issues**: When using multiple servers without shared sessions

## Testing Authentication with Postman

The included Postman collection demonstrates the complete authentication flow:

1. **Registration**: Creates a new user account
2. **Login**: Obtains access and refresh tokens
3. **Accessing Protected Resources**: Uses the token to request protected endpoints
4. **Token Refresh**: Demonstrates how to refresh an expired token
5. **Invalid Session Example**: Shows a request with an invalid session ID
6. **Logout**: Properly ends the user session

## Testing Authentication Failure Scenarios

The collection includes a dedicated "Invalid Session Example" request that reproduces the error seen in the logs by:

1. Sending a request with a deliberately invalid JSESSIONID cookie
2. Attempting to access a protected endpoint
3. Receiving an unauthorized response

## How to Test

1. Import the Postman collection and environment
2. Start with the Registration or Login request
3. Subsequent requests will automatically use the saved tokens
4. The test script automatically extracts and saves tokens from responses
5. Use the "Invalid Session Example" to reproduce session errors

## Security Notes

- JWT tokens are sensitive and should be treated as credentials
- The refresh token has a longer lifespan and should be stored securely
- After logout, both tokens should be discarded on the client side
