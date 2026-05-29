from pydantic import BaseModel


class ChatRequest(BaseModel):
    message: str
    chat_id: str | None = None  # None = new chat


class ChatResponse(BaseModel):
    chat_id: str
    reply: str


class MessageResponse(BaseModel):
    id: str
    role: str
    content: str
    created_at: str


class ChatHistoryItem(BaseModel):
    id: str
    title: str
    preview: str
    messages: int
    created_at: str
