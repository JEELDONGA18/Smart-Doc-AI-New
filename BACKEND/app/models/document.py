from pydantic import BaseModel
from datetime import datetime


class DocumentResponse(BaseModel):
    id: str
    name: str
    type: str
    size: int
    uploaded_at: str
