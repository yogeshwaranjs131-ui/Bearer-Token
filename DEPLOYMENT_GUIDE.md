# Deployment Guide for Render

Complete guide to deploy your authentication app to Render and set up GitHub.

---

## 📋 Pre-Deployment Checklist

- [ ] All code tested locally
- [ ] `.env` file created and working
- [ ] MongoDB running and tested
- [ ] All API endpoints working
- [ ] Code committed to Git

---

## 🔐 Step 1: Prepare for Production

### Update Environment Variables

Edit `.env`:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string_here
JWT_SECRET=generate_a_strong_random_secret_key_32_chars_minimum
NODE_ENV=production
```

### Generate Strong JWT Secret

Use this command to generate a secure secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Or use an online tool: https://www.uuidgenerator.net/

Example secure secret:
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f
```

---

## 📦 Step 2: Set Up MongoDB Atlas (Cloud Database)

### Create MongoDB Atlas Account

1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Sign Up"
3. Create account
4. Accept the service terms

### Create Cluster

1. Click "Create" on left panel
2. Choose "Shared" (free tier)
3. Select region closest to Render server
4. Click "Create Cluster"
5. Wait 2-3 minutes for cluster creation

### Create Database User

1. Go to "Database Access" → "Add New Database User"
2. Username: `authapp_user`
3. Password: Generate secure password
4. Add User

### Get Connection String

1. Go to "Databases" → Click "Connect"
2. Choose "Drivers" → Node.js
3. Copy connection string
4. Replace `<username>` and `<password>` with your credentials
5. Replace `<database>` with `auth-app`

**Example:**
```
mongodb+srv://authapp_user:your_password@cluster0.xyz123.mongodb.net/auth-app?retryWrites=true&w=majority
```

### Allow Network Access

1. Go to "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for testing)
4. Click "Confirm"

---

## 🐙 Step 3: Push Code to GitHub

### Initialize Git Repository

```bash
cd auth-app
git init
```

### Create .gitignore

Already created, verify it contains:
```
node_modules/
.env
.env.local
.DS_Store
*.log
```

### Commit Code

```bash
git add .
git commit -m "Initial commit: User authentication with JWT"
```

### Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `auth-app`
3. Description: "User Authentication and Authorization with Bearer Token"
4. Choose "Public" (required for terms)
5. Click "Create repository"

### Connect Local to GitHub

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/auth-app.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

---

## 🚀 Step 4: Deploy to Render

### Create Render Account

1. Go to https://render.com
2. Click "Sign Up"
3. Connect GitHub account
4. Authorize Render

### Create Web Service

1. Dashboard → "New +" → "Web Service"
2. Connect repository: Select `auth-app`
3. Click "Connect"

### Configure Web Service

**Settings:**

| Setting | Value |
|---------|-------|
| Name | auth-app |
| Environment | Node |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Plan | Free |

### Add Environment Variables

1. Scroll to "Environment" section
2. Click "Add Environment Variable"

**Add each variable:**

1. **PORT**
   - Key: `PORT`
   - Value: `5000`
   - Add

2. **MONGODB_URI**
   - Key: `MONGODB_URI`
   - Value: (Your MongoDB Atlas connection string)
   - Add

3. **JWT_SECRET**
   - Key: `JWT_SECRET`
   - Value: (Your generated secret from Step 1)
   - Add

4. **NODE_ENV**
   - Key: `NODE_ENV`
   - Value: `production`
   - Add

### Deploy

1. Click "Create Web Service"
2. Wait for deployment (2-3 minutes)
3. You'll see a live URL like: `https://auth-app.onrender.com`

### Monitor Deployment

- Go to "Logs" tab to see build/runtime logs
- Check for any errors
- If failed, check environment variables and MongoDB connection

---

## ✅ Step 5: Test Deployed Application

### Get Your Server URL

From Render dashboard:
```
https://auth-app.onrender.com
```

### Test Endpoints

