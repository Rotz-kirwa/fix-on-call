paste
🚗 Fix On Call - Roadside Assistance Platform Backend
📖 Overview
Fix On Call is a comprehensive mobile-first platform that revolutionizes roadside assistance by connecting stranded drivers with certified mechanics, towing services, emergency fuel delivery, and verified spare parts vendors - all in real time. Starting from Nairobi, Kenya, this platform is designed to scale across Africa and emerging markets.

🎯 Vision
"Fix On Call envisions a world where no driver is ever stranded — where intelligent roadside rescue is just a tap away."

🧭 Mission
"Fix On Call empowers drivers with instant access to certified roadside support through smart technology, strategic partnerships, and a commitment to safety, speed, and trust."

🏗️ Architecture
Tech Stack
Backend Framework: Flask (Python)

Database: MongoDB

Authentication: JWT (JSON Web Tokens)

API Structure: RESTful API with Blueprints

Security: bcrypt password hashing, input validation

File Upload: Support for images and documents

Email/SMS: Integrated notifications system

Project Structure
text
fix-on-call-backend/
├── app.py                 # Main application entry point
├── config.py             # Configuration settings
├── requirements.txt      # Python dependencies
├── .env                  # Environment variables
├── .gitignore           # Git ignore file
├── run.sh               # Startup script
├── setup.sh             # Setup script
├── models/              # Database models
│   ├── __init__.py
│   ├── user.py          # User model with driver/mechanic/admin roles
│   ├── service.py       # Service request model
│   ├── booking.py       # Booking management
│   └── payment.py       # Payment processing
├── routes/              # API endpoints (Blueprints)
│   ├── __init__.py
│   ├── auth.py          # Authentication endpoints
│   ├── services.py      # Service management
│   ├── bookings.py      # Booking endpoints
│   ├── admin.py         # Admin dashboard
│   └── notifications.py # Notification system
├── utils/               # Utility functions
│   ├── __init__.py
│   ├── validators.py    # Input validation
│   ├── notifications.py # Notification helpers
│   └── geolocation.py   # Location services
├── tests/               # Test files
│   ├── __init__.py
│   ├── test_auth.py     # Authentication tests
│   └── test_services.py # Service tests
└── static/              # Static files
    └── uploads/         # File upload directory
🚀 Quick Start
Prerequisites
Python 3.8+

MongoDB 4.4+

pip (Python package manager)

Installation Steps
1. Clone and Setup
bash
# Clone the repository
git clone <your-repo-url>
cd fix-on-call-backend

# Run the setup script
chmod +x setup.sh
./setup.sh
2. Manual Setup (Alternative)
bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start MongoDB (if not running)
# Ubuntu/Debian: sudo systemctl start mongod
# macOS: brew services start mongodb-community
# Windows: Run MongoDB service

# Initialize database
python3 -c "
from pymongo import MongoClient
client = MongoClient('mongodb://localhost:27017/')
db = client['fix_on_call']

collections = ['users', 'mechanics', 'services', 'bookings', 'payments', 
               'vehicles', 'reviews', 'notifications', 'emergency_alerts']

for collection in collections:
    if collection not in db.list_collection_names():
        db.create_collection(collection)
        print(f'✅ Created: {collection}')
    else:
        print(f'✅ Exists: {collection}')
"
3. Run the Application
bash
# Method 1: Using Python directly
python app.py

# Method 2: Using the run script
./run.sh

# Method 3: With Docker (if configured)
docker-compose up -d
The API will be available at: http://localhost:5000

