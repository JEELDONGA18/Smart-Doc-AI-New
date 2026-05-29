import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "smart_doc_ai")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

# Collections
users_collection = db["users"]
documents_collection = db["documents"]
chats_collection = db["chats"]
messages_collection = db["messages"]

# Create indexes
users_collection.create_index("email", unique=True)
documents_collection.create_index("user_id")
chats_collection.create_index("user_id")
messages_collection.create_index("chat_id")
