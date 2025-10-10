"""
Migration: เพิ่ม column status ในตาราง questions
และคำนวณสถานะอัตโนมัติ
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine, text
from database import DATABASE_URL

def migrate():
    engine = create_engine(DATABASE_URL)
    
    with engine.connect() as conn:
        # 1. เพิ่ม column status
        try:
            conn.execute(text("""
                ALTER TABLE questions 
                ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'ขาดเฉลย'
            """))
            conn.commit()
            print("✅ เพิ่ม column 'status' สำเร็จ")
        except Exception as e:
            if "Duplicate column name" in str(e):
                print("⚠️  Column 'status' มีอยู่แล้ว")
            else:
                print(f"❌ Error adding column: {e}")
                raise
        
        # 2. อัพเดทสถานะทั้งหมดตามเงื่อนไข
        try:
            # อัพเดทสถานะเป็น 'ครบแล้ว' สำหรับโจทย์ที่มีเฉลยพร้อมรูป
            conn.execute(text("""
                UPDATE questions q
                SET status = 'ครบแล้ว'
                WHERE EXISTS (
                    SELECT 1 FROM solutions s
                    WHERE s.question_id = q.id
                    AND EXISTS (
                        SELECT 1 FROM solution_images si
                        WHERE si.solution_id = s.id
                    )
                )
            """))
            
            # อัพเดทสถานะเป็น 'ขาดรูปวิธีทำ' สำหรับโจทย์ที่มีเฉลยแต่ไม่มีรูป
            conn.execute(text("""
                UPDATE questions q
                SET status = 'ขาดรูปวิธีทำ'
                WHERE EXISTS (
                    SELECT 1 FROM solutions s
                    WHERE s.question_id = q.id
                )
                AND NOT EXISTS (
                    SELECT 1 FROM solutions s
                    WHERE s.question_id = q.id
                    AND EXISTS (
                        SELECT 1 FROM solution_images si
                        WHERE si.solution_id = s.id
                    )
                )
            """))
            
            # อัพเดทสถานะเป็น 'ขาดเฉลย' สำหรับโจทย์ที่ไม่มีเฉลยเลย
            conn.execute(text("""
                UPDATE questions q
                SET status = 'ขาดเฉลย'
                WHERE NOT EXISTS (
                    SELECT 1 FROM solutions s
                    WHERE s.question_id = q.id
                )
            """))
            
            conn.commit()
            print("✅ อัพเดทสถานะทั้งหมดสำเร็จ")
            
            # แสดงสรุป
            result = conn.execute(text("""
                SELECT status, COUNT(*) as count
                FROM questions
                GROUP BY status
            """))
            
            print("\n📊 สถิติสถานะโจทย์:")
            for row in result:
                print(f"  - {row.status}: {row.count} โจทย์")
                
        except Exception as e:
            print(f"❌ Error updating status: {e}")
            raise

if __name__ == "__main__":
    print("🚀 เริ่ม migration: add_status_to_questions")
    migrate()
    print("✅ Migration เสร็จสมบูรณ์!")
