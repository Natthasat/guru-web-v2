"""
Migration Script: Add old_book_id column to questions table
เพิ่มคอลัมน์ old_book_id เพื่อเก็บรหัสหนังสือแบบเก่า (เช่น 1710-0141)

วิธีรัน:
    python backend/add_old_book_id_column.py
"""

from sqlalchemy import text
from database import engine

def add_old_book_id_column():
    print("🔧 กำลังเพิ่มคอลัมน์ old_book_id ลงในตาราง questions...")
    
    with engine.connect() as connection:
        try:
            # เพิ่ม column old_book_id
            connection.execute(text("""
                ALTER TABLE questions 
                ADD COLUMN old_book_id VARCHAR(50) NULL
                AFTER book_id
            """))
            connection.commit()
            print("✅ เพิ่มคอลัมน์ old_book_id สำเร็จ!")
            print("📝 ตอนนี้สามารถเก็บรหัสหนังสือแบบเก่าได้แล้ว (เช่น 1710-0141)")
            
        except Exception as e:
            if "Duplicate column name" in str(e):
                print("⚠️  คอลัมน์ old_book_id มีอยู่แล้ว")
            else:
                print(f"❌ เกิดข้อผิดพลาด: {e}")
                raise

if __name__ == "__main__":
    add_old_book_id_column()
