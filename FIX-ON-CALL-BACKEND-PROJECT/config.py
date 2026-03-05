import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()


def _normalize_database_url(url: str) -> str:
    """Normalize DB URLs for SQLAlchemy + psycopg (v3)."""
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql://", 1)
    if url.startswith("postgresql://"):
        url = url.replace("postgresql://", "postgresql+psycopg://", 1)
    return url


def _parse_origins(raw: str) -> list[str]:
    return [origin.strip() for origin in raw.split(",") if origin.strip()]

class Config:
    # PostgreSQL Configuration
    SQLALCHEMY_DATABASE_URI = _normalize_database_url(os.getenv(
        'DATABASE_URL',
        'postgresql://postgres:postgres@localhost:5432/fix_on_call'
    ))
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_size': 10,
        'pool_recycle': 3600,
        'pool_pre_ping': True,
    }
    
    # JWT Configuration
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your-super-secret-jwt-key-change-this')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    
    # App Configuration
    SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-change-this')
    DEBUG = os.getenv('FLASK_DEBUG', 'True') == 'True'
    
    # M-Pesa Configuration (Kenya)
    MPESA_CONSUMER_KEY = os.getenv('MPESA_CONSUMER_KEY')
    MPESA_CONSUMER_SECRET = os.getenv('MPESA_CONSUMER_SECRET')
    MPESA_SHORTCODE = os.getenv('MPESA_SHORTCODE')
    
    # Email Configuration
    MAIL_SERVER = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
    MAIL_PORT = int(os.getenv('MAIL_PORT', 587))
    MAIL_USE_TLS = os.getenv('MAIL_USE_TLS', 'True') == 'True'
    MAIL_USERNAME = os.getenv('MAIL_USERNAME')
    MAIL_PASSWORD = os.getenv('MAIL_PASSWORD')
    MAIL_DEFAULT_SENDER = os.getenv('MAIL_DEFAULT_SENDER', 'noreply@fixoncall.com')
    
    # File Upload
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
    UPLOAD_FOLDER = 'static/uploads'
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'pdf'}
    
    # Security
    ENCRYPTION_KEY = os.getenv('ENCRYPTION_KEY', 'your-32-character-encryption-key')
    
    # Africa's Talking SMS
    AFRICASTALKING_API_KEY = os.getenv('AFRICASTALKING_API_KEY')
    AFRICASTALKING_USERNAME = os.getenv('AFRICASTALKING_USERNAME')
    
    # Google Maps
    GOOGLE_MAPS_API_KEY = os.getenv('GOOGLE_MAPS_API_KEY')

    # CORS
    CORS_ALLOWED_ORIGINS = _parse_origins(os.getenv(
        'CORS_ALLOWED_ORIGINS',
        'http://localhost:8080,http://localhost:8090,https://fix-on-call.vercel.app,https://fix-on-call-admin.vercel.app,https://getfixoncall.com,https://www.getfixoncall.com'
    ))
