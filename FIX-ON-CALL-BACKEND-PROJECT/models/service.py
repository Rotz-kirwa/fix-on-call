from datetime import datetime
from database import db
from sqlalchemy.dialects.postgresql import JSON

class Service(db.Model):
    __tablename__ = 'services'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    service_type = db.Column(db.String(50), nullable=False, index=True)
    location = db.Column(JSON, nullable=False)
    vehicle_info = db.Column(JSON)
    description = db.Column(db.Text)
    status = db.Column(db.String(20), default='pending', index=True)
    priority = db.Column(db.String(20), default='medium')
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    assigned_to = db.Column(db.Integer, db.ForeignKey('users.id'), index=True)
    assigned_at = db.Column(db.DateTime)
    estimated_time = db.Column(db.DateTime)
    actual_time = db.Column(db.DateTime)
    completed_at = db.Column(db.DateTime)
    price_estimate = db.Column(db.Float)
    final_price = db.Column(db.Float)
    payment_status = db.Column(db.String(20), default='pending')
    
    # Relationships
    mechanic = db.relationship('User', foreign_keys=[assigned_to], backref='assigned_services')
    bookings = db.relationship('Booking', backref='service', lazy='dynamic')
    payments = db.relationship('Payment', backref='service', lazy='dynamic')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'service_type': self.service_type,
            'location': self.location,
            'vehicle_info': self.vehicle_info,
            'description': self.description,
            'status': self.status,
            'priority': self.priority,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'assigned_to': self.assigned_to,
            'assigned_at': self.assigned_at.isoformat() if self.assigned_at else None,
            'estimated_time': self.estimated_time.isoformat() if self.estimated_time else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'price_estimate': self.price_estimate,
            'final_price': self.final_price,
            'payment_status': self.payment_status,
        }

class EmergencyAlert(db.Model):
    __tablename__ = 'emergency_alerts'
    
    id = db.Column(db.Integer, primary_key=True)
    service_id = db.Column(db.Integer, db.ForeignKey('services.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    location = db.Column(JSON, nullable=False)
    priority = db.Column(db.String(20), default='medium')
    status = db.Column(db.String(20), default='active')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    responded_at = db.Column(db.DateTime)
    responded_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    
    def to_dict(self):
        return {
            'id': self.id,
            'service_id': self.service_id,
            'user_id': self.user_id,
            'location': self.location,
            'priority': self.priority,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'responded_at': self.responded_at.isoformat() if self.responded_at else None,
            'responded_by': self.responded_by,
        }
