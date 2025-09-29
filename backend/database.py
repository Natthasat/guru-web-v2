from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Database URL - MySQL connection to guru_DB
# แก้ไข username และ password ให้ตรงกับ MySQL server ของคุณ
# ตัวอย่าง: "mysql+pymysql://username:password@localhost:3306/guru_DB"
DATABASE_URL = "mysql+pymysql://root:@localhost:3306/guru_DB"

# สำหรับกรณีที่ยังไม่มี MySQL ให้ใช้ SQLite ชั่วคราว
# DATABASE_URL = "sqlite:///./guru_web.db"

# Create engine with better error handling
try:
    engine = create_engine(DATABASE_URL, pool_pre_ping=True)
    # Test connection more thoroughly
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1"))
        result.fetchone()
    print("✅ เชื่อมต่อ MySQL guru_DB สำเร็จ")
except Exception as e:
    print(f"❌ ไม่สามารถเชื่อมต่อ MySQL: {e}")
    print("🔄 กำลังใช้ SQLite แทน...")
    DATABASE_URL = "sqlite:///./guru_web.db"
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
    print("✅ ใช้ SQLite สำหรับการพัฒนา")

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