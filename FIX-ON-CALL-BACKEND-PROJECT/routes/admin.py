from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User
from models.service import Service
from models.payment import Payment
from models.support import SupportConversation
from database import db
from datetime import datetime
from sqlalchemy import func

admin_bp = Blueprint('admin', __name__)

def is_admin(user_id):
    user = User.query.get(user_id)
    return user and user.user_type == 'admin'

@admin_bp.route('/dashboard', methods=['GET'])
@jwt_required()
def dashboard():
    try:
        jwt_identity = get_jwt_identity()
        try:
            current_user_id = int(jwt_identity)
        except (TypeError, ValueError):
            return jsonify({'success': False, 'error': 'Invalid token identity'}), 401
        
        if not is_admin(current_user_id):
            return jsonify({'success': False, 'error': 'Admin access required'}), 403
        
        total_users = User.query.count()
        total_mechanics = User.query.filter_by(user_type='mechanic').count()
        total_partners = User.query.filter_by(user_type='partner').count()
        approved_partner_apps = SupportConversation.query.filter_by(channel='partner_application').all()
        approved_partner_apps_count = sum(
            1 for app in approved_partner_apps
            if any(tag.strip().lower() == 'approved' for tag in (app.tags or '').split(','))
        )
        total_partners += approved_partner_apps_count
        total_services = Service.query.count()
        active_services = Service.query.filter(
            Service.status.in_(['pending', 'accepted', 'confirmed', 'dispatched', 'arrived', 'in_progress', 'in_service'])
        ).count()
        
        recent_services = Service.query.order_by(Service.created_at.desc()).limit(10).all()
        
        service_types = db.session.query(
            Service.service_type, func.count(Service.id).label('count')
        ).group_by(Service.service_type).order_by(func.count(Service.id).desc()).all()

        # Revenue trend: last 12 months, grouped by month from completed payments
        now = datetime.utcnow()
        # Keep dashboard trend anchored from March.
        trend_start = datetime(now.year, 3, 1)

        # Aggregate in Python to avoid DB-specific date functions causing 500s.
        revenue_rows = db.session.query(
            Payment.created_at,
            Payment.amount
        ).filter(
            Payment.status == 'completed',
            Payment.created_at >= trend_start
        ).all()

        revenue_map = {}
        for created_at, amount in revenue_rows:
            if not created_at:
                continue
            key = created_at.strftime('%Y-%m')
            revenue_map[key] = revenue_map.get(key, 0.0) + float(amount or 0.0)

        month_labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        revenue_trend = []
        cursor = trend_start
        for _ in range(12):
            key = cursor.strftime('%Y-%m')
            revenue_trend.append({
                'label': month_labels[cursor.month - 1],
                'value': round(revenue_map.get(key, 0), 2)
            })
            if cursor.month == 12:
                cursor = datetime(cursor.year + 1, 1, 1)
            else:
                cursor = datetime(cursor.year, cursor.month + 1, 1)
        
        return jsonify({
            'success': True,
            'statistics': {
                'total_users': total_users,
                'total_mechanics': total_mechanics,
                'total_partners': total_partners,
                'total_services': total_services,
                'active_services': active_services
            },
            'recent_services': [s.to_dict() for s in recent_services],
            'service_types': [{'_id': st[0], 'count': st[1]} for st in service_types],
            'revenue_trend': revenue_trend
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

@admin_bp.route('/users/<int:user_id>/suspend', methods=['POST'])
@jwt_required()
def suspend_user(user_id):
    try:
        current_user_id = int(get_jwt_identity())

        if not is_admin(current_user_id):
            return jsonify({'success': False, 'error': 'Admin access required'}), 403

        user = User.query.get(user_id)
        if not user:
            return jsonify({'success': False, 'error': 'User not found'}), 404

        user.is_active = False
        user.updated_at = datetime.utcnow()
        db.session.commit()

        return jsonify({'success': True, 'message': 'User suspended successfully', 'status': 'suspended'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@admin_bp.route('/users/<int:user_id>/ban', methods=['POST'])
@jwt_required()
def ban_user(user_id):
    try:
        current_user_id = int(get_jwt_identity())

        if not is_admin(current_user_id):
            return jsonify({'success': False, 'error': 'Admin access required'}), 403

        user = User.query.get(user_id)
        if not user:
            return jsonify({'success': False, 'error': 'User not found'}), 404

        user.is_active = False
        user.updated_at = datetime.utcnow()
        db.session.commit()

        return jsonify({'success': True, 'message': 'User banned successfully', 'status': 'banned'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@admin_bp.route('/users/<int:user_id>/activate', methods=['POST'])
@jwt_required()
def activate_user(user_id):
    try:
        current_user_id = int(get_jwt_identity())

        if not is_admin(current_user_id):
            return jsonify({'success': False, 'error': 'Admin access required'}), 403

        user = User.query.get(user_id)
        if not user:
            return jsonify({'success': False, 'error': 'User not found'}), 404

        user.is_active = True
        user.updated_at = datetime.utcnow()
        db.session.commit()

        return jsonify({'success': True, 'message': 'User activated successfully', 'status': 'active'}), 200
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
