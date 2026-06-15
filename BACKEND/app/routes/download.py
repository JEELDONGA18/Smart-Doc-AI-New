from io import BytesIO
from datetime import datetime
import re

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from bson import ObjectId

from reportlab.lib.pagesizes import letter
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer
)
from reportlab.lib.styles import getSampleStyleSheet

from app.utils.deps import get_current_user
from app.database.connection import (
    chats_collection,
    messages_collection
)

router = APIRouter(
    prefix="/api/download",
    tags=["Download"]
)

def clean_markdown(text: str) -> str:
    """Remove markdown syntax for exports."""

    text = re.sub(r"\[(.*?)\]\((.*?)\)", r"\1", text)

    text = re.sub(r"\*\*(.*?)\*\*", r"\1", text)
    text = re.sub(r"\*(.*?)\*", r"\1", text)

    text = re.sub(r"#{1,6}\s*", "", text)

    text = text.replace("```", "")
    text = text.replace("`", "")

    text = text.replace("- ", "• ")


    return text.strip()


def format_timestamp(timestamp):
    try:
        dt = datetime.fromisoformat(
            str(timestamp).replace("Z", "+00:00")
        )

        return dt.strftime(
            "%d %b %Y • %I:%M %p"
        )

    except Exception:
        return str(timestamp)


def safe_filename(name: str) -> str:
    return re.sub(
        r'[\\/*?:"<>|]',
        "",
        name
    )


def add_page_number(canvas, doc):
    canvas.drawRightString(
        550,
        20,
        f"Page {canvas.getPageNumber()}"
    )

@router.get("/pdf/{chat_id}")
def download_chat_pdf(
    chat_id: str,
    user_id: str = Depends(get_current_user)
):
    chat = chats_collection.find_one(
        {
            "_id": ObjectId(chat_id),
            "user_id": user_id
        }
    )

    if not chat:
        raise HTTPException(
            status_code=404,
            detail="Chat not found"
        )

    # text = text.replace("&", "&amp;")
    # text = text.replace("<", "&lt;")
    # text = text.replace(">", "&gt;")
    messages = messages_collection.find(
        {"chat_id": chat_id}
    ).sort("created_at", 1)

    buffer = BytesIO()

    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        leftMargin=40,
        rightMargin=40,
        topMargin=40,
        bottomMargin=40
    )

    styles = getSampleStyleSheet()

    story = []

    title = Paragraph(
        "<b>SMARTDOC AI</b>",
        styles["Title"]
    )

    tagline = Paragraph(
        "AI-Powered Document Intelligence Platform",
        styles["Italic"]
    )

    subtitle = Paragraph(
        f"Conversation Export • {chat.get('title', 'Untitled Chat')}",
        styles["Normal"]
    )

    generated = Paragraph(
        f"Generated on {datetime.now().strftime('%d %b %Y • %I:%M %p')}",
        styles["Italic"]
    )

    story.append(title)
    story.append(tagline)
    story.append(subtitle)
    story.append(generated)
    story.append(Spacer(1, 20))

    for msg in messages:

        role = (
            "You"
            if msg["role"] == "user"
            else "SmartDoc AI"
        )

        role_color = (
            "navy"
            if role == "You"
            else "green"
        )

        timestamp = format_timestamp(
            msg.get("created_at")
        )

        content = clean_markdown(
            str(msg["content"])
        )
        
        content = content.replace("&", "&amp;")
        content = content.replace("<", "&lt;")
        content = content.replace(">", "&gt;")

        role_para = Paragraph(
            (
                f"<font color='{role_color}'>"
                f"<b>{role}</b>"
                f"</font><br/>"
                f"<font size='8'>{timestamp}</font>"
            ),
            styles["Heading4"]
        )

        content_para = Paragraph(
            content.replace("\n", "<br/>"),
            styles["Normal"]
        )

        story.append(role_para)
        story.append(content_para)
        story.append(Spacer(1, 12))

    doc.build(
        story,
        onFirstPage=add_page_number,
        onLaterPages=add_page_number
    )

    buffer.seek(0)

    filename = safe_filename(
        chat.get("title", "chat")
    )

    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition":
                f'attachment; filename="{filename}.pdf"'
        }
    )

@router.get("/txt/{chat_id}")
def download_chat_txt(
    chat_id: str,
    user_id: str = Depends(get_current_user)
):
    chat = chats_collection.find_one(
        {
            "_id": ObjectId(chat_id),
            "user_id": user_id
        }
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
        "=" * 60 + "\n"
    )

    content.append(
        "SMARTDOC AI - CONVERSATION EXPORT\n"
    )

    content.append(
        "=" * 60 + "\n\n"
    )

    content.append(
        f"Chat Title: {chat.get('title', 'Untitled Chat')}\n"
    )

    content.append(
        f"Generated: {datetime.now().strftime('%d %b %Y • %I:%M %p')}\n\n"
    )

    for msg in messages:

        role = (
            "You"
            if msg["role"] == "user"
            else "SmartDoc AI"
        )

        timestamp = format_timestamp(
            msg.get("created_at")
        )

        clean_content = clean_markdown(
            str(msg["content"])
        )

        content.append(
            "-" * 60 + "\n"
        )

        content.append(
            f"{role}\n"
        )

        content.append(
            f"{timestamp}\n\n"
        )

        content.append(
            f"{clean_content}\n\n"
        )

    buffer = BytesIO()

    buffer.write(
        "".join(content).encode("utf-8")
    )

    buffer.seek(0)

    filename = safe_filename(
        chat.get("title", "chat")
    )

    return StreamingResponse(
        buffer,
        media_type="text/plain",
        headers={
            "Content-Disposition":
                f'attachment; filename="{filename}.txt"'
        }
    )

@router.get("/")
def get_downloadable_chats(
    user_id: str = Depends(get_current_user)
):
    chats = chats_collection.find(
        {"user_id": user_id}
    ).sort("created_at", -1)

    result = []

    for chat in chats:
        result.append({
            "id": str(chat["_id"]),
            "name": chat.get(
                "title",
                "Untitled Chat"
            ),
            "date": chat.get("created_at")
        })

    return result