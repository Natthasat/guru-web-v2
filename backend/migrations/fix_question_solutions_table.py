"""
Fix question_solutions table - เพิ่ม id column
"""
from sqlalchemy import create_engine, text
from database import DATABASE_URL

def fix_table():
    engine = create_engine(DATABASE_URL)
    
    with engine.connect() as conn:
        print("🔧 เริ่มแก้ไขตาราง question_solutions...")
        
        try:
            # ตรวจสอบโครงสร้างเดิม
            print("📋 ตรวจสอบโครงสร้างเดิม...")
            result = conn.execute(text("DESCRIBE question_solutions"))
            columns = [row[0] for row in result.fetchall()]
            print(f"   คอลัมน์ที่มีอยู่: {columns}")
            
            if 'id' in columns:
                print("✅ ตาราง question_solutions มี id อยู่แล้ว ไม่ต้องแก้ไข")
                return
            
            # Backup ข้อมูลเก่า
            print("💾 สำรองข้อมูลเก่า...")
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS question_solutions_backup AS 
                SELECT * FROM question_solutions
            """))
            conn.commit()
            
            # ลบตารางเก่า
            print("🗑️ ลบตารางเก่า...")
            conn.execute(text("SET FOREIGN_KEY_CHECKS = 0"))
            conn.execute(text("DROP TABLE IF EXISTS question_solutions"))
            conn.execute(text("SET FOREIGN_KEY_CHECKS = 1"))
            conn.commit()
            
            # สร้างตารางใหม่ที่มี id
            print("🆕 สร้างตารางใหม่...")
            conn.execute(text("""
                CREATE TABLE question_solutions (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    question_id INT NOT NULL,
                    solution_id INT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
                    FOREIGN KEY (solution_id) REFERENCES solutions(id) ON DELETE CASCADE,
                    UNIQUE KEY unique_question_solution (question_id, solution_id),
                    INDEX idx_question_id (question_id),
                    INDEX idx_solution_id (solution_id)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            """))
            conn.commit()
            
            # คืนข้อมูลเก่า (ถ้ามี)
            print("📥 คืนข้อมูลเก่า...")
            result = conn.execute(text("SELECT COUNT(*) as count FROM question_solutions_backup"))
            count = result.fetchone()[0]
            
            if count > 0:
                conn.execute(text("""
                    INSERT INTO question_solutions (question_id, solution_id, created_at)
                    SELECT question_id, solution_id, created_at 
                    FROM question_solutions_backup
                """))
                conn.commit()
                print(f"   ✅ คืนข้อมูล {count} รายการ")
            else:
                print("   ⚠️ ไม่มีข้อมูลเก่า")
            
            print("✅ แก้ไขตารางเสร็จสมบูรณ์!")
            print("📊 สรุป:")
            print("   - เพิ่มคอลัมน์ id แบบ AUTO_INCREMENT")
            print("   - สร้าง FOREIGN KEY constraints")
            print("   - สร้าง UNIQUE constraint")
            print("   - ข้อมูลเก่าสำรองอยู่ใน: question_solutions_backup")
            
        except Exception as e:
            print(f"❌ Error: {e}")
            print("💡 กรุณาตรวจสอบและลองใหม่อีกครั้ง")
            raise

if __name__ == "__main__":
    try:
        fix_table()
    except Exception as e:
        print(f"\n❌ เกิดข้อผิดพลาด: {e}")
