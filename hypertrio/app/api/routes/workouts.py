from services.db import workouts_collection, completed_workouts_collection
from fastapi import APIRouter, HTTPException
from datetime import datetime
from bson import ObjectId
from pydantic import BaseModel
from typing import Dict, List
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

class WorkoutRequest(BaseModel):
    name: str
    exercises: list[str]
    user_id: str

class Set(BaseModel):
    kg: str
    reps: str
    notes: str

class CompletedWorkoutRequest(BaseModel):
    user_id: str
    workout_name: str
    exercises: Dict[str, List[Set]]
    completed_at: str

@router.post("/workouts")
async def add_workout(workout: WorkoutRequest):
    try:
        workout_data = {
            "name": workout.name,
            "exercises": workout.exercises,
            "user_id": workout.user_id,
            "created_at": datetime.now()
        }
        result = await workouts_collection.insert_one(workout_data)
        return {"id": str(result.inserted_id)}
    except Exception as e:
        print(f"Error adding workout: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to add workout")

@router.get("/workouts/{user_id}")
async def get_workouts(user_id: str):
    try:
        # Fetch workouts for the specified user
        workouts = await workouts_collection.find({"user_id": user_id}).to_list(100)
        # Convert ObjectId to string for JSON serialization
        serialized_workouts = []
        for workout in workouts:
            workout['_id'] = str(workout['_id'])  # Convert ObjectId to string
            serialized_workouts.append(workout)
        return serialized_workouts
    except Exception as e:
        print(f"Error getting workouts: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get workouts")

@router.get("/workouts/{user_id}/{workout_name}")
async def get_workout(user_id: str, workout_name: str):
    try:
        # Fetch specific workout for the user
        workout = await workouts_collection.find_one({"user_id": user_id, "name": workout_name})
        if not workout:
            raise HTTPException(status_code=404, detail="Workout not found")
        
        workout['_id'] = str(workout['_id'])  # Convert ObjectId to string
        return workout
    except Exception as e:
        print(f"Error getting workout: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get workout")

@router.get("/workouts/{workout_id}")
async def get_workout(workout_id: str):
    try:
        workout = await workouts_collection.find_one({"_id": ObjectId(workout_id)})
        if not workout:
            raise HTTPException(status_code=404, detail="Workout not found")
        return workout
    except Exception as e:
        logger.error(f"Error getting workout: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get workout")

@router.put("/workouts/{workout_id}")
async def update_workout(workout_id: str, workout: WorkoutRequest):
    try:
        # Convert string ID to ObjectId
        object_id = ObjectId(workout_id)
        
        workout_data = {
            "name": workout.name,
            "exercises": workout.exercises,
            "updated_at": datetime.now()
        }
        result = await workouts_collection.update_one({"_id": object_id}, {"$set": workout_data})
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Workout not found")
        return {"name": workout.name, "exercises": workout.exercises}
    except Exception as e:
        logger.error(f"Error updating workout: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update workout")

@router.post("/completed")
async def save_completed_workout(workout: CompletedWorkoutRequest):
    try:
        await completed_workouts_collection.insert_one(workout.dict())
        
    except Exception as e:
        logger.error(f"Error saving completed workout: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to save completed workout")

@router.delete("/workouts/{workout_id}")
async def delete_workout(workout_id: str):
    try:
        result = await workouts_collection.delete_one({"_id": ObjectId(workout_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Workout not found")
        return {"id": workout_id}
    except Exception as e:
        logger.error(f"Error deleting workout: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete workout")


@router.get("/exercises/{user_id}")
async def get_user_exercises(user_id: str):
    try:
        user_workouts = await completed_workouts_collection.find({"user_id": user_id}).to_list(None)
        exercise_dict = {}

        for workout in user_workouts:
            completed_at = workout.get("completed_at")
            exercises = workout.get("exercises", {})
            for exercise_name, sets in exercises.items():
                if exercise_name not in exercise_dict:
                    exercise_dict[exercise_name] = []
                for s in sets:
                    # Attach the completed_at timestamp to each set
                    s_with_timestamp = {**s, "completed_at": completed_at}
                    exercise_dict[exercise_name].append(s_with_timestamp)

        return exercise_dict
    except Exception as e:
        logger.error(f"Error gathering exercises: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to gather user exercise history")


@router.get("/workouts_count/{user_id}")
async def get_workouts_count(user_id: str):
    try:
        # Fetch workouts for the specified user
        workouts = await workouts_collection.find({"user_id": user_id}).to_list(100)
        return len(workouts)
    except Exception as e:
        logger.error(f"Error getting workouts count: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get workouts count")
