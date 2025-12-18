# Environment Setup Guide

Complete guide for setting up your development environment.

---

## Prerequisites

### Required Software

- **Node.js** (v14+) - https://nodejs.org/
- **npm** (comes with Node.js)
- **Git** - https://git-scm.com/
- **MongoDB** (local or cloud)
- **Postman** - https://www.postman.com/

### Verify Installation

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check Git version
git --version
```

---

## 📥 Step 1: Install Dependencies

Navigate to project folder:
```bash
cd auth-app
```

Install all dependencies:
```bash
npm install
```

This installs:
- express - Web framework
- mongoose - MongoDB ORM
- jsonwebtoken - JWT tokens
- bcryptjs - Password hashing
- dotenv - Environment variables
- cors - Cross-origin requests
- nodemon - Auto-reload (dev only)

---

## ⚙️ Step 2: Configure Environment Variables

### Create .env File

Copy the template:
```bash
cp .env.example .env
```

### Edit .env with Your Values

Open `.env` in your editor:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/auth-app
JWT_SECRET=your_secret_key_here_change_in_production
NODE_ENV=development
```

### Generate Strong JWT_SECRET

**Option 1: Using Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Option 2: Online Generator**
- Visit https://www.uuidgenerator.net/
- Generate and copy the UUID

**Option 3: Manual**
```
Minimum 32 characters: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3
```

---

## 🗄️ Step 3: Set Up MongoDB

### Option A: Local MongoDB (Development)

#### Windows

1. **Download MongoDB**
   - Go to https://www.mongodb.com/try/download/community
   - Download MongoDB Community Server
   - Run installer
   - Complete installation

2. **Start MongoDB Service**
   ```bash
   mongod
   ```

3. **Verify Connection**
   ```bash
   mongo
   # Should connect to MongoDB
   ```

#### macOS

```bash
# Install with Homebrew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Verify
mongo
```

#### Linux (Ubuntu)

```bash
# Install
sudo apt-get install mongodb

# Start service
sudo systemctl start mongodb

# Verify
mongo
```

**Use in .env:**
```
MONGODB_URI=mongodb://localhost:27017/auth-app
```

---

### Option B: MongoDB Atlas (Cloud - Recommended)

1. **Create Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up with Google/GitHub/Email
   - Verify email

2. **Create Cluster**
   - Click "Build a Cluster"
   - Choose "Free" tier
   - Select region closest to you
   - Click "Create Cluster"
   - Wait 2-3 minutes

3. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Username: `authapp_user`
   - Password: `Generate` (copy this)
   - Click "Add User"

4. **Get Connection String**
   - Go to "Clusters" → "Connect"
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<username>` and `<password>`
   - Replace `<database>` with `auth-app`

5. **Allow Network Access**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Select "Allow access from anywhere"
   - Click "Confirm"

**Example connection string:**
```
mongodb+srv://authapp_user:your_password@cluster0.xyz.mongodb.net/auth-app?retryWrites=true&w=majority
```

**Use in .env:**
```
MONGODB_URI=mongodb+srv://authapp_user:your_password@cluster0.xyz.mongodb.net/auth-app?retryWrites=true&w=majority
```

---

## 🚀 Step 4: Start the Server

### Development Mode (Auto-reload)

```bash
npm run dev
```

Output should show:
```
Server running on http://localhost:5000
MongoDB connected successfully
```

### Production Mode

```bash
npm start
```

### Troubleshooting Server Issues

**Port already in use:**
```bash
# Change in .env
PORT=5001

# Or kill process using port 5000
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

**MongoDB connection error:**
- Ensure MongoDB is running
- Check connection string in .env
- Verify database user credentials
- Check network access if using Atlas

---

## 📱 Step 5: Install Postman

1. Download from https://www.postman.com/downloads/
2. Install for your operating system
3. Create free account or skip
4. Open Postman

### Import Collection

