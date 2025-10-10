from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from database import engine
from models import Base
from routes import questions, solutions, auth, users, question_list
from config import settings
from logger import app_logger
import os
import logging

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Guru Web - Question Answer System",
    description="API for managing questions and solutions with Many-to-Many relationship",
    version="2.0.0",
    debug=settings.DEBUG
)

# Custom exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    app_logger.error(f"Global exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง"}
    )

# Configure CORS from environment variables
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(users.router, prefix="/api", tags=["users"])
app.include_router(questions.router, prefix="/api", tags=["questions"])
app.include_router(solutions.router, prefix="/api", tags=["solutions"])
app.include_router(question_list.router, prefix="/api/manage", tags=["question_management"])

# Import course router
from routes import course
app.include_router(course.router, prefix="/api/course", tags=["course"])

# Import teacher management router
from routes import teachers
app.include_router(teachers.router, prefix="/api", tags=["teachers"])

# Import solution search router
from routes import solution_search
app.include_router(solution_search.router, prefix="/api", tags=["solution_search"])

# เสิร์ฟไฟล์รูปภาพ
# แปลง path ให้เป็น absolute path จาก directory ของ main.py
uploads_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "uploads"))
if not os.path.exists(uploads_dir):
    os.makedirs(uploads_dir)
    app_logger.info(f"Created upload directory: {uploads_dir}")
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")
app_logger.info(f"[OK] Serving uploads from: {uploads_dir}")

@app.get("/")
async def root():
    return {
        "message": "Guru Web API - Question Answer System",
        "version": "2.0.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    app_logger.info(f"Starting server on {settings.HOST}:{settings.PORT}")
    uvicorn.run(
        app, 
        host=settings.HOST, 
        port=settings.PORT,
        log_level=settings.LOG_LEVEL.lower()
    )