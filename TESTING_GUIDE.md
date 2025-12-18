# API Testing Guide & Troubleshooting

## 🧪 Step-by-Step API Testing

### Prerequisites
- Server running on `http://localhost:5000`
- MongoDB running
- Postman installed (or use cURL)

---

## 📝 Test Scenario 1: Complete Registration Flow

### Step 1: Register a New User

**Postman:**
1. Create new request: `POST`
2. URL: `http://localhost:5000/api/auth/register`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "username": "testuser123",
  "email": "testuser@example.com",
  "password": "secure_password_123",
  "firstName": "Test",
  "lastName": "User"
}
```

**cURL:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser123",
    "email": "testuser@example.com",
    "password": "secure_password_123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "testuser123",
      "email": "testuser@example.com",
      "firstName": "Test",
      "lastName": "User",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsImlhdCI6MTcwNTMyMDYwMCwiZXhwIjoxNzA1OTI1NDAwfQ.example"
  }
}
```

**🔍 Copy the token value for next steps**

---

### Step 2: Login with Email and Password

**Postman:**
1. Create new request: `POST`
2. URL: `http://localhost:5000/api/auth/login`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "email": "testuser@example.com",
  "password": "secure_password_123"
}
```

**cURL:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "secure_password_123"
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "testuser123",
      "email": "testuser@example.com",
      "firstName": "Test",
      "lastName": "User",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsImlhdCI6MTcwNTMyMDYwMCwiZXhwIjoxNzA1OTI1NDAwfQ.example"
  }
}
```

---

### Step 3: Access Protected Route with Token

**Postman:**
1. Create new request: `GET`
2. URL: `http://localhost:5000/api/auth/me`
3. Headers:
   - `Authorization: Bearer YOUR_TOKEN_HERE`
   - Replace `YOUR_TOKEN_HERE` with token from step 1 or 2

**cURL:**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "testuser123",
    "email": "testuser@example.com",
    "firstName": "Test",
    "lastName": "User",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

---

## ⚠️ Error Scenarios

### Error: Missing Required Fields

**Request:**
```json
{
  "username": "testuser",
  "email": "test@example.com"
}
```

**Response (400):**
```json
{
  "success": false,
  "message": "Please provide username, email, and password"
}
```

---

### Error: User Already Exists

**Request:** (same email/username already registered)

**Response (409):**
```json
{
  "success": false,
  "message": "User with this email or username already exists"
}
```

---

### Error: Invalid Credentials

**Request:**
```json
{
  "email": "testuser@example.com",
  "password": "wrong_password"
}
```

**Response (401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### Error: Missing Token

**Request:** GET `/api/auth/me` without Authorization header

**Response (401):**
```json
{
  "success": false,
  "message": "Not authorized to access this route. Please provide a valid token."
}
```

---

### Error: Invalid Token

**Request:** GET `/api/auth/me` with invalid token

**Response (401):**
```json
{
  "success": false,
  "message": "Invalid token"
}
```

---

### Error: Expired Token

**Request:** GET `/api/auth/me` with expired token (after 7 days)

**Response (401):**
```json
{
  "success": false,
  "message": "Token has expired"
}
```

---

## 🔧 Troubleshooting

### Issue: "Cannot connect to MongoDB"

**Solution:**
1. Ensure MongoDB is running:
   ```bash
   mongod
   ```
2. Check connection string in `.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/auth-app
   ```
3. For MongoDB Atlas, ensure IP is whitelisted

---

### Issue: "Port 5000 is already in use"

**Solution:**
1. Change port in `.env`:
   ```
   PORT=5001
   ```
2. Or kill process on port 5000:
   - Windows: `netstat -ano | findstr :5000`
   - Mac/Linux: `lsof -ti:5000 | xargs kill -9`

---

### Issue: "JWT_SECRET is not defined"

**Solution:**
1. Ensure `.env` file exists
2. Contains: `JWT_SECRET=your_secret_key`
3. Restart server after creating `.env`

---

### Issue: "Token verification failed"

**Solution:**
1. Ensure token format is correct: `Bearer YOUR_TOKEN`
2. Check token is not expired (7-day expiration)
3. Verify token was copied completely without spaces
4. Use token from same login/register response

---

### Issue: "CORS error in Postman/Browser"

**Solution:**
- CORS is enabled in the app
- Check that you're sending requests from same domain
- Try without CORS if testing with cURL

---

## ✅ Testing Checklist

- [ ] Server starts without errors
- [ ] MongoDB connects successfully
- [ ] Register endpoint accepts valid data
- [ ] Register prevents duplicate username/email
- [ ] Register returns JWT token
- [ ] Login endpoint accepts valid credentials
- [ ] Login returns JWT token
- [ ] Protected route rejects missing token
- [ ] Protected route rejects invalid token
- [ ] Protected route accepts valid token
- [ ] Protected route returns user data
- [ ] Password is hashed (not visible in database)
- [ ] Error messages are clear

---

## 📊 Token Structure

JWT tokens consist of 3 parts (separated by dots):
```
header.payload.signature
```

**Header:** Algorithm and token type
**Payload:** User ID and issuance info
**Signature:** Verification signature

You can decode tokens at https://jwt.io/ (for testing only)

---

## 🔐 Security Testing

### Test 1: Password Hashing
1. Register a user
2. Check database: password should NOT be visible as plain text
3. Password should start with `$2a$` (bcrypt format)

### Test 2: Token Security
1. Login to get token
2. Try modifying token and sending it
3. Should receive "Invalid token" error
4. Cannot forge new tokens without secret

### Test 3: Token Expiration
1. Manually edit JWT_SECRET in code
2. Restart server
3. Old tokens should become invalid

---

## 📱 Postman Collection Tips

1. **Set Environment Variable:**
   - Click "Environments"
   - Create new environment
   - Add: `baseUrl = http://localhost:5000`
   - Add: `token = [leave empty initially]`

2. **Auto-capture Token:**
   - Go to register/login response
   - Right-click token value
   - Select "Set: token"
   - Token auto-populates in headers

3. **Request Pre-requisites:**
   - Set up login request to run before protected route
   - Auto-generates fresh token each time

---

## 🎯 Common Test Cases

| Test | Method | URL | Headers | Body | Expected |
|------|--------|-----|---------|------|----------|
| Register | POST | /register | JSON | username, email, pwd | 201, token |
| Duplicate | POST | /register | JSON | existing email | 409 |
| Login Valid | POST | /login | JSON | email, pwd | 200, token |
| Login Invalid | POST | /login | JSON | email, wrong pwd | 401 |
| Get Me Valid | GET | /me | Auth: Bearer token | - | 200, user |
| Get Me No Auth | GET | /me | - | - | 401 |
| Get Me Bad Token | GET | /me | Auth: Bearer invalid | - | 401 |

---

## 💾 Sample Data

**Test User 1:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "John@123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Test User 2:**
```json
{
  "username": "jane_smith",
  "email": "jane@example.com",
  "password": "Jane@456",
  "firstName": "Jane",
  "lastName": "Smith"
}
```

---

**Happy Testing! 🚀**
