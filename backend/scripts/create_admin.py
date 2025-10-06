"""
Script สำหรับสร้าง admin user คนแรก
รัน: python scripts/create_admin.py
"""

import sys
import os
# Add parent directory to path to import from parent folder
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base, User
from auth import get_password_hash

def create_admin_user():
    # สร้าง tables ทั้งหมด (รวม users table ใหม่)
    Base.metadata.create_all(bind=engine)
    
    # สร้าง database session
    db = SessionLocal()
    
    try:
        # ตรวจสอบว่ามี admin user อยู่แล้วหรือไม่
        existing_admin = db.query(User).filter(User.username == "admin").first()
        if existing_admin:
            print("⚠️  Admin user already exists!")
            print("Deleting old user and creating new one with bcrypt hash...")
            db.delete(existing_admin)
            db.commit()
        
        # สร้าง admin user ใหม่ (ใช้ bcrypt)
        password = "Hippo@2017"
        password_hash = get_password_hash(password)
        
        print(f"Generated bcrypt hash: {password_hash[:60]}...")
            
        admin_user = User(
            username="admin",
            password_hash=password_hash
        )
        
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        
        print("✅ Admin user created successfully!")
        print(f"Username: admin")
        print(f"Password: Hippo@2017")
        print(f"User ID: {admin_user.id}")
        print(f"Password Hash (bcrypt): {admin_user.password_hash[:60]}...")
        
    except Exception as e:
        print(f"❌ Error creating admin user: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_admin_user()