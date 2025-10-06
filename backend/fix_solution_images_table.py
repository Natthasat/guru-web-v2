"""
Fix solution_images table - ตรวจสอบและแก้ไขโครงสร้าง
"""
from sqlalchemy import create_engine, text
from database import DATABASE_URL

def fix_solution_images_table():
    engine = create_engine(DATABASE_URL)
    
    with engine.connect() as conn:
        print("🔧 เริ่มแก้ไขตาราง solution_images...")
        
        try:
            # ตรวจสอบว่าตารางมีอยู่หรือไม่
            result = conn.execute(text("SHOW TABLES LIKE 'solution_images'"))
            table_exists = result.fetchone() is not None
            
            if not table_exists:
                print("⚠️  ตาราง solution_images ไม่มี - กำลังสร้างใหม่...")
                conn.execute(text("""
                    CREATE TABLE solution_images (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        solution_id INT NOT NULL,
                        image_path VARCHAR(255) NOT NULL,
                        image_order INT DEFAULT 0,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (solution_id) REFERENCES solutions(id) ON DELETE CASCADE,
                        INDEX idx_solution_id (solution_id)
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                """))
                conn.commit()
                print("✅ สร้างตาราง solution_images เรียบร้อย!")
                return
            
            # ตรวจสอบโครงสร้างปัจจุบัน
            print("📋 ตรวจสอบโครงสร้างตาราง...")
            result = conn.execute(text("DESCRIBE solution_images"))
            columns = {row[0]: row for row in result.fetchall()}
            print(f"   คอลัมน์ที่มี: {list(columns.keys())}")
            
            if 'image_path' in columns:
                print("✅ ตาราง solution_images มีโครงสร้างถูกต้องแล้ว!")
                return
            
            # ถ้าไม่มี image_path แต่มีคอลัมน์อื่น ให้ Backup และสร้างใหม่
            print("💾 สำรองข้อมูลเก่า...")
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS solution_images_backup AS 
                SELECT * FROM solution_images
            """))
            conn.commit()
            
            print("🗑️  ลบตารางเก่า...")
            conn.execute(text("SET FOREIGN_KEY_CHECKS = 0"))
            conn.execute(text("DROP TABLE IF EXISTS solution_images"))
            conn.execute(text("SET FOREIGN_KEY_CHECKS = 1"))
            conn.commit()
            
            print("🆕 สร้างตารางใหม่...")
            conn.execute(text("""
                CREATE TABLE solution_images (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    solution_id INT NOT NULL,
                    image_path VARCHAR(255) NOT NULL,
                    image_order INT DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (solution_id) REFERENCES solutions(id) ON DELETE CASCADE,
                    INDEX idx_solution_id (solution_id)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            """))
            conn.commit()
            
            print("✅ แก้ไขตารางเสร็จสมบูรณ์!")
            print("📊 สรุป:")
            print("   - สร้างตาราง solution_images ใหม่")
            print("   - เพิ่มคอลัมน์: id, solution_id, image_path, image_order, created_at")
            print("   - สร้าง FOREIGN KEY constraint")
            print("   - ข้อมูลเก่าสำรองอยู่ใน: solution_images_backup")
            
        except Exception as e:
            print(f"❌ Error: {e}")
            raise

if __name__ == "__main__":
    try:
        fix_solution_images_table()
    except Exception as e:
        print(f"\n❌ เกิดข้อผิดพลาด: {e}")
