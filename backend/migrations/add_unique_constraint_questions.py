"""
Migration: เพิ่ม UNIQUE constraint สำหรับ (book_id, page, question_no)
"""
import sys
from pathlib import Path

# เพิ่ม parent directory เข้า path เพื่อ import database
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy import create_engine, text
from database import DATABASE_URL

def add_unique_constraint():
    engine = create_engine(DATABASE_URL)
    
    with engine.connect() as conn:
        try:
            # ตรวจสอบว่ามีข้อมูลซ้ำหรือไม่
            result = conn.execute(text("""
                SELECT book_id, page, question_no, COUNT(*) as count
                FROM questions
                GROUP BY book_id, page, question_no
                HAVING COUNT(*) > 1
            """))
            
            duplicates = result.fetchall()
            
            if duplicates:
                print("⚠️  พบข้อมูลซ้ำในฐานข้อมูล:")
                for dup in duplicates:
                    print(f"   - {dup[0]} หน้า {dup[1]} ข้อ {dup[2]} (มี {dup[3]} รายการ)")
                print()
                print("กรุณาลบข้อมูลซ้ำก่อน หรือรวมข้อมูลเข้าด้วยกัน")
                return False
            
            print("✅ ไม่มีข้อมูลซ้ำ")
            print()
            
            # เพิ่ม UNIQUE constraint
            print("📝 กำลังเพิ่ม UNIQUE constraint...")
            conn.execute(text("""
                ALTER TABLE questions
                ADD CONSTRAINT unique_question 
                UNIQUE (book_id, page, question_no)
            """))
            conn.commit()
            
            print("✅ เพิ่ม UNIQUE constraint สำเร็จ!")
            print()
            print("📊 ตอนนี้ระบบจะป้องกันการเพิ่มโจทย์ซ้ำ:")
            print("   - book_id + page + question_no ต้องไม่ซ้ำกัน")
            print("   - ถ้าพยายามเพิ่มซ้ำ จะได้ error")
            
            return True
            
        except Exception as e:
            print(f"❌ Error: {e}")
            return False

if __name__ == "__main__":
    print("=" * 60)
    print("🔧 Migration: เพิ่ม UNIQUE Constraint")
    print("=" * 60)
    print()
    
    success = add_unique_constraint()
    
    if success:
        print()
        print("🎉 Migration สำเร็จ!")
    else:
        print()
        print("💡 แนะนำ: ใช้หน้า Admin จัดการโจทย์เพื่อลบหรือแก้ไขข้อมูลซ้ำ")
