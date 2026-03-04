from datetime import datetime
from database import db


class SupportConversation(db.Model):
    __tablename__ = "support_conversations"

    id = db.Column(db.Integer, primary_key=True)
    channel = db.Column(db.String(30), nullable=False, default="live_chat", index=True)
    status = db.Column(db.String(20), nullable=False, default="open", index=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True, index=True)
    customer_name = db.Column(db.String(150), nullable=False)
    customer_email = db.Column(db.String(150), nullable=True)
    customer_phone = db.Column(db.String(30), nullable=True)
    inquiry_type = db.Column(db.String(100), nullable=True)
    request_id = db.Column(db.String(100), nullable=True, index=True)
    assigned_to = db.Column(db.String(100), nullable=True)
    tags = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    messages = db.relationship(
        "SupportMessage",
        backref="conversation",
        cascade="all, delete-orphan",
        order_by="SupportMessage.created_at.asc()",
        lazy=True,
    )

    def to_dict(self):
        last_message = self.messages[-1] if self.messages else None
        return {
            "id": self.id,
            "channel": self.channel,
            "status": self.status,
            "user_id": self.user_id,
            "customer_name": self.customer_name,
            "customer_email": self.customer_email,
            "customer_phone": self.customer_phone,
            "inquiry_type": self.inquiry_type,
            "request_id": self.request_id,
            "assigned_to": self.assigned_to or "Unassigned",
            "tags": [t.strip() for t in (self.tags or "").split(",") if t.strip()],
            "last_message": last_message.body if last_message else "",
            "last_message_at": last_message.created_at.isoformat() if last_message else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "message_count": len(self.messages),
        }


class SupportMessage(db.Model):
    __tablename__ = "support_messages"

    id = db.Column(db.Integer, primary_key=True)
    conversation_id = db.Column(
        db.Integer, db.ForeignKey("support_conversations.id"), nullable=False, index=True
    )
    sender = db.Column(db.String(20), nullable=False, default="user")
    body = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)

    def to_dict(self):
        return {
            "id": self.id,
            "conversation_id": self.conversation_id,
            "sender": self.sender,
            "body": self.body,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

