from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User
from models.service import Service
from database import db
from datetime import datetime, timedelta
from sqlalchemy import func

admin_bp = Blueprint('admin', __name__)

def is_admin(user_id):
    user = User.query.get(user_id)
    return user and user.user_type == 'admin'

@admin_bp.route('/dashboard', methods=['GET'])
@jwt_required()
def dashboard():
    try:
        current_user_id = int(get_jwt_identity())
        
        if not is_admin(current_user_id):
            return jsonify({'success': False, 'error': 'Admin access required'}), 403
        
        total_users = User.query.count()
        total_mechanics = User.query.filter_by(user_type='mechanic').count()
        total_services = Service.query.count()
        active_services = Service.query.filter(Service.status.in_(['pending', 'accepted', 'in_progress'])).count()
        
        recent_services = Service.query.order_by(Service.created_at.desc()).limit(10).all()
        
        service_types = db.session.query(
            Service.service_type, func.count(Service.id).label('count')
        ).group_by(Service.service_type).order_by(func.count(Service.id).desc()).all()
        
        return jsonify({
            'success': True,
            'statistics': {
                'total_users': total_users,
                'total_mechanics': total_mechanics,
                'total_services': total_services,
                'active_services': active_services
            },
            'recent_services': [s.to_dict() for s in recent_services],
            'service_types': [{'_id': st[0], 'count': st[1]} for st in service_types]
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@admin_bp.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    try:
        current_user_id = int(get_jwt_identity())
        
        if not is_admin(current_user_id):
            return jsonify({'success': False, 'error': 'Admin access required'}), 403
        
        user_type = request.args.get('user_type')
        is_active = request.args.get('is_active')
        search = request.args.get('search')
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        query = User.query
        
        if user_type:
            query = query.filter_by(user_type=user_type)
        if is_active:
            query = query.filter_by(is_active=is_active.lower() == 'true')
        if search:
            query = query.filter(
                db.or_(
                    User.name.ilike(f'%{search}%'),
                    User.email.ilike(f'%{search}%'),
                    User.phone.ilike(f'%{search}%')
                )
            )
        
        pagination = query.order_by(User.created_at.desc()).paginate(page=page, per_page=per_page, error_out=False)
        
        return jsonify({
            'success': True,
            'users': [u.to_dict() for u in pagination.items],
            'pagination': {'page': page, 'per_page': per_page, 'total': pagination.total, 'pages': pagination.pages}
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@admin_bp.route('/users/<int:user_id>/toggle-active', methods=['POST'])
@jwt_required()
def toggle_user_active(user_id):
    try:
        current_user_id = int(get_jwt_identity())
        
        if not is_admin(current_user_id):
            return jsonify({'success': False, 'error': 'Admin access required'}), 403
        
        user = User.query.get(user_id)
        if not user:
            return jsonify({'success': False, 'error': 'User not found'}), 404
        
        user.is_active = not user.is_active
        user.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': f'User {"activated" if user.is_active else "deactivated"} successfully',
            'is_active': user.is_active
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@admin_bp.route('/services', methods=['GET'])
@jwt_required()
def admin_services():
    try:
        current_user_id = int(get_jwt_identity())
        
        if not is_admin(current_user_id):
            return jsonify({'success': False, 'error': 'Admin access required'}), 403
        
        status = request.args.get('status')
        service_type = request.args.get('service_type')
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        query = Service.query
        
        if status:
            query = query.filter_by(status=status)
        if service_type:
            query = query.filter_by(service_type=service_type)
        
        pagination = query.order_by(Service.created_at.desc()).paginate(page=page, per_page=per_page, error_out=False)
        
        return jsonify({
            'success': True,
            'services': [s.to_dict() for s in pagination.items],
            'pagination': {'page': page, 'per_page': per_page, 'total': pagination.total, 'pages': pagination.pages}
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
