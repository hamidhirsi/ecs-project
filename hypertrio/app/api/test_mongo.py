from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
import os
from dotenv import load_dotenv

load_dotenv()  # Load from your .env file

async def test_connection():
    uri = "mongodb+srv://ayub:pass1234@cluster0.6vfoajj.mongodb.net/Hypertrio?retryWrites=true&w=majority"
    client = AsyncIOMotorClient(uri)
    try:
        result = await client["admin"].command("ping")
        print("✅ MongoDB connected!" if result["ok"] else "❌ Ping failed")
    except Exception as e:
        print("❌ Connection error:", e)

asyncio.run(test_connection())