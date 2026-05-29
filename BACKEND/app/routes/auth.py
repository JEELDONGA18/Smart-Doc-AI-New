from fastapi import APIRouter, HTTPException, Depends, status
from passlib.context import CryptContext
from bson import ObjectId

from app.database.connection import users_collection
from app.models.user import RegisterRequest, LoginRequest, UserResponse
from app.utils.jwt_handler import create_token
from app.utils.deps import get_current_user

router = APIRouter(prefix="/api/auth", tags=["Auth"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@router.post("/register")
def register(req: RegisterRequest):
    """Create a new user account."""
    # Check if email already exists
    if users_collection.find_one({"email": req.email}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    # Hash password and save
    hashed = pwd_context.hash(req.password)
    user_doc = {
        "name": req.name,
        "email": req.email,
        "password": hashed,
    }
    result = users_collection.insert_one(user_doc)
    user_id = str(result.inserted_id)

    token = create_token(user_id)

    return {
        "token": token,
        "user": {
            "id": user_id,
            "name": req.name,
            "email": req.email,
        },
    }


@router.post("/login")
def login(req: LoginRequest):
    """Authenticate user and return JWT token."""
    user = users_collection.find_one({"email": req.email})

    if not user or not pwd_context.verify(req.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    user_id = str(user["_id"])
    token = create_token(user_id)

    return {
        "token": token,
        "user": {
            "id": user_id,
            "name": user["name"],
            "email": user["email"],
        },
    }


@router.get("/me")
def get_me(user_id: str = Depends(get_current_user)):
    """Get current user profile."""
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
    }
