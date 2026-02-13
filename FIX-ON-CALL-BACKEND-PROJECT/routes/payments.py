from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.payment import Payment
from models.service import Service
from models.user import User
from database import db
from datetime import datetime

payments_bp = Blueprint('payments', __name__)

PAYMENT_METHODS = ['mpesa', 'card', 'cash']
PAYMENT_STATUSES = ['pending', 'completed', 'failed', 'refunded']

@payments_bp.route('/create', methods=['POST'])
@jwt_required()
def create_payment():
    try:
        current_user_id = int(get_jwt_identity())
        data = request.get_json()
        
        if 'service_id' not in data or 'amount' not in data:
            return jsonify({'success': False, 'error': 'service_id and amount are required'}), 400
        
        if not Service.query.get(data['service_id']):
            return jsonify({'success': False, 'error': 'Service not found'}), 404
        
        payment = Payment(
            service_id=data['service_id'],
            user_id=current_user_id,
            amount=data['amount'],
            payment_method=data.get('payment_method', 'mpesa'),
            transaction_id=data.get('transaction_id'),
            phone_number=data.get('phone_number'),
            payment_metadata=data.get('metadata', {})
        )
        
        db.session.add(payment)
        db.session.commit()
        
        return jsonify({'success': True, 'message': 'Payment initiated successfully', 'payment': payment.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@payments_bp.route('/<int:payment_id>', methods=['GET'])
@jwt_required()
def get_payment(payment_id):
    try:
        current_user_id = int(get_jwt_identity())
        payment = Payment.query.get(payment_id)
        
        if not payment:
            return jsonify({'success': False, 'error': 'Payment not found'}), 404
        
        if payment.user_id != current_user_id:
            user = User.query.get(current_user_id)
            if not user or user.user_type != 'admin':
                return jsonify({'success': False, 'error': 'Unauthorized'}), 403
        
        return jsonify({'success': True, 'payment': payment.to_dict()}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@payments_bp.route('/<int:payment_id>/status', methods=['PUT'])
@jwt_required()
def update_payment_status(payment_id):
    try:
        data = request.get_json()
        
        if 'status' not in data:
            return jsonify({'success': False, 'error': 'status is required'}), 400
        
        if data['status'] not in PAYMENT_STATUSES:
            return jsonify({'success': False, 'error': f'Invalid status'}), 400
        
        payment = Payment.query.get(payment_id)
        if not payment:
            return jsonify({'success': False, 'error': 'Payment not found'}), 404
        
        payment.status = data['status']
        payment.updated_at = datetime.utcnow()
        
        if data['status'] == 'completed':
            payment.completed_at = datetime.utcnow()
            service = Service.query.get(payment.service_id)
            if service:
                service.payment_status = 'completed'
        
        if data.get('transaction_id'):
            payment.transaction_id = data['transaction_id']
        
        db.session.commit()
        
        return jsonify({'success': True, 'message': f'Payment status updated to {data["status"]}'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@payments_bp.route('/service/<int:service_id>', methods=['GET'])
@jwt_required()
def get_payment_by_service(service_id):
    try:
        payment = Payment.query.filter_by(service_id=service_id).first()
        
        if not payment:
            return jsonify({'success': False, 'error': 'Payment not found for this service'}), 404
        
        return jsonify({'success': True, 'payment': payment.to_dict()}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