**Register:**
```bash
curl -X POST https://auth-app.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

**Login:**
```bash
curl -X POST https://auth-app.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

**Get User:**
```bash
curl -X GET https://auth-app.onrender.com/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🔄 Step 6: Update Postman for Production

### Update Base URL in Postman

1. Open Postman
2. Go to Environments
3. Edit environment:
   - `baseUrl: https://auth-app.onrender.com`
4. Select this environment
5. Run tests again

---

## 📝 Submission Requirements

### Prepare Submission

You need to submit:

1. **GitHub Repository URL**
   ```
   https://github.com/YOUR_USERNAME/auth-app
   ```

2. **Deployed Server URL**
   ```
   https://auth-app.onrender.com
   ```

3. **Postman Collection** (Optional but helpful)
   - Export your Postman collection
   - Include in GitHub repository

### GitHub Repository Checklist

- [ ] All source code uploaded
- [ ] `.env.example` included (no `.env`)
- [ ] `README.md` with instructions
- [ ] `package.json` with all dependencies
- [ ] Postman collection included
- [ ] Clear commit messages
- [ ] No company name mentioned anywhere

### Required Files in Repository

```
README.md                    ✅
QUICKSTART.md               ✅
TESTING_GUIDE.md            ✅
IMPLEMENTATION_SUMMARY.md   ✅
package.json                ✅
.env.example                ✅
.gitignore                  ✅
postman_collection.json     ✅
src/
├── server.js               ✅
├── config/database.js      ✅
├── controllers/            ✅
├── middleware/             ✅
├── models/                 ✅
└── routes/                 ✅
```

---

## 🔄 Continuous Updates

### To Deploy New Changes

1. Make code changes locally
2. Test thoroughly
3. Commit changes:
   ```bash
   git add .
   git commit -m "Describe changes"
   git push origin main
   ```
4. Render automatically redeploys (check webhook settings)
5. Monitor logs in Render dashboard

---

## ⚠️ Troubleshooting Deployment

### Build Failed

**Check:**
1. Go to Logs tab
2. Look for error messages
3. Common causes:
   - Missing environment variables
   - Invalid MongoDB connection string
   - Syntax errors in code

### Application Crashes

**Check:**
1. Logs tab for error messages
2. Verify all environment variables are set
3. MongoDB Atlas allows network access
4. Connection string is correct

### Slow Cold Starts

- This is normal on free Render tier
- Service goes to sleep after 15 min of inactivity
- Will restart when accessed

### Port Issues

- Ensure app listens to `process.env.PORT`
- Default to 5000 if not set
- Don't hardcode port in code

---

## 🔗 Useful Links

- **Render Docs:** https://render.com/docs
- **MongoDB Atlas:** https://www.mongodb.com/cloud/atlas
- **GitHub:** https://github.com
- **JWT Decoder:** https://jwt.io/ (for debugging)

---

## 📊 Deployment Summary

```
┌─────────────────────────────────────┐
│   Local Development                 │
│   - Node.js + Express               │
│   - MongoDB (local)                 │
│   - npm run dev                     │
└────────────┬────────────────────────┘
             │
             │ Git Push
             ↓
┌─────────────────────────────────────┐
│   GitHub Repository                 │
│   - Source code                     │
│   - Documentation                   │
│   - Public access                   │
└────────────┬────────────────────────┘
             │
             │ Render Deploy
             ↓
┌─────────────────────────────────────┐
│   Render Server                     │
│   - Production Node.js              │
│   - MongoDB Atlas (cloud)           │
│   - Public HTTPS URL                │
│   - Auto-redeployment               │
└─────────────────────────────────────┘
```

---

## 🎉 You're Live!

Your authentication API is now accessible worldwide at:
```
https://auth-app.onrender.com
```

### Share Your URLs

1. GitHub: `https://github.com/YOUR_USERNAME/auth-app`
2. Deployed API: `https://auth-app.onrender.com`
3. Postman Collection: (export from Postman)

---

**Deployment Complete! 🚀**
