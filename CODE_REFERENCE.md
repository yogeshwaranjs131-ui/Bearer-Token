# Code Reference & Key Concepts

Quick reference guide for understanding the authentication system.

---

## 🔑 Key Concepts

### 1. Password Hashing with bcryptjs

```javascript
// During registration/password change
const salt = await bcrypt.genSalt(10);  // Generate salt with 10 rounds
const hashedPassword = await bcrypt.hash(password, salt);

// During login
const isValid = await bcrypt.compare(inputPassword, storedHashedPassword);
```

**Why?** Passwords are never stored in plain text. If database is breached, attackers can't use passwords directly.

---

### 2. JWT Token Generation

```javascript
const token = jwt.sign(
  { id: userId },              // Payload: user ID
  process.env.JWT_SECRET,      // Secret key
  { expiresIn: "7d" }         // Expires in 7 days
);
```

**Token Parts:**
- **Header:** Algorithm (HS256)
- **Payload:** User ID + timestamp
- **Signature:** Verification hash

**Lifetime:** 7 days → User must login again after

---

### 3. Bearer Token Verification

```javascript
// Token comes in header as: "Bearer eyJhbGciOiJIUzI1NiIs..."
const token = req.headers.authorization.split(" ")[1];

// Verify token
const decoded = jwt.verify(token, process.env.JWT_SECRET);
console.log(decoded.id);  // Contains user ID
```

**In Headers:** `Authorization: Bearer <token>`

---

## 📂 File Structure Explanation

### Config Directory

**`config/database.js`** - Database connection
```javascript
connectDB() → Connects to MongoDB
```

### Models Directory

**`models/User.js`** - User schema
```javascript
Fields: username, email, password, firstName, lastName
Pre-save: Hashes password automatically
Methods: matchPassword(), toJSON()
```

### Controllers Directory

**`controllers/authController.js`** - Business logic
```javascript
register()  → Create new user
login()     → Verify & issue token
getMe()     → Return current user
```

### Middleware Directory

**`middleware/authMiddleware.js`** - Request protection
```javascript
protect()  → Verify token, attach user to request
```

### Routes Directory

**`routes/authRoutes.js`** - API endpoints
```javascript
POST /register    → register controller
POST /login       → login controller
GET /me          → protect middleware + getMe controller
```

---

## 🔐 Security Features Explained

### 1. Password Security

```
Plain Password: "password123"
       ↓ (bcrypt with 10 salt rounds)
Hashed: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86U7tS34uC2"
```

**Why 10 rounds?** Balance between security and speed. Takes ~100ms to hash.

---

### 2. Token Security

```
Login → Server generates token with secret → Send to client
        ↓
Client stores token → Sends with each request in Authorization header
        ↓
Server verifies token using same secret → Allows access if valid
```

