# 🎨 Visual Quick Reference Guide

Quick visual reference for the authentication system.

---

## 🔄 Authentication Flow Diagram

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       │ 1. Register
       ├─► POST /auth/register
       │   {username, email, password}
       │
       ▼ Response: {user, token}
       
       │ 2. Login  
       ├─► POST /auth/login
       │   {email, password}
       │
       ▼ Response: {user, token}
       
       │ 3. Request Protected Route
       ├─► GET /auth/me
       │   Header: Authorization: Bearer token
       │
       ▼ Response: {user_info}
```

---

## 🏗️ MVC Architecture

```
REQUEST
   │
   ▼
┌─────────────────────────────┐
│  Routes (routes/*)          │  ← Handles endpoints
│  POST /register             │
│  POST /login                │
│  GET /me                    │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ Middleware (middleware/*)   │  ← protect middleware
│ - JWT verification         │
│ - User attachment          │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ Controllers (controllers/*) │  ← Business logic
│ - register()               │
│ - login()                  │
│ - getMe()                  │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ Models (models/*)           │  ← Database schema
│ - User.js                  │
│ - Validation              │
│ - Password hashing        │
└──────────────┬──────────────┘
               │
               ▼
         ┌────────────┐
         │ MongoDB    │
         │ Database   │
         └────────────┘
```

---

## 🔐 Password Security Flow

```
User Input: "password123"
      │
      ▼
   ┌─────────────────────────────────┐
   │ bcryptjs.genSalt(10)            │  Generate salt
   │ Creates: salt_string            │
   └──────────────┬────────────────┘
                  │
                  ▼
   ┌─────────────────────────────────┐
   │ bcryptjs.hash(password, salt)   │  Hash password
   │ Creates: $2a$10$N9qo8u...      │
   └──────────────┬────────────────┘
                  │
                  ▼
         ┌──────────────────┐
         │ Save to Database │
         │ (hashed only)    │
         └──────────────────┘
```

---

## 🎫 JWT Token Structure

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsImlhdCI6MTcwNTMyMDYwMCwiZXhwIjoxNzA1OTI1NDAwfQ.
example_signature_hash

│
├─ Header (Base64)
│  {
│    "alg": "HS256",
│    "typ": "JWT"
│  }
│
├─ Payload (Base64)
│  {
│    "id": "507f1f77bcf86cd799439011",  ← User ID
│    "iat": 1705320600,                  ← Issued at
│    "exp": 1705925400                   ← Expires (7 days)
│  }
│
└─ Signature
   HMACSHA256(
     base64UrlEncode(header) + "." + base64UrlEncode(payload),
     secret_key
   )
```

---

## 📡 API Request/Response Examples

### Register Request
```
┌─────────────────────────────────────┐
│ POST /api/auth/register             │
│                                     │
│ Headers:                            │
│ Content-Type: application/json      │
│                                     │
│ Body:                               │
│ {                                   │
│   "username": "john_doe",           │
│   "email": "john@example.com",      │
│   "password": "secure_pwd",         │
│   "firstName": "John",              │
│   "lastName": "Doe"                 │
│ }                                   │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ 201 Created                         │
│                                     │
│ {                                   │
│   "success": true,                  │
│   "message": "User registered...",  │
│   "data": {                         │
│     "user": {                       │
│       "_id": "507f...",            │
│       "username": "john_doe",       │
│       "email": "john@example.com"   │
│     },                              │
│     "token": "eyJhbGc..."          │
│   }                                 │
│ }                                   │
└─────────────────────────────────────┘
```

### Login Request
```
┌─────────────────────────────────────┐
│ POST /api/auth/login                │
│                                     │
│ Headers:                            │
│ Content-Type: application/json      │
│                                     │
│ Body:                               │
│ {                                   │
│   "email": "john@example.com",      │
│   "password": "secure_pwd"          │
│ }                                   │
└─────────────────────────────────────┘
         │
         ▼ (Verify password)
         │
┌─────────────────────────────────────┐
│ 200 OK                              │
│                                     │
│ {                                   │
│   "success": true,                  │
│   "message": "Login successful",    │
│   "data": {                         │
│     "user": { ... },                │
│     "token": "eyJhbGc..."          │
│   }                                 │
│ }                                   │
└─────────────────────────────────────┘
```

### Protected Route Request
```
┌─────────────────────────────────────┐
│ GET /api/auth/me                    │
│                                     │
│ Headers:                            │
│ Authorization: Bearer eyJhbGc...   │
│                                     │
│ Body: (empty)                       │
└─────────────────────────────────────┘
         │
         ▼ (Verify token)
         │
    ✓ Valid   ✗ Invalid/Missing
         │         │
         ▼         ▼
    ┌────────┐ ┌─────────────┐
    │ 200 OK │ │ 401 Unauth. │
    └────────┘ └─────────────┘
         │         │
         ▼         ▼
    Return user  Return error
    information  message
```

---

## 📊 Database Schema

### User Collection
```
User Document {
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  
  "username": "john_doe",              ← Required, Unique
  "email": "john@example.com",         ← Required, Unique
  "password": "$2a$10$N9qo8u...",     ← Hashed with bcrypt
  
  "firstName": "John",                 ← Optional
  "lastName": "Doe",                   ← Optional
  
  "createdAt": ISODate("2024-01-15"),
  "updatedAt": ISODate("2024-01-15")
}
```

---

## 🛡️ Security Layers

```
┌─────────────────────────────────────────┐
│ Layer 1: Input Validation               │
│ - Username: 3-20 chars                 │
│ - Email: Valid format                  │
│ - Password: 6+ chars                   │
│ - Duplicate check                      │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│ Layer 2: Password Hashing               │
│ - bcryptjs with 10 rounds              │
│ - Salt generation                      │
│ - Secure comparison                    │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│ Layer 3: Token Security                 │
│ - JWT with HS256                       │
│ - 7-day expiration                     │
│ - Secret verification                  │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│ Layer 4: Protected Routes               │
│ - Bearer token verification            │
│ - User attachment to request           │
│ - Middleware protection                │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│ Layer 5: Error Handling                 │
│ - No sensitive info leaked             │
│ - Proper HTTP codes                    │
│ - Clear error messages                 │
└─────────────────────────────────────────┘
```

---

## 🔄 Token Verification Process

```
Client Request:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
       │
       ▼
┌────────────────────────────────┐
│ middleware/authMiddleware.js   │
│                                │
│ 1. Extract token from header   │
│    Split "Bearer token"        │
│                                │
│ 2. Verify with secret          │
│    jwt.verify(token, secret)   │
│                                │
│ 3. Check signature             │
│    Valid? Continue            │
│                                │
│ 4. Check expiration            │
│    Expired? Return 401         │
│                                │
│ 5. Extract user ID             │
│    decoded.id                  │
│                                │
│ 6. Attach to request           │
│    req.user = {id}             │
│                                │
│ 7. Call next middleware        │
│    next()                      │
└────────────────┬───────────────┘
                 │
                 ▼
        ┌────────────────┐
        │  Controller    │
        │  getMe()       │
        └────────────────┘
                 │
                 ▼
        Return user data
```

---

## 📁 File Organization

```
auth-app/
│
├─ 📖 Documentation
│  │  All guides for learning and reference
│  │  Start with README.md or QUICKSTART.md
│  │
│  ├─ README.md (Complete reference)
│  ├─ QUICKSTART.md (5-min setup)
│  ├─ CODE_REFERENCE.md (Code explained)
│  ├─ TESTING_GUIDE.md (How to test)
│  ├─ DEPLOYMENT_GUIDE.md (Deploy to Render)
│  ├─ ENVIRONMENT_SETUP.md (Setup config)
│  └─ ... (more guides)
│
├─ ⚙️ Configuration
│  │  Setup and environment
│  │
│  ├─ package.json (Dependencies)
│  ├─ .env.example (Environment template)
│  └─ .gitignore (Git ignore rules)
│
├─ 🔗 API
│  │
│  └─ postman_collection.json (Test collection)
│
└─ 💻 Source Code (MVC)
   │
   └─ src/
      │
      ├─ server.js (Main app entry)
      │
      ├─ config/
      │  └─ database.js (MongoDB connection)
      │
      ├─ controllers/
      │  └─ authController.js (Logic)
      │
      ├─ middleware/
      │  └─ authMiddleware.js (JWT verify)
      │
      ├─ models/
      │  └─ User.js (Schema & validation)
      │
      └─ routes/
         └─ authRoutes.js (Endpoints)
```

---

## 📊 Deployment Architecture

```
┌──────────────┐
│  Your Local  │
│  Computer    │
└───────┬──────┘
        │
        │ git push
        │
        ▼
┌──────────────────┐
│  GitHub          │
│  Repository      │
│  - Source code   │
│  - All files     │
└───────┬──────────┘
        │
        │ Webhook trigger
        │
        ▼
┌──────────────────────────────┐
│  Render Server               │
│  - Node.js runtime           │
│  - Express app running       │
│  - Public HTTPS URL          │
│  - Auto-redeploy on push     │
└───────┬──────────────────────┘
        │
        │
        ▼
┌──────────────────────────────┐
│  MongoDB Atlas               │
│  - Cloud database            │
│  - User data stored          │
│  - Secure connection         │
└──────────────────────────────┘
```

---

## 🧪 Testing Workflow

```
START
  │
  ▼
┌──────────────────────┐
│ 1. Register          │
│ POST /register       │
│ {credentials}        │
└─────────┬────────────┘
          │ ✓ Success
          ▼
  ┌────────────────┐
  │ Get token      │
  │ Save token     │
  └────────┬───────┘
           │
           ▼
┌──────────────────────┐
│ 2. Login             │
│ POST /login          │
│ {email, password}    │
└─────────┬────────────┘
          │ ✓ Success
          ▼
  ┌────────────────┐
  │ Get token      │
  │ Compare tokens │
  └────────┬───────┘
           │
           ▼
┌──────────────────────┐
│ 3. Get Current User  │
│ GET /me              │
│ [Bearer token]       │
└─────────┬────────────┘
          │ ✓ Success
          ▼
  ┌────────────────┐
  │ Verify user    │
  │ All tests pass │
  └────────┬───────┘
           │
           ▼
         END ✓
```

---

## 📋 HTTP Status Code Reference

```
┌──────┬──────────────────────────────┬─────────────────────┐
│ Code │ Meaning                      │ When Used           │
├──────┼──────────────────────────────┼─────────────────────┤
│ 200  │ OK                           │ Login successful    │
│ 201  │ Created                      │ Register successful │
│ 400  │ Bad Request                  │ Missing fields      │
│ 401  │ Unauthorized                 │ Invalid token/creds │
│ 404  │ Not Found                    │ User not found      │
│ 409  │ Conflict                     │ Duplicate user      │
│ 500  │ Internal Server Error        │ Server error        │
└──────┴──────────────────────────────┴─────────────────────┘
```

---

## 🎯 Your Journey

```
START HERE
    │
    ├─► Want to run NOW?
    │   └─► Read: QUICKSTART.md
    │       └─► npm install && npm run dev
    │
    ├─► Need to understand?
    │   └─► Read: CODE_REFERENCE.md
    │       └─► Review src/ files
    │
    ├─► Ready to test?
    │   └─► Read: TESTING_GUIDE.md
    │       └─► Import Postman collection
    │
    └─► Ready to deploy?
        └─► Read: DEPLOYMENT_GUIDE.md
            └─► GitHub → Render → Submit URLs
```

---

## ✅ Checklist

- [ ] Environment set up
- [ ] Dependencies installed
- [ ] Server running
- [ ] Postman imported
- [ ] Register endpoint tested
- [ ] Login endpoint tested
- [ ] Protected route tested
- [ ] Ready for deployment

---

**Save this page for quick reference!**
