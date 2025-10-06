"""
Migration Script: จาก 1:1 เป็น Many-to-Many
รันสคริปต์นี้เพื่อแปลงข้อมูลเก่าให้เข้าโครงสร้างใหม่
"""
from sqlalchemy import create_engine, text
from database import DATABASE_URL

def migrate():
    engine = create_engine(DATABASE_URL)
    
    with engine.connect() as conn:
        print("🔄 เริ่มต้น Migration...")
        
        # 1. สำรองข้อมูลเก่าจากตาราง solutions
        print("📦 สำรองข้อมูลเก่า...")
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS solutions_backup AS 
            SELECT * FROM solutions
        """))
        conn.commit()
        
        # 2. สร้างตารางใหม่
        print("🆕 สร้างตารางใหม่...")
        
        # ตาราง solutions ใหม่
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS solutions_new (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255),
                answer_text TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_solution_id (id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """))
        
        # ตาราง solution_images
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS solution_images (
                id INT AUTO_INCREMENT PRIMARY KEY,
                solution_id INT NOT NULL,
                image_path VARCHAR(255) NOT NULL,
                image_order INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (solution_id) REFERENCES solutions_new(id) ON DELETE CASCADE,
                INDEX idx_solution_id (solution_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """))
        
        # ตาราง question_solutions (mapping)
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS question_solutions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                question_id INT NOT NULL,
                solution_id INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
                FOREIGN KEY (solution_id) REFERENCES solutions_new(id) ON DELETE CASCADE,
                UNIQUE KEY unique_question_solution (question_id, solution_id),
                INDEX idx_question_id (question_id),
                INDEX idx_solution_id (solution_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """))
        conn.commit()
        
        # 3. แปลงข้อมูลเก่า
        print("🔄 แปลงข้อมูลเก่า...")
        
        # ดึงข้อมูลเก่า
        old_solutions = conn.execute(text("SELECT * FROM solutions_backup")).fetchall()
        
        for old_sol in old_solutions:
            # เพิ่มเฉลยใหม่
            result = conn.execute(text("""
                INSERT INTO solutions_new (answer_text, created_at)
                VALUES (:answer_text, :created_at)
            """), {
                "answer_text": old_sol.answer_text,
                "created_at": old_sol.created_at
            })
            conn.commit()
            
            new_solution_id = result.lastrowid
            
            # เพิ่มรูปภาพ (ถ้ามี)
            if old_sol.answer_img:
                conn.execute(text("""
                    INSERT INTO solution_images (solution_id, image_path, image_order)
                    VALUES (:solution_id, :image_path, 0)
                """), {
                    "solution_id": new_solution_id,
                    "image_path": old_sol.answer_img
                })
                conn.commit()
            
            # เชื่อม question กับ solution
            conn.execute(text("""
                INSERT INTO question_solutions (question_id, solution_id)
                VALUES (:question_id, :solution_id)
            """), {
                "question_id": old_sol.question_id,
                "solution_id": new_solution_id
            })
            conn.commit()
        
        # 4. ลบตารางเก่าและเปลี่ยนชื่อ
        print("🗑️ ลบตารางเก่า...")
        conn.execute(text("SET FOREIGN_KEY_CHECKS = 0"))
        conn.execute(text("DROP TABLE IF EXISTS solutions"))
        conn.execute(text("SET FOREIGN_KEY_CHECKS = 1"))
        conn.commit()
        
        print("✨ เปลี่ยนชื่อตาราง...")
        conn.execute(text("RENAME TABLE solutions_new TO solutions"))
        conn.commit()
        
        print("✅ Migration เสร็จสิ้น!")
        print("📊 สรุป:")
        print(f"   - แปลงเฉลย: {len(old_solutions)} รายการ")
        print("   - สร้างตารางใหม่: solutions, solution_images, question_solutions")
        print("   - ข้อมูลเก่าถูกสำรองไว้ใน: solutions_backup")

if __name__ == "__main__":
    try:
        migrate()
    except Exception as e:
        print(f"❌ Error: {e}")
        print("💡 กรุณาตรวจสอบการเชื่อมต่อฐานข้อมูลและลองใหม่อีกครั้ง")