**Attacker can't:**
- Forge new tokens (don't have secret)
- Modify token (signature breaks)
- Use expired tokens (timestamp checked)

---

### 3. Input Validation

```javascript
// Username: 3-20 characters
// Email: Valid format (user@domain.com)
// Password: Minimum 6 characters
// Email & Username: Unique (no duplicates)
```

**Example validation:**
```javascript
if (!username || !email || !password) {
  return res.status(400).json({
    success: false,
    message: "Missing required fields"
  });
}
```

---

## 📡 API Request/Response Flow

### Registration Flow

```
1. Client sends: POST /register
   {username, email, password}
   ↓
2. Server validates input
   ↓
3. Server checks if user exists
   ↓
4. Server hashes password
   ↓
5. Server saves to MongoDB
   ↓
6. Server generates JWT token
   ↓
7. Server returns: {user, token}
```

### Login Flow

```
1. Client sends: POST /login
   {email, password}
   ↓
2. Server finds user by email
   ↓
3. Server compares password using bcrypt
   ↓
4. Server generates JWT token
   ↓
5. Server returns: {user, token}
```

### Protected Route Flow

```
1. Client sends: GET /me
   Header: Authorization: Bearer token
   ↓
2. Middleware extracts token from header
   ↓
3. Middleware verifies token using secret
   ↓
4. Middleware attaches user ID to request
   ↓
5. Controller returns user info
```

---

## 🛠️ Common Code Patterns

### Error Handling Pattern

```javascript
try {
  // Do something
} catch (error) {
  // Handle error
  if (error.name === "ValidationError") {
    return res.status(400).json({...});
  }
  if (error.code === 11000) {  // Duplicate key
    return res.status(409).json({...});
  }
  throw error;
}
```

### Middleware Pattern

```javascript
exports.protect = async (req, res, next) => {
  // Extract token
  // Verify token
  // Attach user to request
  next();  // Pass to next middleware/controller
};

// Usage: app.get("/route", protect, controller);
```

### Controller Pattern

```javascript
exports.functionName = async (req, res, next) => {
  try {
    // Extract data from request
    const data = req.body;
    
    // Validate
    if (!data.required) return res.status(400).json({...});
    
    // Process
    const result = await Model.save(data);
    
    // Respond
    res.status(200).json({success: true, data: result});
  } catch (error) {
    next(error);  // Pass to error handler
  }
};
```

---

## 🔄 Data Flow Examples

### Example 1: User Registration

**Request:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "pass123"
}
```

**Server Processing:**
```javascript
1. Validate: All fields present? ✅
2. Check duplicate: Email exists? ❌
3. Hash password: "pass123" → "$2a$10$..."
4. Save to DB: User document created
5. Generate token: jwt.sign({id: user._id})
6. Return: {user, token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "john_doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Example 2: Token Verification

**Client sends:**
```
GET /api/auth/me
Header: Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Middleware processes:**
```javascript
1. Extract token from header
2. Split "Bearer token" → token
3. jwt.verify(token, secret)
   ✅ Valid → { id: "507f1f77bcf86cd799439011" }
4. req.user = { id: "507f1f77bcf86cd799439011" }
5. next() → Call controller
```

**Controller responds:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

---

## 🚨 Error Handling

### Bad Request (400)

```javascript
res.status(400).json({
  success: false,
  message: "Please provide email and password"
});
```

**When:** Missing or invalid input

---

### Unauthorized (401)

```javascript
res.status(401).json({
  success: false,
  message: "Invalid email or password"
});
```

**When:** Wrong credentials or missing token

---

### Conflict (409)

```javascript
res.status(409).json({
  success: false,
  message: "User with this email already exists"
});
```

**When:** Duplicate email or username

---

### Server Error (500)

```javascript
res.status(500).json({
  success: false,
  message: "Server error during token verification"
});
```

**When:** Unexpected server error

---

## 📋 HTTP Status Codes Used

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Login successful |
| 201 | Created | User registered |
| 400 | Bad Request | Missing fields |
| 401 | Unauthorized | Invalid token |
| 404 | Not Found | User not found |
| 409 | Conflict | Duplicate email |
| 500 | Server Error | Database error |

---

## 🔗 Related Technologies

### MongoDB Mongoose Methods

```javascript
User.findOne({email})           // Find single user
User.findById(id)               // Find by ID
User.find({})                   // Find all
await user.save()               // Save to DB
```

### Express Methods

```javascript
app.use(middleware)             // Apply middleware
app.get(route, controller)      // GET request
app.post(route, controller)     // POST request
req.body                        // Parse JSON body
res.status(code).json(data)    // Send JSON response
```

### JWT Methods

```javascript
jwt.sign(payload, secret, options)      // Generate token
jwt.verify(token, secret)               // Verify & decode
jwt.decode(token, {complete: true})    // Decode without verify
```

---

## 🧪 Testing Tips

### Test All Paths

1. **Happy Path:** Valid input → Success
2. **Error Path:** Invalid input → Error
3. **Edge Cases:** Boundary values → Expected behavior

### Example Test Cases

```javascript
// Valid registration
POST /register {valid data} → 201

// Invalid registration - missing field
POST /register {} → 400

// Duplicate registration
POST /register {same email} → 409

// Valid login
POST /login {correct credentials} → 200

// Invalid login - wrong password
POST /login {wrong password} → 401

// Protected route - with token
GET /me [Bearer token] → 200

// Protected route - without token
GET /me → 401
```

---

## 📚 Learning Resources

- **JWT Concepts:** https://jwt.io/introduction
- **bcryptjs Documentation:** https://github.com/dcodeIO/bcrypt.js
- **Express.js Guide:** https://expressjs.com/guide/routing.html
- **Mongoose Documentation:** https://mongoosejs.com/docs/guide.html
- **REST API Best Practices:** https://restfulapi.net/

---

## 🎯 Key Takeaways

1. **Never store passwords in plain text** → Always hash
2. **Tokens expire** → Security and forced re-authentication
3. **Verify tokens** → Only trusted requests access protected routes
4. **Validate input** → Prevent bad data in database
5. **Handle errors properly** → Clear messages, appropriate status codes
6. **Use environment variables** → Keep secrets out of code
7. **HTTPS in production** → Encrypt token in transit

---

**This reference covers the core concepts of the authentication system!**