📡 API Endpoints
🔐 Authentication
Method	Endpoint	Description
POST	/api/auth/register	Register new user (driver/mechanic/admin)
POST	/api/auth/login	User login
GET	/api/auth/profile	Get user profile
PUT	/api/auth/profile	Update user profile
🚗 Services
Method	Endpoint	Description
POST	/api/services/request	Request roadside service
GET	/api/services/available-mechanics	Find nearby mechanics
POST	/api/services/{id}/assign	Assign service to mechanic
PUT	/api/services/{id}/status	Update service status
GET	/api/services/history	Get service history
📅 Bookings
Method	Endpoint	Description
POST	/api/bookings/create	Create booking
GET	/api/bookings/{id}	Get booking details
POST	/api/bookings/{id}/cancel	Cancel booking
GET	/api/bookings/my-bookings	Get user's bookings
👑 Admin
Method	Endpoint	Description
GET	/api/admin/dashboard	Admin dashboard stats
GET	/api/admin/users	Manage users
POST	/api/admin/users/{id}/toggle-active	Activate/deactivate user
GET	/api/admin/services	View all services
🔔 Notifications
Method	Endpoint	Description
POST	/api/notifications/send	Send notification
GET	/api/notifications/my-notifications	Get user notifications
POST	/api/notifications/mark-read/{id}	Mark as read
POST	/api/notifications/mark-all-read	Mark all as read
🗄️ Database Schema
Users Collection
javascript
{
  "_id": ObjectId,
  "email": "user@example.com",
  "password_hash": "hashed_password",
  "name": "John Doe",
  "phone": "+254712345678",
  "user_type": "driver", // driver, mechanic, admin, partner
  "is_verified": false,
  "is_active": true,
  "created_at": ISODate,
  "updated_at": ISODate,
  
  // Driver specific
  "vehicle_info": {
    "make": "Toyota",
    "model": "Premio",
    "year": 2020,
    "license_plate": "KBC123A"
  },
  
  // Mechanic specific
  "specialization": ["engine", "electrical"],
  "experience_years": 5,
  "service_radius_km": 20,
  "rating": 4.5,
  "is_available": true
}
Services Collection
javascript
{
  "_id": ObjectId,
  "user_id": "user_id",
  "service_type": "breakdown", // breakdown, towing, fuel_delivery, etc.
  "location": {
    "latitude": -1.2921,
    "longitude": 36.8219,
    "address": "Nairobi, Kenya"
  },
  "status": "pending", // pending, accepted, in_progress, completed, cancelled
  "description": "Car won't start",
  "assigned_to": "mechanic_id",
  "created_at": ISODate,
  "estimated_time": ISODate,
  "price_estimate": 1500,
  "payment_status": "pending"
}
🔧 Configuration
Environment Variables (.env)
env
# Flask Configuration
SECRET_KEY=your-super-secret-key-change-in-production
FLASK_DEBUG=True
FLASK_ENV=development

# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/fix_on_call

# JWT Configuration
JWT_SECRET_KEY=your-jwt-secret-key-change-this

# M-Pesa Configuration (Kenya)
MPESA_CONSUMER_KEY=your_mpesa_consumer_key
MPESA_CONSUMER_SECRET=your_mpesa_consumer_secret
MPESA_SHORTCODE=your_shortcode

# Email Configuration
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password

# SMS Gateway (Africa's Talking)
AFRICASTALKING_API_KEY=your_api_key
AFRICASTALKING_USERNAME=your_username

# Security
ENCRYPTION_KEY=your-32-character-encryption-key
🧪 Testing
Run Tests
bash
# Run all tests
pytest

# Run specific test file
pytest tests/test_auth.py

# Run with coverage
pytest --cov=app tests/
Test Endpoints with cURL
bash
# Health check
curl http://localhost:5000/api/health

# Register a driver
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "driver@example.com",
    "password": "Test123!",
    "name": "John Driver",
    "phone": "+254712345678",
    "user_type": "driver",
    "vehicle_info": {
      "make": "Toyota",
      "model": "Premio",
      "year": 2020,
      "license_plate": "KBC123A"
    }
  }'

# Register a mechanic
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "mechanic@example.com",
    "password": "Test123!",
    "name": "James Mechanic",
    "phone": "+254712345679",
    "user_type": "mechanic",
    "specialization": ["engine", "electrical"],
    "experience_years": 5,
    "service_radius_km": 20
  }'
🐳 Docker Deployment
Using Docker Compose
yaml
version: '3.8'
services:
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
  
  backend:
    build: .
    ports:
      - "5000:5000"
    environment:
      - MONGO_URI=mongodb://mongodb:27017/fix_on_call
    depends_on:
      - mongodb

volumes:
  mongodb_data:
