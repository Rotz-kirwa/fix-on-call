from flask import Blueprint, request, jsonify
from database import db
from models.support import SupportConversation, SupportMessage

support_bp = Blueprint("support", __name__)


@support_bp.route("/conversations", methods=["POST"])
def create_conversation():
    try:
        data = request.get_json() or {}

        customer_name = (data.get("customer_name") or "").strip()
        if not customer_name:
            return jsonify({"success": False, "error": "customer_name is required"}), 400

        conversation = SupportConversation(
            channel=data.get("channel", "live_chat"),
            status=data.get("status", "open"),
            user_id=data.get("user_id"),
            customer_name=customer_name,
            customer_email=data.get("customer_email"),
            customer_phone=data.get("customer_phone"),
            inquiry_type=data.get("inquiry_type"),
            request_id=data.get("request_id"),
            assigned_to=data.get("assigned_to"),
            tags=",".join(data.get("tags", [])) if isinstance(data.get("tags"), list) else data.get("tags"),
        )

        db.session.add(conversation)
        db.session.flush()

        first_message = (data.get("message") or "").strip()
        if first_message:
            db.session.add(
                SupportMessage(
                    conversation_id=conversation.id,
                    sender=data.get("sender", "user"),
                    body=first_message,
                )
            )

        db.session.commit()
        return jsonify({"success": True, "conversation": conversation.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 500


@support_bp.route("/conversations", methods=["GET"])
def list_conversations():
    try:
        q = request.args.get("q", "").strip().lower()
        status = request.args.get("status", "").strip()
        channel = request.args.get("channel", "").strip()
        tag = request.args.get("tag", "").strip().lower()

        query = SupportConversation.query
        if status:
            query = query.filter_by(status=status)
        if channel:
            query = query.filter_by(channel=channel)

        conversations = query.order_by(SupportConversation.updated_at.desc()).all()

        items = []
        for c in conversations:
            row = c.to_dict()
            if tag:
                row_tags = [t.strip().lower() for t in row.get("tags", []) if t.strip()]
                if tag not in row_tags:
                    continue
            if q:
                haystack = " ".join(
                    [
                        row.get("customer_name", ""),
                        row.get("customer_phone", ""),
                        row.get("customer_email", ""),
                        row.get("request_id", ""),
                        row.get("last_message", ""),
                    ]
                ).lower()
                if q not in haystack:
                    continue
            items.append(row)

        return jsonify({"success": True, "conversations": items}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@support_bp.route("/conversations/<int:conversation_id>/messages", methods=["GET"])
def list_messages(conversation_id):
    conversation = SupportConversation.query.get(conversation_id)
    if not conversation:
        return jsonify({"success": False, "error": "Conversation not found"}), 404

    messages = [m.to_dict() for m in conversation.messages]
    return jsonify({"success": True, "messages": messages}), 200


@support_bp.route("/conversations/<int:conversation_id>/messages", methods=["POST"])
def create_message(conversation_id):
    try:
        conversation = SupportConversation.query.get(conversation_id)
        if not conversation:
            return jsonify({"success": False, "error": "Conversation not found"}), 404

        data = request.get_json() or {}
        body = (data.get("body") or "").strip()
        if not body:
            return jsonify({"success": False, "error": "body is required"}), 400

        message = SupportMessage(
            conversation_id=conversation_id,
            sender=data.get("sender", "user"),
            body=body,
        )
        db.session.add(message)
        conversation.updated_at = message.created_at
        db.session.commit()

        return jsonify({"success": True, "message": message.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 500


@support_bp.route("/conversations/<int:conversation_id>", methods=["PATCH"])
def update_conversation(conversation_id):
    try:
        conversation = SupportConversation.query.get(conversation_id)
        if not conversation:
            return jsonify({"success": False, "error": "Conversation not found"}), 404

        data = request.get_json() or {}
        if "status" in data:
            conversation.status = data["status"]
        if "assigned_to" in data:
            conversation.assigned_to = data["assigned_to"]
        if "tags" in data:
            conversation.tags = ",".join(data["tags"]) if isinstance(data["tags"], list) else data["tags"]

        db.session.commit()
        return jsonify({"success": True, "conversation": conversation.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 500
