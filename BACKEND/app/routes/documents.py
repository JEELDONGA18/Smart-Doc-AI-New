import os
from datetime import datetime, timezone
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from bson import ObjectId

from app.database.connection import documents_collection
from app.services.text_extractor import extract_text
from app.utils.deps import get_current_user

router = APIRouter(prefix="/api/documents", tags=["Documents"])

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_EXTENSIONS = {".pdf", ".docx", ".txt", ".csv"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    user_id: str = Depends(get_current_user),
):
    """Upload a document and extract its text content."""
    # Validate file extension
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(400, f"File type {ext} not supported. Use PDF, DOCX, TXT, or CSV.")

    # Read file content
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(400, "File exceeds 10MB limit.")

    # Save file to disk
    timestamp = int(datetime.now().timestamp())
    file_path = os.path.join(UPLOAD_DIR, f"{user_id}_{timestamp}_{file.filename}")
    with open(file_path, "wb") as f:
        f.write(content)

    # Extract text
    try:
        extracted_text = extract_text(file_path)
    except Exception:
        extracted_text = ""

    # Save to MongoDB
    doc = {
        "user_id": user_id,
        "name": file.filename,
        "type": ext.replace(".", ""),
        "size": len(content),
        "content": extracted_text,
        "uploaded_at": datetime.now(timezone.utc).isoformat(),
    }
    result = documents_collection.insert_one(doc)
    
    if os.path.exists(file_path):
        os.remove(file_path)

    return {
        "id": str(result.inserted_id),
        "name": file.filename,
        "type": doc["type"],
        "size": len(content),
        "uploadedAt": doc["uploaded_at"],
    }


@router.get("/")
def get_documents(user_id: str = Depends(get_current_user)):
    """List all documents uploaded by the current user."""
    docs = documents_collection.find({"user_id": user_id}).sort("uploaded_at", -1)

    return [
        {
            "id": str(doc["_id"]),
            "name": doc["name"],
            "type": doc["type"],
            "size": doc["size"],
            "uploadedAt": doc["uploaded_at"],
        }
        for doc in docs
    ]


@router.delete("/{doc_id}")
def delete_document(doc_id: str, user_id: str = Depends(get_current_user)):
    """Delete a document by ID."""
    doc = documents_collection.find_one({"_id": ObjectId(doc_id), "user_id": user_id})
    
    if not doc:
        raise HTTPException(404, "Document not found")

    documents_collection.delete_one({"_id": ObjectId(doc_id)})
    return {"message": "Document deleted"}
