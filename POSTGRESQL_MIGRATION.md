# 🔄 MongoDB to PostgreSQL Migration Guide

## ✅ Migration Complete!

The Fix On Call backend has been successfully migrated from MongoDB to PostgreSQL with SQLAlchemy ORM.

## 🎯 What Changed

### Database
- **Before**: MongoDB (NoSQL, document-based)
- **After**: PostgreSQL (SQL, relational database)

### ORM
- **Before**: PyMongo (direct MongoDB driver)
- **After**: SQLAlchemy (Python SQL toolkit and ORM)

### Benefits
✅ ACID compliance for transactions
✅ Better data integrity with foreign keys
✅ Improved query performance with indexes
✅ Better support for complex queries and joins
✅ Industry-standard SQL database
✅ Better scalability for production

## 📦 Prerequisites

### Install PostgreSQL

#### macOS
```bash
brew install postgresql@15
brew services start postgresql@15
```

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### Windows
Download and install from: https://www.postgresql.org/download/windows/

## 🚀 Setup Instructions

### 1. Create Database

```bash
# Login to PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE fix_on_call;
CREATE USER fix_on_call_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE fix_on_call TO fix_on_call_user;
\q
```

### 2. Update Environment Variables

```bash
cd FIX-ON-CALL-BACKEND-PROJECT
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL=postgresql://fix_on_call_user:your_secure_password@localhost:5432/fix_on_call
```

### 3. Install Dependencies

```bash
# Activate virtual environment
source venv/bin/activate  # macOS/Linux
# OR
venv\Scripts\activate  # Windows

# Install new dependencies
pip install -r requirements.txt
```

### 4. Initialize Database

```bash
# Create all tables and indexes
python init_db.py
```

You should see:
```
🔧 Creating database tables...
📊 Creating indexes...
✅ Database initialized successfully!
```

### 5. Start the Application

```bash
python app.py
```

## 🔍 Verify Migration

### Test Database Connection

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "Fix On Call API",
  "database": "connected"
}
```

### Test User Registration

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@#",
    "name": "Test User",
    "phone": "+254712345678",
    "user_type": "driver"
  }'
```

## 📊 Database Schema

### Tables Created

1. **users** - User accounts (drivers, mechanics, admins)
2. **services** - Service requests
3. **emergency_alerts** - Emergency breakdown alerts
4. **bookings** - Service bookings
5. **payments** - Payment transactions
6. **notifications** - User notifications

### Key Improvements

#### Relationships
- Foreign keys ensure data integrity
- Cascading deletes prevent orphaned records
- Proper indexing for fast queries

#### Data Types
- JSON columns for flexible data (location, metadata)
- Proper datetime handling with timezone support
- Numeric types for prices and ratings

#### Indexes
- Email (unique, indexed)
- User type (indexed)
- Service status (indexed)
- Created timestamps (indexed)
- Foreign keys (automatically indexed)

## 🔧 Database Management

### View Tables

```bash
psql -U fix_on_call_user -d fix_on_call

\dt  # List all tables
\d users  # Describe users table
```

### Backup Database

```bash
pg_dump -U fix_on_call_user fix_on_call > backup.sql
```

### Restore Database

```bash
psql -U fix_on_call_user fix_on_call < backup.sql
```

### Reset Database

```bash
python init_db.py
```

## 🆚 API Compatibility

### ✅ No Frontend Changes Required!

The API endpoints remain exactly the same:
- `/api/auth/*` - Authentication
- `/api/services/*` - Services
- `/api/bookings/*` - Bookings
- `/api/payments/*` - Payments
- `/api/notifications/*` - Notifications
- `/api/admin/*` - Admin

### Response Format

Responses now use integer IDs instead of MongoDB ObjectIds:

**Before (MongoDB)**:
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe"
}
```

**After (PostgreSQL)**:
```json
{
  "id": 1,
  "name": "John Doe"
}
```

Frontend automatically handles this change!

## 🐛 Troubleshooting

### Connection Error

```
Error: could not connect to server
```

**Solution**: Ensure PostgreSQL is running
```bash
sudo systemctl status postgresql  # Linux
brew services list  # macOS
```

### Authentication Failed

```
Error: password authentication failed
```

**Solution**: Check DATABASE_URL in .env file

### Table Already Exists

```
Error: relation "users" already exists
```

**Solution**: Database already initialized, no action needed

### Permission Denied

```
Error: permission denied for database
```

**Solution**: Grant privileges
```sql
GRANT ALL PRIVILEGES ON DATABASE fix_on_call TO fix_on_call_user;
```

## 📈 Performance Tips

### 1. Connection Pooling
Already configured in `config.py`:
```python
SQLALCHEMY_ENGINE_OPTIONS = {
    'pool_size': 10,
    'pool_recycle': 3600,
    'pool_pre_ping': True,
}
```

### 2. Query Optimization
- Use `.filter()` instead of `.filter_by()` for complex queries
- Use `.join()` for related data
- Use pagination for large result sets

### 3. Indexes
All critical fields are indexed for fast queries

## 🎉 Migration Complete!

Your Fix On Call backend is now running on PostgreSQL with:
- ✅ Better performance
- ✅ Data integrity
- ✅ ACID transactions
- ✅ Production-ready
- ✅ Same API interface

No frontend changes required - everything works seamlessly!
