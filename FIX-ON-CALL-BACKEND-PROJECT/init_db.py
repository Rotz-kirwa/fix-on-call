#!/usr/bin/env python3
"""
Database initialization script for Fix On Call
Creates all tables and indexes for PostgreSQL
"""

from app import create_app
from database import db
from models import User, Service, Booking, Payment, Notification, EmergencyAlert

def init_database():
    """Initialize the database with all tables and indexes"""
    app = create_app()
    
    with app.app_context():
        print("🔧 Creating database tables...")
        
        # Drop all tables (use with caution in production!)
        # db.drop_all()
        
        # Create all tables
        db.create_all()
        
        # Create additional indexes for performance
        print("📊 Creating indexes...")
        
        # User indexes
        db.session.execute(db.text(
            'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);'
        ))
        db.session.execute(db.text(
            'CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type);'
        ))
        db.session.execute(db.text(
            'CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);'
        ))
        
        # Service indexes
        db.session.execute(db.text(
            'CREATE INDEX IF NOT EXISTS idx_services_user_id ON services(user_id);'
        ))
        db.session.execute(db.text(
            'CREATE INDEX IF NOT EXISTS idx_services_status ON services(status);'
        ))
        db.session.execute(db.text(
            'CREATE INDEX IF NOT EXISTS idx_services_created_at ON services(created_at);'
        ))
        
        # Booking indexes
        db.session.execute(db.text(
            'CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);'
        ))
        db.session.execute(db.text(
            'CREATE INDEX IF NOT EXISTS idx_bookings_mechanic_id ON bookings(mechanic_id);'
        ))
        
        # Payment indexes
        db.session.execute(db.text(
            'CREATE INDEX IF NOT EXISTS idx_payments_service_id ON payments(service_id);'
        ))
        db.session.execute(db.text(
            'CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);'
        ))
        db.session.execute(db.text(
            'CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);'
        ))
        
        # Notification indexes
        db.session.execute(db.text(
            'CREATE INDEX IF NOT EXISTS idx_notifications_recipient_id ON notifications(recipient_id);'
        ))
        db.session.execute(db.text(
            'CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);'
        ))
        
        db.session.commit()
        
        print("✅ Database initialized successfully!")
        print("\n📋 Tables created:")
        print("  - users")
        print("  - services")
        print("  - emergency_alerts")
        print("  - bookings")
        print("  - payments")
        print("  - notifications")
        print("\n🎉 Ready to use!")

if __name__ == '__main__':
    init_database()
