from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
client = AsyncIOMotorClient(MONGO_URI)
db = client["Hypertrio"]
users_collection = db["Users"]
sessions_collection = db["Sessions"]
workouts_collection = db["Workouts"]
macros_collection = db["Macros"]
completed_workouts_collection = db["CompletedWorkouts"]
calories_collection = db["Calories"]

