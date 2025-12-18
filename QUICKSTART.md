# Quick Start Guide

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create `.env` file in root directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/auth-app
JWT_SECRET=your_secret_key_here_change_in_production
NODE_ENV=development
```

### 3. Start MongoDB
```bash
# Using local MongoDB
mongod

# OR use MongoDB Atlas cloud connection
# Update MONGODB_URI in .env with your cloud connection string
```

### 4. Run Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server will be available at: `http://localhost:5000`

---

## Testing with Postman

### Step 1: Import Collection
- Open Postman
- Click **Import**
- Select `postman_collection.json`

### Step 2: Set Environment Variable
1. Create/Select environment
2. Add variable:
   - Key: `baseUrl`
   - Value: `http://localhost:5000`

### Step 3: Test Endpoints

**Register a User:**
- Select `Register User` request
- Modify request body with your data
- Click Send
- Copy the `token` from response

**Login:**
- Select `Login User` request
- Modify email and password
- Click Send
- Copy the `token` from response

**Get Current User:**
- Select `Get Current User` request
- In Headers, paste token: `Bearer your_token_here`
- Click Send

---

## Project Structure Explanation

```
src/
├── config/database.js      → MongoDB connection setup
├── controllers/authController.js → Business logic (register, login, getMe)
├── middleware/authMiddleware.js → JWT verification middleware
├── models/User.js          → User schema and password hashing
├── routes/authRoutes.js    → API routes
└── server.js               → Express app setup
```

---

## Key Features

✅ **Password Security** - Passwords are hashed with bcryptjs before storage
✅ **JWT Tokens** - Expire in 7 days
✅ **Validation** - Input validation on all endpoints
✅ **Error Handling** - Comprehensive error messages
✅ **Protected Routes** - `/api/auth/me` requires valid token

---

## API Endpoints Summary

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| POST | `/api/auth/register` | Create new user | No |
| POST | `/api/auth/login` | Login and get token | No |
| GET | `/api/auth/me` | Get user info | Yes (Bearer token) |

---

## Deployment Checklist

Before deploying to Render:

- [ ] Change `JWT_SECRET` to a strong value
- [ ] Set `NODE_ENV=production`
- [ ] Use MongoDB Atlas for database
- [ ] Update `MONGODB_URI` with cloud connection
- [ ] Push code to GitHub
- [ ] Add environment variables in Render
- [ ] Deploy on Render.com

---

## Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running locally or connection string is correct
- Check MONGODB_URI in .env

**Port Already in Use:**
- Change PORT in .env or kill process using port 5000

**Token Expired:**
- Get new token by logging in again

**Invalid Token:**
- Ensure token is passed in `Authorization: Bearer <token>` header
- Check token format in Postman

---

## Next Steps

1. ✅ Install dependencies
2. ✅ Configure environment
3. ✅ Start MongoDB
4. ✅ Run server
5. ✅ Test with Postman
6. ✅ Deploy to Render
7. ✅ Push to GitHub
