import re
from typing import Tuple

def validate_email(email: str) -> bool:
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password: str) -> Tuple[bool, str]:
    """Validate 4-digit PIN password"""
    if not re.fullmatch(r"\d{4}", password or ""):
        return False, "Password must be exactly 4 digits"
    return True, "Password is valid"

def validate_phone(phone: str) -> bool:
    """Validate phone number (Kenya format)"""
    pattern = r'^(?:\+254|0)7\d{8}$'
    return re.match(pattern, phone.replace(' ', '')) is not None

def validate_coordinates(latitude: float, longitude: float) -> bool:
    """Validate GPS coordinates"""
    return -90 <= latitude <= 90 and -180 <= longitude <= 180

def sanitize_input(text: str) -> str:
    """Basic input sanitization"""
    if not text:
        return ""
    # Remove potential XSS characters
    dangerous_chars = ['<', '>', '"', "'", '&']
    for char in dangerous_chars:
        text = text.replace(char, '')
    return text.strip()
