from fastapi import APIRouter, Body, HTTPException
from pydantic import BaseModel
from passlib.hash import argon2
from services.db import users_collection, sessions_collection
import logging
import os
import secrets
from datetime import datetime, timedelta
from bson import ObjectId

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str

def create_session(user_id: str, role: str = "user"):
    session_id = secrets.token_hex(32)
    now = datetime.utcnow()
    expires = now + timedelta(days=1)  

    session_data = {
        "sessionId": session_id,
        "userId": user_id,
        "role": role,
        "createdAt": now,
        "expiresAt": expires,
    }

    return session_data


@router.post("/register")
async def register_user(request: RegisterRequest):
   
    name, email, password = request.name, request.email, request.password
    
    
    if len(password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters long")

    
    existing_user = await users_collection.find_one({"email": email})
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

   
    hashed_password = argon2.hash(password)
    user_data = {
        "name": name,
        "email": email,
        "password": hashed_password,
        "createdAt": datetime.utcnow()
    }

    result = await users_collection.insert_one(user_data)
    user_id = str(result.inserted_id)
    
    session_data = create_session(user_id)
    await sessions_collection.insert_one(session_data)

    
    return {
        "_id": user_id,
        "email": email,
        "name": name,
        "sessionId": session_data["sessionId"]
    }


@router.post("/login")
async def login_user(request: LoginRequest):
    """Authenticate user and create a session"""
    email, password = request.email, request.password
    
    logger.info(f"Login attempt for email: {email}")

    # Find user by email
    user = await users_collection.find_one({"email": email})
    if not user:
        logger.error(f"User not found: {email}")
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Verify password
    try:
        logger.info(f"Verifying password for user: {email}")
        stored_password = user["password"]
        logger.info(f"Stored password hash: {stored_password[:10]}...")
        
        # Use argon2.verify to check the password
        is_valid = argon2.verify(password, stored_password)
        logger.info(f"Password verification result: {is_valid}")
        
        if not is_valid:
            logger.error(f"Invalid password for user: {email}")
            raise HTTPException(status_code=401, detail="Invalid credentials")
    except Exception as e:
        logger.error(f"Password verification error: {str(e)}")
        raise HTTPException(status_code=401, detail=f"Authentication error: {str(e)}")

    # Create new session
    user_id = str(user["_id"])
    session_data = create_session(user_id)
    await sessions_collection.insert_one(session_data)

    # Return user data with session ID
    logger.info(f"Login successful for user: {email}")
    return {
        "_id": user_id,
        "email": user["email"],
        "name": user.get("name", ""),
        "sessionId": session_data["sessionId"]
    }

@router.get("/session/{session_id}")
async def validate_session(session_id: str):
    """Validate a session and return user data"""
    session = await sessions_collection.find_one({"sessionId": session_id})
    
    if not session:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    # Check if session is expired
    if session["expiresAt"] < datetime.utcnow():
        raise HTTPException(status_code=401, detail="Session expired")
    
    # Get user data
    user = await users_collection.find_one({"_id": ObjectId(session["userId"])})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "_id": str(user["_id"]),
        "email": user["email"],
        "name": user.get("name", ""),
        "role": session["role"],
        "sessionId": session_id
    }
@router.get("/user/{user_id}")
async def get_user(user_id: str):
    try:
        user = await users_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Convert ObjectId to string for JSON response
        user["_id"] = str(user["_id"])
        return user
    except Exception as e:
        logger.error(f"Error fetching user: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch user")

@router.put("/user/{user_id}")
async def update_user(user_id: str, user_update: dict):
    try:
        if not user_update:
            raise HTTPException(status_code=400, detail="No update data provided")

        result = await users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": user_update}
        )

        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="User not found")

        # Get the updated user data
        updated_user = await users_collection.find_one({"_id": ObjectId(user_id)})
        if not updated_user:
            raise HTTPException(status_code=404, detail="User not found")

        # Convert ObjectId to string for JSON response
        updated_user["_id"] = str(updated_user["_id"])
        return updated_user
    except Exception as e:
        logger.error(f"Error updating user: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update user")
        