from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from database import engine
from models import Base
from routes import questions, solutions, auth
import os

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Guru Web - Question Answer System",
    description="API for managing questions and solutions",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(questions.router, prefix="/api", tags=["questions"])
app.include_router(solutions.router, prefix="/api", tags=["solutions"])

# เสิร์ฟไฟล์รูปภาพ
uploads_dir = "backend/uploads"
if not os.path.exists(uploads_dir):
    os.makedirs(uploads_dir)
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

@app.get("/")
async def root():
    return {"message": "Guru Web API - Question Answer System"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)