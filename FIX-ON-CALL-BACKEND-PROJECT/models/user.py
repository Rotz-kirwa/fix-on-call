from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from database import db
from sqlalchemy.dialects.postgresql import JSON

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    user_type = db.Column(db.String(20), nullable=False, index=True)
    is_verified = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    
    # Driver specific fields
    vehicle_info = db.Column(JSON)
    emergency_contacts = db.Column(JSON)
    preferred_mechanics = db.Column(JSON)
    insurance_details = db.Column(JSON)
    
    # Mechanic specific fields
    specialization = db.Column(JSON)
    experience_years = db.Column(db.Integer)
    certifications = db.Column(JSON)
    service_radius_km = db.Column(db.Integer, default=10)
    location = db.Column(JSON)
    rating = db.Column(db.Float, default=0.0)
    total_services = db.Column(db.Integer, default=0)
    is_available = db.Column(db.Boolean, default=True)
    tools_available = db.Column(JSON)
    hourly_rate = db.Column(db.Float)
    current_location = db.Column(JSON)
    
    # Partner specific fields
    company_name = db.Column(db.String(200))
    partner_type = db.Column(db.String(50))
    services_offered = db.Column(JSON)
    fleet_size = db.Column(db.Integer)
    
    # Relationships
    services = db.relationship('Service', backref='user', lazy='dynamic', foreign_keys='Service.user_id')
    bookings = db.relationship('Booking', backref='user', lazy='dynamic', foreign_keys='Booking.user_id')
    payments = db.relationship('Payment', backref='user', lazy='dynamic')
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        data = {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'phone': self.phone,
            'user_type': self.user_type,
            'is_verified': self.is_verified,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'last_login': self.last_login.isoformat() if self.last_login else None,
        }
        
        if self.user_type == 'driver':
            data.update({
                'vehicle_info': self.vehicle_info,
                'emergency_contacts': self.emergency_contacts,
                'insurance_details': self.insurance_details,
            })
        elif self.user_type == 'mechanic':
            data.update({
                'specialization': self.specialization,
                'experience_years': self.experience_years,
                'certifications': self.certifications,
                'service_radius_km': self.service_radius_km,
                'location': self.location,
                'rating': self.rating,
                'total_services': self.total_services,
                'is_available': self.is_available,
                'hourly_rate': self.hourly_rate,
            })
        elif self.user_type == 'partner':
            data.update({
                'company_name': self.company_name,
                'partner_type': self.partner_type,
                'services_offered': self.services_offered,
                'fleet_size': self.fleet_size,
            })
        
        return data
