from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models.user import User
from database import db
from datetime import timedelta, datetime
from utils.validators import validate_email, validate_password, validate_phone

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['email', 'password', 'name', 'phone', 'user_type']
        for field in required_fields:
            if field not in data:
                return jsonify({'success': False, 'error': f'Missing required field: {field}'}), 400
        
        # Validate email
        if not validate_email(data['email']):
            return jsonify({'success': False, 'error': 'Invalid email format'}), 400
        
        # Validate password
        is_valid, password_message = validate_password(data['password'])
        if not is_valid:
            return jsonify({'success': False, 'error': password_message}), 400
        
        # Validate phone
        if not validate_phone(data['phone']):
            return jsonify({'success': False, 'error': 'Invalid phone number. Use Kenyan format: +2547XXXXXXXX or 07XXXXXXXX'}), 400
        
        # Check if user exists
        if User.query.filter_by(email=data['email'].lower()).first():
            return jsonify({'success': False, 'error': 'User with this email already exists'}), 409
        
        # Create user
        user = User(
            email=data['email'].lower(),
            name=data['name'],
            phone=data['phone'],
            user_type=data['user_type']
        )
        user.set_password(data['password'])
        
        # Add role-specific fields
        if data['user_type'] == 'driver':
            user.vehicle_info = data.get('vehicle_info', {})
            user.emergency_contacts = data.get('emergency_contacts', [])
            user.insurance_details = data.get('insurance_details', {})
        elif data['user_type'] == 'mechanic':
            user.specialization = data.get('specialization', [])
            user.experience_years = data.get('experience_years', 0)
            user.certifications = data.get('certifications', [])
            user.service_radius_km = data.get('service_radius_km', 10)
            user.location = data.get('location', {})
            user.tools_available = data.get('tools_available', [])
            user.hourly_rate = data.get('hourly_rate', 0)
        elif data['user_type'] == 'partner':
            user.company_name = data.get('company_name')
            user.partner_type = data.get('partner_type')
            user.services_offered = data.get('services_offered', [])
            user.fleet_size = data.get('fleet_size', 0)
        
        db.session.add(user)
        db.session.commit()
        
        token = create_access_token(identity=str(user.id), expires_delta=timedelta(hours=24))
        
        return jsonify({
            'success': True,
            'message': 'User registered successfully',
            'user': user.to_dict(),
            'token': token
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """User login"""
    try:
        data = request.get_json()
        
        if 'email' not in data or 'password' not in data:
            return jsonify({'success': False, 'error': 'Email and password are required'}), 400
        
        user = User.query.filter_by(email=data['email'].lower()).first()
        if not user or not user.check_password(data['password']):
            return jsonify({'success': False, 'error': 'Invalid email or password'}), 401
        
        if not user.is_active:
            return jsonify({'success': False, 'error': 'Account is deactivated'}), 403
        
        user.last_login = datetime.utcnow()
        db.session.commit()
        
        token = create_access_token(identity=str(user.id), expires_delta=timedelta(hours=24))
        
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'user': user.to_dict(),
            'token': token
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get user profile"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(int(current_user_id))
        
        if not user:
            return jsonify({'success': False, 'error': 'User not found'}), 404
        
        return jsonify({'success': True, 'user': user.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update user profile"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(int(current_user_id))
        
        if not user:
            return jsonify({'success': False, 'error': 'User not found'}), 404
        
        data = request.get_json()
        
        # Update allowed fields
        if 'name' in data:
            user.name = data['name']
        if 'phone' in data:
            user.phone = data['phone']
        if 'vehicle_info' in data:
            user.vehicle_info = data['vehicle_info']
        if 'location' in data:
            user.location = data['location']
        if 'specialization' in data:
            user.specialization = data['specialization']
        if 'experience_years' in data:
            user.experience_years = data['experience_years']
        if 'service_radius_km' in data:
            user.service_radius_km = data['service_radius_km']
        
        user.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Profile updated successfully',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500
