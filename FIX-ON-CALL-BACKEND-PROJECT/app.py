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
    allowed_origins = app.config.get("CORS_ALLOWED_ORIGINS", [])
    cors.init_app(app, resources={
        r"/api/*": {
            "origins": allowed_origins,
            "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": False
        }
    })
    
    # Configure logging
    logging.basicConfig(level=logging.DEBUG)
    
    # Import models to ensure they're registered
    with app.app_context():
        from models import user, service, booking, payment, support
        from models.user import User
        db.create_all()

        # Development convenience: keep a default admin account available.
        default_admin_email = "info@fixoncall.com"
        default_admin_password = "1362"
        default_admin_phone = "+254726392725"

        default_admin = User.query.filter_by(email=default_admin_email).first()
        if not default_admin:
            default_admin = User(
                email=default_admin_email,
                name="Fix On Call Admin",
                phone=default_admin_phone,
                user_type="admin",
                is_active=True,
            )
            default_admin.set_password(default_admin_password)
            db.session.add(default_admin)
            db.session.commit()
        else:
            # Keep requested simplified admin password in sync.
            if not default_admin.check_password(default_admin_password):
                default_admin.set_password(default_admin_password)
                db.session.commit()
    
    # Import and register blueprints
    from routes.auth import auth_bp
    from routes.services import services_bp
    from routes.bookings import bookings_bp
    from routes.admin import admin_bp
    from routes.notifications import notifications_bp
    from routes.payments import payments_bp
    from routes.support import support_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(services_bp, url_prefix='/api/services')
    app.register_blueprint(bookings_bp, url_prefix='/api/bookings')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(notifications_bp, url_prefix='/api/notifications')
    app.register_blueprint(payments_bp, url_prefix='/api/payments')
    app.register_blueprint(support_bp, url_prefix='/api/support')
    
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

# Expose a module-level WSGI app for Gunicorn (`gunicorn app:app`).
app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
