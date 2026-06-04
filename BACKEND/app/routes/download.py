from io import BytesIO
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from bson import ObjectId
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter

from app.utils.deps import get_current_user
from app.database.connection import chats_collection, messages_collection

router = APIRouter(prefix="/api/download", tags=["Download"])

@router.get("/pdf/{chat_id}")
def download_chat_pdf(chat_id: str, user_id: str = Depends(get_current_user)):
    """Generate and download chat history as PDF."""
    chat = chats_collection.find_one({"_id": ObjectId(chat_id), "user_id": user_id})
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
        
    messages = messages_collection.find({"chat_id": chat_id}).sort("created_at", 1)
    
    buffer = BytesIO()

    c = canvas.Canvas(buffer, pagesize=letter)
    
    width, height = letter
    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, height - 50, f"Chat History: {chat.get('title', 'Untitled')}")
    
    c.setFont("Helvetica", 12)
    y_position = height - 80
    
    for msg in messages:
        if y_position < 50:
            c.showPage()
            c.setFont("Helvetica", 12)
            y_position = height - 50
            
        role = "You" if msg["role"] == "user" else "Smart Doc AI"
        time_str = msg.get("created_at", "")[:19].replace("T", " ")
        
        c.setFont("Helvetica-Bold", 10)
        c.drawString(50, y_position, f"{role} ({time_str}):")
        y_position -= 15
        
        c.setFont("Helvetica", 10)
        # Handle multiline text simply
        lines = str(msg["content"]).split("\n")
        for line in lines:
            if y_position < 50:
                c.showPage()
                c.setFont("Helvetica", 10)
                y_position = height - 50
            c.drawString(50, y_position, line[:100]) # Truncate long lines for simplicity
            y_position -= 15
        
        y_position -= 10 # Extra space between messages
        
    c.save()

    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition":
            f'attachment; filename="{chat.get("title","chat")}.pdf"'
        }
    )

@router.get("/txt/{chat_id}")
def download_chat_txt(
    chat_id: str,
    user_id: str = Depends(get_current_user)
):
    """Generate and download chat history as TXT."""

    chat = chats_collection.find_one(
        {"_id": ObjectId(chat_id), "user_id": user_id}
    )

    if not chat:
        raise HTTPException(
            status_code=404,
            detail="Chat not found"
        )

    messages = messages_collection.find(
        {"chat_id": chat_id}
    ).sort("created_at", 1)

    content = []

    content.append(
        f"Chat History: {chat.get('title', 'Untitled')}\n"
    )
    content.append("=" * 50 + "\n\n")

    for msg in messages:
        role = (
            "You"
            if msg["role"] == "user"
            else "Smart Doc AI"
        )

        time_str = (
            str(msg.get("created_at", ""))[:19]
            .replace("T", " ")
        )

        content.append(
            f"[{time_str}] {role}:\n"
        )

        content.append(
            f"{msg['content']}\n\n"
        )

    buffer = BytesIO()
    buffer.write(
        "".join(content).encode("utf-8")
    )
    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="text/plain",
        headers={
            "Content-Disposition":
            f'attachment; filename="{chat.get("title","chat")}.txt"'
        }
    )

@router.get("/")
def get_downloadable_chats(user_id: str = Depends(get_current_user)):
    """Return chats available for download."""

    chats = chats_collection.find(
        {"user_id": user_id}
    ).sort("created_at", -1)

    result = []

    for chat in chats:
        result.append({
            "id": str(chat["_id"]),
            "name": chat.get("title", "Untitled Chat"),
            "date": chat.get("created_at"),
        })

    return result