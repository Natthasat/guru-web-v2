from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
import logging
from config import settings

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Get Database URL from environment variables
DATABASE_URL = settings.DATABASE_URL

# Create engine with better error handling
try:
    engine = create_engine(DATABASE_URL, pool_pre_ping=True)
    # Test connection more thoroughly
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1"))
        result.fetchone()
    logger.info("✅ เชื่อมต่อฐานข้อมูลสำเร็จ")
except Exception as e:
    logger.error(f"❌ ไม่สามารถเชื่อมต่อฐานข้อมูล: {e}")
    logger.warning("🔄 กำลังใช้ SQLite แทน...")
    DATABASE_URL = "sqlite:///./guru_web.db"
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
    logger.info("✅ ใช้ SQLite สำหรับการพัฒนา")

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create Base class
Base = declarative_base()

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()