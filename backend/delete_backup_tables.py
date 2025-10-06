"""
Script สำหรับลบตาราง backup ที่ไม่ได้ใช้งานแล้ว
- solutions_backup
- question_solutions_backup
- solution_images_backup
"""

from sqlalchemy import create_engine, text
from database import DATABASE_URL

def delete_backup_tables():
    """ลบตาราง backup ทั้งหมด"""
    engine = create_engine(DATABASE_URL)
    
    backup_tables = [
        'solutions_backup',
        'question_solutions_backup', 
        'solution_images_backup'
    ]
    
    try:
        with engine.connect() as conn:
            print("🗑️  เริ่มลบตาราง backup...")
            
            for table_name in backup_tables:
                # ตรวจสอบว่าตารางมีอยู่จริง
                result = conn.execute(text(f"""
                    SELECT COUNT(*) as count 
                    FROM information_schema.tables 
                    WHERE table_schema = DATABASE() 
                    AND table_name = '{table_name}'
                """))
                exists = result.fetchone()[0] > 0
                
                if exists:
                    # ลบตาราง
                    conn.execute(text(f"DROP TABLE IF EXISTS {table_name}"))
                    conn.commit()
                    print(f"✅ ลบตาราง {table_name} สำเร็จ")
                else:
                    print(f"⚠️  ไม่พบตาราง {table_name}")
            
            print("\n✨ ลบตาราง backup ทั้งหมดเรียบร้อย!")
            print("💾 Database สะอาดและพร้อมใช้งาน")
            
    except Exception as e:
        print(f"❌ เกิดข้อผิดพลาด: {e}")
        raise
    finally:
        engine.dispose()

if __name__ == "__main__":
    print("=" * 60)
    print("🧹 ทำความสะอาด Database - ลบตาราง Backup")
    print("=" * 60)
    
    confirmation = input("\n⚠️  คุณแน่ใจหรือไม่ว่าต้องการลบตาราง backup ทั้งหมด? (yes/no): ")
    
    if confirmation.lower() == 'yes':
        delete_backup_tables()
    else:
        print("❌ ยกเลิกการลบ")
