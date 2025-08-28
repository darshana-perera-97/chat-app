# ChatApp Backend

A Node.js backend server with traditional user registration and login authentication, featuring secure password hashing and JSON file storage for user data.

## Features

- **User Registration & Login** - Secure form-based authentication
- **Password Hashing** - Bcrypt.js for secure password storage
- **Session Management** - Express sessions with secure cookies
- **User Data Storage** - Local JSON file storage in `./data` folder
- **RESTful API** - Clean API endpoints for authentication and user management
- **CORS Enabled** - Cross-origin requests allowed from frontend

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the backend directory:

```env
# Session Security (SECURE - Generated cryptographically)
SESSION_SECRET=your-super-secret-session-key-here

# Server Configuration
PORT=5055
NODE_ENV=development
```

### 3. Run the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - Logout user
- `GET /auth/profile` - Get current user profile

### Data
- `GET /` - API information and available endpoints
- `GET /api/users` - Get all registered users (requires authentication)

## User Registration Fields

When registering a new user, the following fields are required:

- **firstName** - User's first name
- **lastName** - User's last name
- **username** - Unique username for login
- **email** - User's email address
- **password** - Password (minimum 6 characters)
- **passwordConfirmation** - Password confirmation (must match password)

## Data Storage

User data is stored in `./data/users.json` as a JSON array. Each user object contains:

```json
{
  "id": "unique-user-id",
  "firstName": "John",
  "lastName": "Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "hashed-password-string",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "lastLogin": "2024-01-01T00:00:00.000Z"
}
```

## File Structure

```
backend/
├── index.js              # Main server file
├── package.json          # Dependencies
├── README.md            # This file
├── .env                 # Environment variables (create this)
└── data/                # Data storage directory
    └── users.json       # User data file
```

## Security Features

- **Password Hashing** - All passwords are hashed using bcrypt.js
- **Session Security** - Secure session management with configurable secrets
- **Input Validation** - Comprehensive validation for all user inputs
- **Duplicate Prevention** - Username and email uniqueness enforced
- **Secure Cookies** - HTTP-only cookies with proper security settings

## Testing

1. Start the server: `npm run dev`
2. Visit: `http://localhost:5055/`
3. Test registration: `POST /auth/register` with user data
4. Test login: `POST /auth/login` with username/email and password
5. Check user data in `./data/users.json`
6. View all users: `GET /api/users` (requires authentication)

## Frontend Integration

The backend is designed to work with the React frontend. The frontend should:

1. Send registration data to `/auth/register`
2. Send login credentials to `/auth/login`
3. Include `credentials: 'include'` for session cookies
4. Handle authentication responses and redirects

## Production Considerations

- Use a proper database instead of JSON files
- Set `cookie.secure: true` for HTTPS
- Use environment variables for all secrets
- Implement rate limiting
- Add request validation middleware
- Use HTTPS in production
- Consider adding password reset functionality
