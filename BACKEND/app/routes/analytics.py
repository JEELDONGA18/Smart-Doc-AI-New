from fastapi import APIRouter, Depends
from app.utils.deps import get_current_user
from app.database.connection import documents_collection, chats_collection, messages_collection

router = APIRouter(prefix="/api", tags=["Analytics"])

@router.get("/stats")
def get_stats(user_id: str = Depends(get_current_user)):
    """Return basic statistics for the dashboard."""
    total_documents = documents_collection.count_documents({"user_id": user_id})
    total_chats = chats_collection.count_documents({"user_id": user_id})
    
    # Count total messages sent by this user
    total_queries = messages_collection.count_documents({"user_id": user_id, "role": "user"})
    
    return {
        "totalDocuments": total_documents,
        "totalChats": total_chats,
        "totalQueries": total_queries
    }
