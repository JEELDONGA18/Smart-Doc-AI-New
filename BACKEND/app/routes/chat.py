from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId

from app.database.connection import documents_collection, chats_collection, messages_collection
from app.models.chat import ChatRequest
from app.services.gemini import ask_gemini
from app.utils.deps import get_current_user

router = APIRouter(prefix="/api/chat", tags=["Chat"])


def get_document_context(user_id: str) -> str:
    """Combine all document content for a user into one context string."""
    docs = documents_collection.find({"user_id": user_id}, {"name": 1, "content": 1})

    context_parts = []
    for doc in docs:
        if doc.get("content"):
            context_parts.append(f"--- Document: {doc['name']} ---\n{doc['content']}")

    if not context_parts:
        return ""

    MAX_CONTEXT = 50000

    context = "\n\n".join(context_parts)

    # print("\n===== DOCUMENT CONTEXT =====")
    # print(context)
    # print("============================\n")
    return context[:MAX_CONTEXT]


@router.post("/")
def send_message(req: ChatRequest, user_id: str = Depends(get_current_user)):
    """Send a message and get an AI response from uploaded documents."""
    # Get document context
    context = get_document_context(user_id)
    if not context:
        return {
            "chat_id": req.chat_id or "",
            "reply": "You haven't uploaded any documents yet. Please upload some documents first, then ask me questions about them.",
        }

    # Create or get chat
    now = datetime.now(timezone.utc).isoformat()

    if req.chat_id:
        chat = chats_collection.find_one({"_id": ObjectId(req.chat_id), "user_id": user_id})
        if not chat:
            raise HTTPException(404, "Chat not found")
        chat_id = req.chat_id
    else:
        # New chat — use first few words of the question as title
        title = req.message[:50] + ("..." if len(req.message) > 50 else "")
        chat_doc = {
            "user_id": user_id,
            "title": title,
            "created_at": now,
            "updated_at": now,
        }
        result = chats_collection.insert_one(chat_doc)
        chat_id = str(result.inserted_id)

    # Save user message
    user_msg = {
        "chat_id": chat_id,
        "user_id": user_id,
        "role": "user",
        "content": req.message,
        "created_at": now,
    }
    messages_collection.insert_one(user_msg)

    # Get AI response from Gemini
    ai_reply = ask_gemini(req.message, context)

    # Save AI message
    ai_msg = {
        "chat_id": chat_id,
        "user_id": user_id,
        "role": "assistant",
        "content": ai_reply,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    messages_collection.insert_one(ai_msg)

    # Update chat timestamp
    if not ObjectId.is_valid(chat_id):
        raise HTTPException(400, "Invalid chat id")
    
    chats_collection.update_one(
        {"_id": ObjectId(chat_id)},
        {"$set": {"updated_at": ai_msg["created_at"]}},
    )

    return {"chat_id": chat_id, "reply": ai_reply}


@router.get("/chats")
def get_chats(user_id: str = Depends(get_current_user)):
    """List all chats for the current user."""
    chats = chats_collection.find({"user_id": user_id}).sort("updated_at", -1)

    result = []
    for chat in chats:
        chat_id = str(chat["_id"])
        msg_count = messages_collection.count_documents({"chat_id": chat_id})

        # Get last message as preview
        last_msg = messages_collection.find_one(
            {"chat_id": chat_id},
            sort=[("created_at", -1)],
        )
        preview = last_msg["content"][:80] if last_msg else ""

        result.append({
            "id": chat_id,
            "title": chat.get("title", "Untitled"),
            "preview": preview,
            "messages": msg_count,
            "created_at": chat.get("created_at", ""),
        })

    return result


@router.get("/history")
def get_history(user_id: str = Depends(get_current_user)):
    """Alias for /chats — used by the history page."""
    return get_chats(user_id)


@router.get("/{chat_id}")
def get_chat_messages(chat_id: str, user_id: str = Depends(get_current_user)):
    """Get all messages for a specific chat."""
    if not ObjectId.is_valid(chat_id):
        raise HTTPException(400, "Invalid chat id")
    
    chat = chats_collection.find_one({"_id": ObjectId(chat_id), "user_id": user_id})
    if not chat:
        raise HTTPException(404, "Chat not found")

    msgs = messages_collection.find({"chat_id": chat_id}).sort("created_at", 1)

    return {
        "chat": {
            "id": chat_id,
            "title": chat.get("title", "Untitled"),
        },
        "messages": [
            {
                "id": str(msg["_id"]),
                "role": msg["role"],
                "content": msg["content"],
                "created_at": msg["created_at"],
            }
            for msg in msgs
        ],
    }


@router.delete("/{chat_id}")
def delete_chat(chat_id: str, user_id: str = Depends(get_current_user)):
    """Delete a chat and all its messages."""
    if not ObjectId.is_valid(chat_id):
        raise HTTPException(400, "Invalid chat id")
    
    chat = chats_collection.find_one({"_id": ObjectId(chat_id), "user_id": user_id})
    if not chat:
        raise HTTPException(404, "Chat not found")

    messages_collection.delete_many({"chat_id": chat_id})
    chats_collection.delete_one({"_id": ObjectId(chat_id)})

    return {"message": "Chat deleted"}
