from flask_mail import Message
from flask import current_app

def send_email(to_email, subject, body):
    """Send email notification"""
    try:
        msg = Message(
            subject=subject,
            recipients=[to_email],
            body=body,
            sender=current_app.config['MAIL_DEFAULT_SENDER']
        )
        current_app.extensions['mail'].send(msg)
        return True
    except Exception as e:
        current_app.logger.error(f"Email send failed: {str(e)}")
        return False

def send_sms(phone_number, message):
    """Send SMS notification (placeholder for Africa's Talking integration)"""
    try:
        # TODO: Integrate Africa's Talking API
        current_app.logger.info(f"SMS to {phone_number}: {message}")
        return True
    except Exception as e:
        current_app.logger.error(f"SMS send failed: {str(e)}")
        return False

def notify_service_request(user, service):
    """Notify user about service request"""
    subject = "Service Request Received - Fix On Call"
    body = f"""
    Hello {user['name']},
    
    Your service request has been received.
    Service Type: {service['service_type']}
    Status: {service['status']}
    
    We're finding the best mechanic for you.
    
    Best regards,
    Fix On Call Team
    """
    return send_email(user['email'], subject, body)

def notify_service_assigned(user, mechanic, service):
    """Notify user when mechanic is assigned"""
    subject = "Mechanic Assigned - Fix On Call"
    body = f"""
    Hello {user['name']},
    
    A mechanic has been assigned to your service request!
    Mechanic: {mechanic['name']}
    Phone: {mechanic['phone']}
    
    They will contact you shortly.
    
    Best regards,
    Fix On Call Team
    """
    return send_email(user['email'], subject, body)
