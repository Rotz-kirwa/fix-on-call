from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.booking import Booking
from models.service import Service
from models.user import User
from database import db
from datetime import datetime

bookings_bp = Blueprint('bookings', __name__)

@bookings_bp.route('/create', methods=['POST'])
@jwt_required()
def create_booking():
    try:
        current_user_id = int(get_jwt_identity())
        data = request.get_json()
        
        if 'service_id' not in data or 'location' not in data:
            return jsonify({'success': False, 'error': 'service_id and location are required'}), 400
        
        if not Service.query.get(data['service_id']):
            return jsonify({'success': False, 'error': 'Service not found'}), 404
        
        booking = Booking(
            user_id=current_user_id,
            service_id=data['service_id'],
            mechanic_id=data.get('mechanic_id'),
            scheduled_time=data.get('scheduled_time'),
            location=data['location'],
            estimated_duration=data.get('estimated_duration'),
            notes=data.get('notes', '')
        )
        
        db.session.add(booking)
        db.session.commit()
        
        return jsonify({'success': True, 'message': 'Booking created successfully', 'booking': booking.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@bookings_bp.route('/<int:booking_id>', methods=['GET'])
@jwt_required()
def get_booking(booking_id):
    try:
        current_user_id = int(get_jwt_identity())
        booking = Booking.query.get(booking_id)
        
        if not booking:
            return jsonify({'success': False, 'error': 'Booking not found'}), 404
        
        if booking.user_id != current_user_id and booking.mechanic_id != current_user_id:
            user = User.query.get(current_user_id)
            if not user or user.user_type != 'admin':
                return jsonify({'success': False, 'error': 'Unauthorized'}), 403
        
        return jsonify({'success': True, 'booking': booking.to_dict()}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@bookings_bp.route('/<int:booking_id>/cancel', methods=['POST'])
@jwt_required()
def cancel_booking(booking_id):
    try:
        current_user_id = int(get_jwt_identity())
        data = request.get_json() or {}
        
        booking = Booking.query.get(booking_id)
        if not booking:
            return jsonify({'success': False, 'error': 'Booking not found'}), 404
        
        if booking.user_id != current_user_id:
            return jsonify({'success': False, 'error': 'Unauthorized'}), 403
        
        if booking.status in ['cancelled', 'completed']:
            return jsonify({'success': False, 'error': f'Booking is already {booking.status}'}), 400
        
        booking.status = 'cancelled'
        booking.cancelled_at = datetime.utcnow()
        booking.cancellation_reason = data.get('reason', '')
        booking.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({'success': True, 'message': 'Booking cancelled successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@bookings_bp.route('/my-bookings', methods=['GET'])
@jwt_required()
def my_bookings():
    try:
        current_user_id = int(get_jwt_identity())
        user = User.query.get(current_user_id)
        
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        if user.user_type == 'driver':
            query = Booking.query.filter_by(user_id=current_user_id)
        elif user.user_type == 'mechanic':
            query = Booking.query.filter_by(mechanic_id=current_user_id)
        else:
            return jsonify({'success': False, 'error': 'Invalid user type'}), 400
        
        pagination = query.order_by(Booking.created_at.desc()).paginate(page=page, per_page=per_page, error_out=False)
        
        return jsonify({
            'success': True,
            'bookings': [b.to_dict() for b in pagination.items],
            'pagination': {'page': page, 'per_page': per_page, 'total': pagination.total, 'pages': pagination.pages}
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
