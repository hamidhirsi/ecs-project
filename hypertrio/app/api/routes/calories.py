from services.db import calories_collection, users_collection
from fastapi import APIRouter, HTTPException
from datetime import datetime, timedelta
from bson import ObjectId
from pydantic import BaseModel
from typing import Dict, List
import logging
from datetime import datetime, timezone

logger = logging.getLogger(__name__)

router = APIRouter()

class FoodEntry(BaseModel):
    name: str
    calories: int
    timestamp: datetime

class CalorieRequest(BaseModel):
    food: str
    calories: int

@router.post("/log/{user_id}")
async def log_calories(user_id: str, request: CalorieRequest):
    try:
        # Get user's calorie goal
        user = await users_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        calorie_goal = user.get('calorie_goal', 2000)
        
        # Get the start of the current day in UTC
        now = datetime.now(timezone.utc)
        day_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        day_end = day_start + timedelta(days=1)
        
        # Try to find an existing entry for today
        today_entry = await calories_collection.find_one({
            "user_id": user_id,
            "date": {"$gte": day_start, "$lt": day_end}
        })
        
        # Create the food entry with the name field
        new_food_entry = {
            "name": request.food,  # Frontend sends 'food', we store as 'name'
            "calories": request.calories,
            "timestamp": now
        }
        
        if today_entry:
            # Update existing entry
            await calories_collection.update_one(
                {"_id": today_entry["_id"]},
                {
                    "$push": {"food": new_food_entry},
                    "$inc": {"total_calories": request.calories}
                }
            )
            updated_entry = await calories_collection.find_one({"_id": today_entry["_id"]})
            updated_entry["_id"] = str(updated_entry["_id"])
            return updated_entry
        else:
            # Create new entry for today
            new_entry = {
                "user_id": user_id,
                "date": day_start,
                "food": [new_food_entry],
                "total_calories": request.calories,
                "calorie_goal": calorie_goal
            }
            result = await calories_collection.insert_one(new_entry)
            created_entry = await calories_collection.find_one({"_id": result.inserted_id})
            created_entry["_id"] = str(created_entry["_id"])
            return created_entry
            
    except Exception as e:
        logger.error(f"Error logging calories: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/today/{user_id}")
async def get_today_calories(user_id: str):
    try:
        # Get the start of the current day in UTC
        now = datetime.now(timezone.utc)
        day_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        day_end = day_start + timedelta(days=1)
        
        # Find today's entry
        entry = await calories_collection.find_one({
            "user_id": user_id,
            "date": {"$gte": day_start, "$lt": day_end}
        })
        
        if not entry:
            # If no entry exists, get user's goal and return empty data
            user = await users_collection.find_one({"_id": ObjectId(user_id)})
            if not user:
                raise HTTPException(status_code=404, detail="User not found")
            
            return {
                "user_id": user_id,
                "date": day_start,
                "food": [],
                "total_calories": 0,
                "calorie_goal": user.get('calorie_goal', 2000)
            }
            
        if entry:
            # Convert ObjectId to string
            entry["_id"] = str(entry["_id"])
            return entry
            
        # If no entry exists, return empty data with user's goal
        user = await users_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {
            "user_id": user_id,
            "date": day_start,
            "food": [],
            "total_calories": 0,
            "calorie_goal": user.get('calorie_goal', 2000)
        }
        
    except Exception as e:
        logger.error(f"Error getting today's calories: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
