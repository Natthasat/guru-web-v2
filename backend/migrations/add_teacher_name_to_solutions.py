"""
Migration: เพิ่ม column teacher_name ในตาราง solutions
วันที่: 2025-10-07
"""

import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent))

from sqlalchemy import text
from database import engine

def upgrade():
    """เพิ่ม column teacher_name"""
    with engine.connect() as conn:
        try:
            # เพิ่ม column teacher_name (nullable)
            conn.execute(text("""
                ALTER TABLE solutions 
                ADD COLUMN teacher_name VARCHAR(100) NULL
                COMMENT 'ชื่อครูผู้ให้เฉลย'
            """))
            conn.commit()
            print("✅ เพิ่ม column teacher_name ในตาราง solutions สำเร็จ!")
            
        except Exception as e:
            conn.rollback()
            print(f"❌ เกิดข้อผิดพลาด: {e}")
            raise

def downgrade():
    """ลบ column teacher_name (ถ้าต้องการ rollback)"""
    with engine.connect() as conn:
        try:
            conn.execute(text("""
                ALTER TABLE solutions 
                DROP COLUMN teacher_name
            """))
            conn.commit()
            print("✅ ลบ column teacher_name จากตาราง solutions สำเร็จ!")
            
        except Exception as e:
            conn.rollback()
            print(f"❌ เกิดข้อผิดพลาด: {e}")
            raise

if __name__ == "__main__":
    print("🔄 กำลังเพิ่ม column teacher_name ในตาราง solutions...")
    upgrade()
    print("✅ Migration เสร็จสมบูรณ์!")
