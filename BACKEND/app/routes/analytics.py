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
    
    latest_document = documents_collection.find_one(
        {"user_id": user_id},
        sort=[("uploaded_at", -1)]
    )
    
    return {
        "totalDocuments": total_documents,
        "totalChats": total_chats,
        "totalQueries": total_queries,
        "latestDocument": latest_document["name"] if latest_document else None
    }
    
@router.get("/activity")
def get_activity(user_id: str = Depends(get_current_user)):
    activities = []

    documents = list(
        documents_collection.find(
            {"user_id": user_id},
            {"name": 1, "uploaded_at": 1}
        ).sort("uploaded_at", -1).limit(5)
    )

    for doc in documents:
        activities.append({
            "id": str(doc["_id"]),
            "type": "upload",
            "title": f"Uploaded {doc['name']}",
            "description": "Document uploaded",
            "time": doc["uploaded_at"]
        })

    messages = list(
        messages_collection.find(
            {
                "user_id": user_id,
                "role": "user"
            },
            {
                "content": 1,
                "created_at": 1
            }
        ).sort("created_at", -1).limit(5)
    )

    for msg in messages:
        activities.append({
            "id": str(msg["_id"]),
            "type": "chat",
            "title": msg["content"][:60],
            "description": "Question asked",
            "time": msg["created_at"]
        })

    activities.sort(
        key=lambda x: x["time"],
        reverse=True
    )

    return activities[:10]
