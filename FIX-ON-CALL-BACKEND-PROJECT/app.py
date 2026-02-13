from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from config import Config
import logging
import os
from datetime import datetime
from database import db, migrate

# Initialize extensions
jwt = JWTManager()
mail = Mail()
cors = CORS()

def create_app(config_class=Config):
    """Application Factory Pattern"""
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Create upload folder if not exists
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    mail.init_app(app)
    cors.init_app(app, resources={
        r"/api/*": {
            "origins": "*",
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": False
        }
    })
    
    # Configure logging
    logging.basicConfig(level=logging.DEBUG)
    
    # Import models to ensure they're registered
    with app.app_context():
        from models import user, service, booking, payment
        db.create_all()
    
    # Import and register blueprints
    from routes.auth import auth_bp
    from routes.services import services_bp
    from routes.bookings import bookings_bp
    from routes.admin import admin_bp
    from routes.notifications import notifications_bp
    from routes.payments import payments_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(services_bp, url_prefix='/api/services')
    app.register_blueprint(bookings_bp, url_prefix='/api/bookings')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(notifications_bp, url_prefix='/api/notifications')
    app.register_blueprint(payments_bp, url_prefix='/api/payments')
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            'success': False,
            'error': 'Not found',
            'message': 'The requested resource was not found'
        }), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': 'Internal server error',
            'message': 'An internal error occurred'
        }), 500
    
    # Health check endpoint
    @app.route('/api/health', methods=['GET'])
    def health_check():
        try:
            # Test database connection
            db.session.execute(db.text('SELECT 1'))
            db_status = 'connected'
        except:
            db_status = 'disconnected'
        
        return jsonify({
            'status': 'healthy',
            'service': 'Fix On Call API',
            'version': '1.0.0',
            'database': db_status,
            'timestamp': datetime.utcnow().isoformat()
        }), 200
    
    @app.route('/')
    def index():
        return jsonify({
            'message': '🚗 Fix On Call API',
            'version': '1.0.0',
            'description': 'Revolutionizing Roadside Rescue from Nairobi to the World',
            'endpoints': {
                'auth': '/api/auth/*',
                'services': '/api/services/*',
                'bookings': '/api/bookings/*',
                'admin': '/api/admin/*',
                'notifications': '/api/notifications/*',
                'payments': '/api/payments/*',
                'health': '/api/health'
            },
            'documentation': 'https://docs.fixoncall.com'
        })
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)