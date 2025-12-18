# User Authentication & Authorization API

A production-ready Node.js application implementing Bearer Token authentication using JWT, Express.js, and MongoDB.

## Features

- ✅ User Registration with validation and password hashing
- ✅ User Login with JWT token generation
- ✅ Protected routes using Bearer token middleware
- ✅ Get current user information from token
- ✅ Comprehensive error handling and validation
- ✅ MVC architecture pattern
- ✅ MongoDB integration with Mongoose
- ✅ CORS enabled for API access

## Technology Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT (jsonwebtoken)** - Token generation and verification
- **bcryptjs** - Password hashing
- **dotenv** - Environment variable management
- **CORS** - Cross-Origin Resource Sharing

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager
- Postman (for API testing)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd auth-app
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/auth-app
JWT_SECRET=your_super_secret_jwt_key_change_in_production
NODE_ENV=development
```

## Running the Application

### Development Mode (with auto-reload):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

The server will start at `http://localhost:5000`

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### 1. User Registration
- **Endpoint:** `POST /api/auth/register`
- **Description:** Create a new user account
- **Access:** Public
- **Content-Type:** application/json

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "john_doe",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (400/409):**
```json
{
  "success": false,
  "message": "User with this email or username already exists"
}
```

---

#### 2. User Login
- **Endpoint:** `POST /api/auth/login`
- **Description:** Login and receive JWT token
- **Access:** Public
- **Content-Type:** application/json

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "john_doe",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

#### 3. Get Current User
- **Endpoint:** `GET /api/auth/me`
- **Description:** Get authenticated user information
- **Access:** Private (requires Bearer token)
- **Headers:**
  - `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Not authorized to access this route. Please provide a valid token."
}
```

## Project Structure

```
auth-app/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection configuration
│   ├── controllers/
│   │   └── authController.js    # Authentication logic
│   ├── middleware/
│   │   └── authMiddleware.js    # JWT verification middleware
│   ├── models/
│   │   └── User.js              # User schema and model
│   ├── routes/
│   │   └── authRoutes.js        # Route definitions
│   └── server.js                # Express app initialization
├── package.json                 # Dependencies and scripts
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
├── README.md                    # This file
└── postman_collection.json      # Postman API documentation
```

## Usage with Postman

### Import Collection

1. Open Postman
2. Click **Import**
3. Upload `postman_collection.json`
4. Select the imported collection
5. Set environment variables if needed

### Testing Workflow

1. **Register** - Create a new user account
2. **Login** - Get JWT token
3. **Get Me** - Use token to access protected route

## Error Handling

The API implements comprehensive error handling:

- **400 Bad Request** - Missing or invalid input data
- **401 Unauthorized** - Invalid/missing token or credentials
- **404 Not Found** - Resource not found
- **409 Conflict** - Duplicate email or username
- **500 Internal Server Error** - Server-side error

## Security Features

- ✅ Password hashing with bcryptjs (10 rounds)
- ✅ JWT token expiration (7 days)
- ✅ Input validation and sanitization
- ✅ Protected routes with Bearer token
- ✅ Secure password field exclusion
- ✅ CORS protection
- ✅ Environment variables for sensitive data

## Database Schema

### User Collection
```javascript
{
  username: String (unique, 3-20 chars),
  email: String (unique, valid format),
  password: String (hashed, 6+ chars),
  firstName: String (optional),
  lastName: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

## Deployment to Render

### Steps:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Render**
   - Go to https://render.com/
   - Connect GitHub account
   - Create new Web Service
   - Select your repository
   - Set build command: `npm install`
   - Set start command: `npm start`
   - Add environment variables (PORT, MONGODB_URI, JWT_SECRET)
   - Deploy

3. **Database Setup**
   - Use MongoDB Atlas (https://www.mongodb.com/cloud/atlas)
   - Create free cluster
   - Get connection string
   - Add IP to whitelist
   - Add connection string to Render environment variables

## Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/auth-app

# JWT Configuration
JWT_SECRET=your_very_secure_secret_key_min_32_chars_recommended
```

## Contributing

This is a confidential assessment project. Please follow all terms and conditions.

## License

MIT License

## Support

For issues or questions, please refer to the API documentation above or check the Postman collection for detailed examples.

---

**Note:** This is an educational implementation. For production use, implement additional security measures such as rate limiting, request logging, and enhanced input validation.
