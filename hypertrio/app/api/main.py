from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, workouts, calories

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth")
app.include_router(workouts.router, prefix="/workouts")
app.include_router(calories.router, prefix="/calories")


@app.get("/")
def read_root():
    return {"Hello": "World"}
