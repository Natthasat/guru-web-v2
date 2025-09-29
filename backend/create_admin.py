"""
Script สำหรับสร้าง admin user คนแรก
รัน: python create_admin.py
"""

from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base, User
import hashlib

def create_admin_user():
    # สร้าง tables ทั้งหมด (รวม users table ใหม่)
    Base.metadata.create_all(bind=engine)
    
    # สร้าง database session
    db = SessionLocal()
    
    try:
        # ตรวจสอบว่ามี admin user อยู่แล้วหรือไม่
        existing_admin = db.query(User).filter(User.username == "admin").first()
        if existing_admin:
            print("Admin user already exists!")
            return
        
        # สร้าง admin user ใหม่ (ใช้ SHA256 แทน bcrypt เพื่อความง่าย)
        password = "Hippo@2017"
        password_hash = hashlib.sha256(password.encode()).hexdigest()
            
        admin_user = User(
            username="admin",
            password_hash=password_hash
        )
        
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        
        print("Admin user created successfully!")
        print(f"Username: admin")
        print(f"Password: Hippo@2017")
        print(f"User ID: {admin_user.id}")
        
    except Exception as e:
        print(f"Error creating admin user: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_admin_user()