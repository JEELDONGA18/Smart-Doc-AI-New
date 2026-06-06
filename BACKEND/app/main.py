from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import auth, chat, documents, analytics, download

app = FastAPI(title="Smart Doc AI")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    # allow_origins=["http://localhost:3000", "https://smart-doc-ai-new.vercel.app"],
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(documents.router)
app.include_router(chat.router)
app.include_router(analytics.router)
app.include_router(download.router)


@app.get("/")
def read_root():
    return {"message": "Smart Doc AI API Running"}


@app.get("/health")
def health_check():
    return {"status": "ok", "message": "API is healthy"}
