# 🚗 Fix On Call - Full Stack Roadside Assistance Platform

## 📖 Overview
Fix On Call is a comprehensive platform that connects stranded drivers with certified mechanics, towing services, and emergency roadside assistance in real-time. Built with Flask (Python) backend and React (TypeScript) frontend.

## 🏗️ Project Structure

```
fix-on-call/
├── FIX-ON-CALL-BACKEND-PROJECT/    # Flask API Backend
│   ├── models/                      # Database models
│   ├── routes/                      # API endpoints
│   ├── utils/                       # Utility functions
│   ├── tests/                       # Test files
│   ├── app.py                       # Main application
│   ├── config.py                    # Configuration
│   └── requirements.txt             # Python dependencies
│
└── fix-on-call-platform/           # React Frontend
    ├── src/
    │   ├── components/              # React components
    │   ├── pages/                   # Page components
    │   ├── lib/                     # API client & utilities
    │   └── store/                   # State management
    ├── package.json                 # Node dependencies
    └── vite.config.ts               # Vite configuration
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 18+
- MongoDB 4.4+

### Backend Setup

```bash
cd FIX-ON-CALL-BACKEND-PROJECT

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your configuration

# Start MongoDB
# Ubuntu/Debian: sudo systemctl start mongod
# macOS: brew services start mongodb-community

# Run the backend
python app.py
```

Backend will run on: http://localhost:5000

### Frontend Setup

```bash
cd fix-on-call-platform

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on: http://localhost:8080

## 🔧 Recent Fixes & Improvements

### Backend Fixes ✅
1. **Security**: Fixed CORS to allow only specific origins (localhost:8080, localhost:3000)
2. **Missing Imports**: Added datetime import to app.py, ObjectId to auth.py
3. **Payment System**: Implemented complete payment model and routes
4. **Validators**: Created comprehensive input validation utilities
5. **Notifications**: Implemented notification system with email/SMS support
6. **Geolocation**: Added distance calculation using Haversine formula
7. **API Routes**: Added payment routes and registered in app.py

### Frontend Improvements ✅
1. **API Integration**: Created complete API client with axios
2. **Authentication**: Real JWT-based auth with token persistence
3. **Protected Routes**: Added route guards for role-based access
4. **State Management**: Enhanced auth store with token handling
5. **Branding**: Updated HTML meta tags and title
6. **Environment Variables**: Added .env configuration
7. **Error Handling**: Proper error messages and loading states

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Services
- `POST /api/services/request` - Request roadside service
- `GET /api/services/available-mechanics` - Find nearby mechanics
- `POST /api/services/{id}/assign` - Assign mechanic
- `PUT /api/services/{id}/status` - Update service status
- `GET /api/services/history` - Get service history

### Bookings
- `POST /api/bookings/create` - Create booking
- `GET /api/bookings/{id}` - Get booking details
- `POST /api/bookings/{id}/cancel` - Cancel booking
- `GET /api/bookings/my-bookings` - Get user bookings

### Payments
- `POST /api/payments/create` - Create payment
- `GET /api/payments/{id}` - Get payment details
- `PUT /api/payments/{id}/status` - Update payment status
- `GET /api/payments/service/{id}` - Get payment by service

### Notifications
- `POST /api/notifications/send` - Send notification
- `GET /api/notifications/my-notifications` - Get notifications
- `POST /api/notifications/mark-read/{id}` - Mark as read
- `POST /api/notifications/mark-all-read` - Mark all as read

### Admin
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/users` - Manage users
- `POST /api/admin/users/{id}/toggle-active` - Toggle user status
- `GET /api/admin/services` - View all services

## 🔐 Environment Variables

### Backend (.env)
```env
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret
MONGO_URI=mongodb://localhost:27017/fix_on_call
MAIL_SERVER=smtp.gmail.com
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 🧪 Testing

### Backend Tests
```bash
cd FIX-ON-CALL-BACKEND-PROJECT
pytest
pytest --cov=app tests/
```

### Frontend Tests
```bash
cd fix-on-call-platform
npm test
npm run test:watch
```

## 📦 Tech Stack

### Backend
- **Framework**: Flask 2.3.3
- **Database**: MongoDB with PyMongo
- **Authentication**: JWT (Flask-JWT-Extended)
- **Email**: Flask-Mail
- **Validation**: Custom validators
- **CORS**: Flask-CORS

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS + shadcn/ui
- **State**: Zustand
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Animations**: Framer Motion

## 🔒 Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS protection
- Role-based access control
- Token expiration handling

## 📝 Next Steps

### High Priority
- [ ] Implement M-Pesa payment integration
- [ ] Add real-time tracking with WebSocket
- [ ] Complete Africa's Talking SMS integration
- [ ] Add Google Maps integration
- [ ] Implement file upload for mechanic certifications

### Medium Priority
- [ ] Add rate limiting
- [ ] Implement password reset flow
- [ ] Add email verification
- [ ] Create admin dashboard UI
- [ ] Add service request form

### Low Priority
- [ ] Add Docker configuration
- [ ] Set up CI/CD pipeline
- [ ] Add API documentation (Swagger)
- [ ] Implement caching with Redis
- [ ] Add analytics dashboard

## 🤝 Contributing
1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License
Proprietary - All rights reserved

## 📧 Contact
- Email: dev@fixoncall.com
- Phone: +254 726392725

---

**Fix On Call** - Revolutionizing Roadside Rescue from Nairobi to the World! 🚗💨