1. Open Postman
2. Click "Import"
3. Select `postman_collection.json` from your project
4. Collection added to Postman

### Set Environment

1. Click "Environments"
2. Click "Create New"
3. Add variable:
   - Name: `baseUrl`
   - Initial Value: `http://localhost:5000`
4. Click "Save"
5. Select this environment for requests

---

## ✅ Verification Checklist

### After Installation

- [ ] Node.js installed: `node --version`
- [ ] npm installed: `npm --version`
- [ ] Dependencies installed: `ls node_modules`
- [ ] .env file created and configured
- [ ] MongoDB running
- [ ] Server starts: `npm run dev`
- [ ] Postman collection imported

### Expected Output

```
npm run dev

> nodemon src/server.js

[nodemon] 3.0.1
[nodemon] to restart at any time, type `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js
Server running on http://localhost:5000
MongoDB connected successfully
```

---

## 🧪 Quick Test

### Test with cURL

Register user:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "test123"
  }'
```

### Test with Postman

1. Open Postman
2. Select "Register User" request
3. Click "Send"
4. Should see success response

---

## 🔧 IDE Setup (Optional but Recommended)

### Visual Studio Code

1. **Install VS Code:** https://code.visualstudio.com/
2. **Install Extensions:**
   - REST Client
   - MongoDB for VS Code
   - Thunder Client
   - Postman
   - Code Formatter

3. **Open Project:**
   ```bash
   code auth-app
   ```

### Settings

Create `.vscode/settings.json`:
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.tabSize": 2,
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

---

## 🔐 Security Setup

### Create .env File (IMPORTANT)

```bash
# This file is in .gitignore - never commit!
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGODB_URI=your_database_connection
JWT_SECRET=your_generated_secret_key
NODE_ENV=development
```

### Add .gitignore Rule

Already included, verify:
```
node_modules/
.env
.env.local
.DS_Store
*.log
```

---

## 📚 Useful Commands

### Development

```bash
# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Install new package
npm install package-name

# Update all packages
npm update
```

### Database

```bash
# Connect to MongoDB
mongo

# Show databases
show dbs

# Use database
use auth-app

# Show collections
show collections

# Find users
db.users.find()
```

### Git

```bash
# Initialize repository
git init

# Add files
git add .

# Commit
git commit -m "message"

# Push to GitHub
git push origin main
```

---

## 🆘 Troubleshooting

### Issue: npm install fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: Module not found

**Solution:**
```bash
# Ensure you're in correct directory
cd auth-app

# Install dependencies
npm install

# Restart server
npm run dev
```

### Issue: Port 5000 in use

**Solution:**
- Change PORT in .env to different number
- Or kill process using port 5000

### Issue: Cannot connect to MongoDB

**Solution:**
- Ensure MongoDB is running
- Check MONGODB_URI is correct
- Verify credentials for cloud database
- Check network access for cloud

---

## ✨ Environment Ready!

Your development environment is now set up:

- ✅ Node.js and npm installed
- ✅ Dependencies installed
- ✅ .env configured
- ✅ MongoDB running
- ✅ Server starts successfully
- ✅ Postman ready for testing

**Next Step:** See QUICKSTART.md for running your first test!

---

## 📝 Environment Checklists

### Development Environment
- [ ] Node.js v14+
- [ ] npm latest
- [ ] Git installed
- [ ] Code editor (VS Code)
- [ ] Postman installed
- [ ] MongoDB local or Atlas account

### Project Configuration
- [ ] .env file created
- [ ] JWT_SECRET generated
- [ ] PORT configured
- [ ] MONGODB_URI set
- [ ] NODE_ENV=development
- [ ] .gitignore updated

### Server Ready
- [ ] npm install complete
- [ ] npm run dev works
- [ ] MongoDB connects
- [ ] Server runs at localhost:5000
- [ ] Postman collection imported
- [ ] First endpoint tested

---

**Your environment is configured and ready to code! 🎉**
