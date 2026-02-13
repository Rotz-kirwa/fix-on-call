# 🚀 Quick Start Guide - Fix On Call

## Prerequisites Check
```bash
# Check Python version (need 3.8+)
python3 --version

# Check Node.js version (need 18+)
node --version

# Check MongoDB status
mongod --version
```

## Step 1: Clone & Setup Backend

```bash
# Navigate to backend directory
cd FIX-ON-CALL-BACKEND-PROJECT

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # macOS/Linux
# OR
venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env

# Edit .env file with your settings
nano .env  # or use any text editor
```

### Minimum .env Configuration
```env
SECRET_KEY=your-random-secret-key-here
JWT_SECRET_KEY=your-random-jwt-secret-here
MONGO_URI=mongodb://localhost:27017/fix_on_call
FLASK_DEBUG=True
```

## Step 2: Start MongoDB

### macOS
```bash
brew services start mongodb-community
```

### Ubuntu/Debian
```bash
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Windows
```bash
# Start MongoDB service from Services app
# Or run: net start MongoDB
```

## Step 3: Initialize Database (Optional)

```bash
# Still in backend directory with venv activated
python3 << EOF
from pymongo import MongoClient
client = MongoClient('mongodb://localhost:27017/')
db = client['fix_on_call']

collections = ['users', 'services', 'bookings', 'payments', 'notifications']
for col in collections:
    if col not in db.list_collection_names():
        db.create_collection(col)
        print(f'✅ Created: {col}')

# Create indexes for better performance
db.users.create_index('email', unique=True)
db.services.create_index('user_id')
db.bookings.create_index('user_id')
print('✅ Indexes created')
EOF
```

## Step 4: Start Backend Server

```bash
# Make sure you're in FIX-ON-CALL-BACKEND-PROJECT directory
# and virtual environment is activated
python app.py
```

You should see:
```
 * Running on http://0.0.0.0:5000
 * Debug mode: on
```

**Keep this terminal open!**

## Step 5: Setup Frontend (New Terminal)

```bash
# Open new terminal
cd fix-on-call-platform

# Install dependencies
npm install

# Verify .env file exists
cat .env
# Should show: VITE_API_URL=http://localhost:5000/api

# Start development server
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:8080/
  ➜  Network: use --host to expose
```

## Step 6: Test the Application

### Open Browser
Navigate to: http://localhost:8080

### Test Registration
1. Click "Sign up" or go to http://localhost:8080/register
2. Fill in the form:
   - Name: John Doe
   - Email: john@example.com
   - Phone: +254712345678
   - Password: Test123!@#
   - Role: Driver
3. Click "Create Account"
4. Should redirect to driver dashboard

### Test Login
1. Go to http://localhost:8080/login
2. Enter credentials:
   - Email: john@example.com
   - Password: Test123!@#
3. Click "Sign In"
4. Should redirect to dashboard

### Test Protected Routes
1. Logout (if logged in)
2. Try to access: http://localhost:8080/driver
3. Should redirect to login page
4. After login, should access dashboard

## 🔍 Troubleshooting

### Backend Issues

#### Port 5000 already in use
```bash
# Find process using port 5000
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill the process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

#### MongoDB connection failed
```bash
# Check if MongoDB is running
sudo systemctl status mongod  # Linux
brew services list  # macOS

# Check MongoDB logs
tail -f /var/log/mongodb/mongod.log  # Linux
tail -f /usr/local/var/log/mongodb/mongo.log  # macOS
```

#### Module not found errors
```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### Frontend Issues

#### Port 8080 already in use
```bash
# Edit vite.config.ts and change port
# Or kill process using port 8080
lsof -i :8080  # macOS/Linux
kill -9 <PID>
```

#### Cannot connect to backend
```bash
# Verify backend is running on port 5000
curl http://localhost:5000/api/health

# Check .env file
cat .env
# Should have: VITE_API_URL=http://localhost:5000/api
```

#### npm install fails
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### CORS Errors

If you see CORS errors in browser console:

1. Check backend CORS configuration in `app.py`
2. Verify frontend is running on port 8080
3. Restart both backend and frontend

## 📝 Quick Commands Reference

### Backend
```bash
# Activate venv
source venv/bin/activate

# Start server
python app.py

# Run tests
pytest

# Deactivate venv
deactivate
```

### Frontend
```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## ✅ Success Checklist

- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:8080
- [ ] MongoDB is running
- [ ] Can access http://localhost:5000/api/health
- [ ] Can register new user
- [ ] Can login with credentials
- [ ] Protected routes redirect to login
- [ ] Dashboard loads after login

## 🎉 You're Ready!

If all checks pass, your Fix On Call platform is running successfully!

### Next Steps:
1. Create test accounts (driver and mechanic)
2. Explore the API endpoints
3. Start building additional features
4. Check IMPLEMENTATION_SUMMARY.md for what's working

## 📞 Need Help?

- Check logs in terminal windows
- Review README.md for detailed documentation
- Check IMPLEMENTATION_SUMMARY.md for feature status
- Verify all prerequisites are installed

---

**Happy Coding! 🚗💨**
