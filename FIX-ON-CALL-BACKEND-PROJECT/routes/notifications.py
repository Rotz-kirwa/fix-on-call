from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.payment import Notification
from database import db
from datetime import datetime

notifications_bp = Blueprint('notifications', __name__)

@notifications_bp.route('/send', methods=['POST'])
@jwt_required()
def send_notification():
    try:
        current_user_id = int(get_jwt_identity())
        data = request.get_json()
        
        required_fields = ['recipient_id', 'title', 'message']
        for field in required_fields:
            if field not in data:
                return jsonify({'success': False, 'error': f'Missing required field: {field}'}), 400
        
        notification = Notification(
            sender_id=current_user_id,
            recipient_id=data['recipient_id'],
            title=data['title'],
            message=data['message'],
            type=data.get('type', 'general')
        )
        
        db.session.add(notification)
        db.session.commit()
        
        return jsonify({'success': True, 'message': 'Notification sent successfully', 'notification': notification.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@notifications_bp.route('/my-notifications', methods=['GET'])
@jwt_required()
def my_notifications():
    try:
        current_user_id = int(get_jwt_identity())
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        pagination = Notification.query.filter_by(recipient_id=current_user_id).order_by(
            Notification.created_at.desc()
        ).paginate(page=page, per_page=per_page, error_out=False)
        
        unread = Notification.query.filter_by(recipient_id=current_user_id, is_read=False).count()
        
        return jsonify({
            'success': True,
            'notifications': [n.to_dict() for n in pagination.items],
            'unread_count': unread,
            'pagination': {'page': page, 'per_page': per_page, 'total': pagination.total, 'pages': pagination.pages}
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@notifications_bp.route('/mark-read/<int:notification_id>', methods=['POST'])
@jwt_required()
def mark_read(notification_id):
    try:
        current_user_id = int(get_jwt_identity())
        notification = Notification.query.filter_by(id=notification_id, recipient_id=current_user_id).first()
        
        if not notification:
            return jsonify({'success': False, 'error': 'Notification not found'}), 404
        
        notification.is_read = True
        notification.read_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({'success': True, 'message': 'Notification marked as read'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@notifications_bp.route('/mark-all-read', methods=['POST'])
@jwt_required()
def mark_all_read():
    try:
        current_user_id = int(get_jwt_identity())
        
        result = Notification.query.filter_by(recipient_id=current_user_id, is_read=False).update(
            {'is_read': True, 'read_at': datetime.utcnow()}
        )
        db.session.commit()
        
        return jsonify({'success': True, 'message': f'{result} notifications marked as read'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500
