from datetime import datetime
from database import db
from sqlalchemy.dialects.postgresql import JSON

class Booking(db.Model):
    __tablename__ = 'bookings'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    service_id = db.Column(db.Integer, db.ForeignKey('services.id'), nullable=False)
    mechanic_id = db.Column(db.Integer, db.ForeignKey('users.id'), index=True)
    scheduled_time = db.Column(db.DateTime)
    location = db.Column(JSON, nullable=False)
    status = db.Column(db.String(20), default='pending', index=True)
    estimated_duration = db.Column(db.Integer)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    cancelled_at = db.Column(db.DateTime)
    cancellation_reason = db.Column(db.Text)
    
    # Relationships
    mechanic = db.relationship('User', foreign_keys=[mechanic_id], backref='mechanic_bookings')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'service_id': self.service_id,
            'mechanic_id': self.mechanic_id,
            'scheduled_time': self.scheduled_time.isoformat() if self.scheduled_time else None,
            'location': self.location,
            'status': self.status,
            'estimated_duration': self.estimated_duration,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'cancelled_at': self.cancelled_at.isoformat() if self.cancelled_at else None,
            'cancellation_reason': self.cancellation_reason,
        }