Build and Run
bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
🔒 Security Features
Authentication & Authorization
JWT-based authentication with refresh tokens

Role-based access control (driver, mechanic, admin)

Password hashing with bcrypt

Session management

Input Validation
Email format validation

Password strength enforcement

Phone number validation (Kenya format)

JSON schema validation for all endpoints

Data Protection
No sensitive data in responses

Password hashing before storage

Input sanitization

Rate limiting (to be implemented)

📊 API Response Format
Success Response
json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
Error Response
json
{
  "success": false,
  "error": "Error description",
  "message": "Detailed error message",
  "code": "ERROR_CODE",
  "timestamp": "2024-01-15T10:30:00Z"
}
🚨 Error Codes
Code	Description	HTTP Status
400	Bad Request	400
401	Unauthorized	401
403	Forbidden	403
404	Not Found	404
409	Conflict	409
422	Validation Error	422
500	Internal Server Error	500
📈 Monitoring & Logging
Log Levels
DEBUG: Detailed information for debugging

INFO: Confirmation that things are working as expected

WARNING: Something unexpected happened

ERROR: The software couldn't perform a function

Access Logs
All API requests are logged with:

Timestamp

IP address

Request method and endpoint

Response status

Processing time

🚀 Deployment
Production Checklist
Update FLASK_ENV=production

Set DEBUG=False

Use strong secret keys

Configure production database

Set up SSL/TLS certificates

Configure firewall rules

Set up backup strategy

Configure monitoring

Set up logging aggregation

Deployment Options
Traditional Server

bash
# Install production dependencies
pip install gunicorn

# Run with Gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
Docker

bash
docker build -t fix-on-call-backend .
docker run -p 5000:5000 fix-on-call-backend
Platform as a Service

Heroku

AWS Elastic Beanstalk

Google App Engine

DigitalOcean App Platform

🔌 Integration Points
Payment Gateways
M-Pesa (Kenya)

Stripe (International)

Flutterwave (Africa)

SMS Services
Africa's Talking

Twilio

Maps & Location
Google Maps API

Mapbox

Insurance Partners
Jubilee Insurance

APA Insurance

Britam

Sanlam

📝 API Documentation
Swagger/OpenAPI
API documentation is available via Swagger UI (to be implemented):

/api/docs - Interactive API documentation

/api/swagger.json - OpenAPI specification

Postman Collection
Import the Postman collection for testing:

json
// Fix On Call API.postman_collection.json
🤝 Contributing
Development Workflow
Fork the repository

Create a feature branch

Make changes with tests

Submit a pull request

Code Style
Follow PEP 8 for Python code

Use meaningful variable names

Add docstrings to functions

Write unit tests for new features

Commit Messages
Use conventional commit messages:

feat: New feature

fix: Bug fix

docs: Documentation

style: Code style changes

refactor: Code refactoring

test: Adding tests

chore: Maintenance tasks

🆘 Support
Troubleshooting
MongoDB Connection Issues
bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod

# Check connection
mongo --host localhost --port 27017
Port Already in Use
bash
# Find process using port 5000
sudo lsof -i :5000

# Kill the process
kill -9 <PID>
Virtual Environment Issues
bash
# Recreate virtual environment
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
Getting Help
📧 Email: dev@fixoncall.com

🌐 Website: https://fixoncall.com

📱 Phone: +254 726392725

🐛 Issues: GitHub Issues

📄 License
This project is proprietary software. All rights reserved.

🙏 Acknowledgments
Nairobi tech community

Our early adopters and beta testers

The Flask and MongoDB communities

All contributors and supporters

🚗 Roadmap
Phase 1 (Current)
User authentication

Service requests

Booking management

Basic admin panel

Phase 2 (Next)
Real-time tracking

Payment integration

SMS notifications

Advanced matching algorithm

Phase 3 (Future)
Mobile apps (iOS/Android)

AI-powered diagnostics

Fleet management

Insurance integration

Multi-language support

Fix On Call — Revolutionizing Roadside Rescue, One Breakdown at a Time! 🚗💨

From Nairobi to the World 🌍

This response is AI-generated, for reference only.

