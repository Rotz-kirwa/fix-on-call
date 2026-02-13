from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.service import Service, EmergencyAlert
from models.user import User
from database import db
from datetime import datetime
from utils.geolocation import find_nearby_locations

services_bp = Blueprint('services', __name__)

SERVICE_TYPES = ['breakdown', 'towing', 'fuel_delivery', 'tyre_change', 'battery_jump', 'lockout', 'mechanic_dispatch']
STATUSES = ['pending', 'accepted', 'in_progress', 'completed', 'cancelled']

@services_bp.route('/request', methods=['POST'])
@jwt_required()
def request_service():
    """Request a new roadside service"""
    try:
        current_user_id = int(get_jwt_identity())
        data = request.get_json()
        
        if 'service_type' not in data or 'location' not in data:
            return jsonify({'success': False, 'error': 'service_type and location are required'}), 400
        
        if data['service_type'] not in SERVICE_TYPES:
            return jsonify({'success': False, 'error': f'Invalid service type'}), 400
        
        user = User.query.get(current_user_id)
        
        service = Service(
            user_id=current_user_id,
            service_type=data['service_type'],
            location=data['location'],
            vehicle_info=data.get('vehicle_info', user.vehicle_info if user else {}),
            description=data.get('description', ''),
            priority=data.get('priority', 'medium'),
            price_estimate=data.get('price_estimate')
        )
        
        db.session.add(service)
        db.session.commit()
        
        # Create emergency alert if breakdown
        if data['service_type'] == 'breakdown':
            alert = EmergencyAlert(
                service_id=service.id,
                user_id=current_user_id,
                location=data['location'],
                priority='high'
            )
            db.session.add(alert)
            db.session.commit()
        
        # Find nearby mechanics
        mechanics = User.query.filter_by(user_type='mechanic', is_available=True, is_active=True).all()
        mechanics_data = [m.to_dict() for m in mechanics]
        
        if data['location'].get('latitude') and data['location'].get('longitude'):
            mechanics_with_location = [m for m in mechanics_data if m.get('location')]
            nearby = find_nearby_locations(data['location'], mechanics_with_location, 10)
            mechanics_data = nearby[:5]
        
        return jsonify({
            'success': True,
            'message': 'Service requested successfully',
            'service': service.to_dict(),
            'nearby_mechanics': mechanics_data
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@services_bp.route('/available-mechanics', methods=['GET'])
@jwt_required()
def get_available_mechanics():
    """Get available mechanics near a location"""
    try:
        latitude = request.args.get('latitude', type=float)
        longitude = request.args.get('longitude', type=float)
        radius = request.args.get('radius', 10, type=int)
        specialization = request.args.get('specialization')
        
        if not latitude or not longitude:
            return jsonify({'success': False, 'error': 'Latitude and longitude are required'}), 400
        
        query = User.query.filter_by(user_type='mechanic', is_available=True, is_active=True)
        
        if specialization:
            query = query.filter(User.specialization.contains([specialization]))
        
        mechanics = query.all()
        mechanics_data = [m.to_dict() for m in mechanics]
        
        location = {'latitude': latitude, 'longitude': longitude}
        mechanics_with_location = [m for m in mechanics_data if m.get('location')]
        nearby = find_nearby_locations(location, mechanics_with_location, radius)
        
        return jsonify({'success': True, 'count': len(nearby), 'mechanics': nearby}), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@services_bp.route('/<int:service_id>/assign', methods=['POST'])
@jwt_required()
def assign_service(service_id):
    """Assign service to a mechanic"""
    try:
        data = request.get_json()
        
        if 'mechanic_id' not in data:
            return jsonify({'success': False, 'error': 'mechanic_id is required'}), 400
        
        service = Service.query.get(service_id)
        if not service:
            return jsonify({'success': False, 'error': 'Service not found'}), 404
        
        if service.status != 'pending':
            return jsonify({'success': False, 'error': f'Service is already {service.status}'}), 400
        
        service.status = 'accepted'
        service.assigned_to = data['mechanic_id']
        service.assigned_at = datetime.utcnow()
        
        mechanic = User.query.get(data['mechanic_id'])
        if mechanic:
            mechanic.is_available = False
        
        db.session.commit()
        
        return jsonify({'success': True, 'message': 'Service assigned successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@services_bp.route('/<int:service_id>/status', methods=['PUT'])
@jwt_required()
def update_service_status(service_id):
    """Update service status"""
    try:
        data = request.get_json()
        
        if 'status' not in data:
            return jsonify({'success': False, 'error': 'status is required'}), 400
        
        if data['status'] not in STATUSES:
            return jsonify({'success': False, 'error': f'Invalid status'}), 400
        
        service = Service.query.get(service_id)
        if not service:
            return jsonify({'success': False, 'error': 'Service not found'}), 404
        
        service.status = data['status']
        service.updated_at = datetime.utcnow()
        
        if data['status'] == 'completed':
            service.completed_at = datetime.utcnow()
        
        if data['status'] in ['completed', 'cancelled'] and service.assigned_to:
            mechanic = User.query.get(service.assigned_to)
            if mechanic:
                mechanic.is_available = True
        
        db.session.commit()
        
        return jsonify({'success': True, 'message': f'Service status updated to {data["status"]}'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@services_bp.route('/history', methods=['GET'])
@jwt_required()
def service_history():
    """Get user's service history"""
    try:
        current_user_id = int(get_jwt_identity())
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        pagination = Service.query.filter_by(user_id=current_user_id).order_by(Service.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        services = [s.to_dict() for s in pagination.items]
        
        return jsonify({
            'success': True,
            'services': services,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': pagination.total,
                'pages': pagination.pages
            }
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
