"""
Migration script: เปลี่ยนจาก Many-to-Many เป็น One-to-Many
- ลบตาราง question_solutions (junction table)
- เพิ่ม question_id column ในตาราง solutions
- ย้ายข้อมูลเก่ามาใหม่
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine, text
from database import DATABASE_URL
from logger import app_logger

def migrate_to_one_to_many():
    """
    Migration process:
    1. เพิ่มคอลัมน์ question_id ในตาราง solutions
    2. ย้ายข้อมูลจาก question_solutions มาที่ solutions.question_id
    3. ลบตาราง question_solutions
    """
    engine = create_engine(DATABASE_URL)
    
    with engine.connect() as conn:
        try:
            # เริ่ม transaction
            trans = conn.begin()
            
            app_logger.info("🔄 Starting migration to One-to-Many relationship...")
            
            # Step 1: เพิ่มคอลัมน์ question_id ใน solutions (ถ้ายังไม่มี)
            app_logger.info("Step 1: Adding question_id column to solutions table...")
            try:
                conn.execute(text("""
                    ALTER TABLE solutions 
                    ADD COLUMN question_id INT NULL
                """))
                app_logger.info("✅ Added question_id column")
            except Exception as e:
                if "Duplicate column" in str(e):
                    app_logger.info("⚠️  question_id column already exists, skipping...")
                else:
                    raise e
            
            # Step 2: ย้ายข้อมูลจาก question_solutions
            app_logger.info("Step 2: Migrating data from question_solutions...")
            
            # ตรวจสอบว่ามีตาราง question_solutions หรือไม่
            result = conn.execute(text("""
                SELECT COUNT(*) as count 
                FROM information_schema.tables 
                WHERE table_name = 'question_solutions'
            """))
            table_exists = result.fetchone()[0] > 0
            
            if table_exists:
                # นับจำนวน records ใน question_solutions
                result = conn.execute(text("SELECT COUNT(*) FROM question_solutions"))
                count = result.fetchone()[0]
                app_logger.info(f"Found {count} records in question_solutions")
                
                if count > 0:
                    # สำหรับแต่ละ solution ที่มีการเชื่อมกับ question
                    # เราจะเลือกเฉพาะ question แรก (เพราะเปลี่ยนเป็น one-to-many)
                    conn.execute(text("""
                        UPDATE solutions s
                        INNER JOIN (
                            SELECT solution_id, MIN(question_id) as question_id
                            FROM question_solutions
                            GROUP BY solution_id
                        ) qs ON s.id = qs.solution_id
                        SET s.question_id = qs.question_id
                        WHERE s.question_id IS NULL
                    """))
                    app_logger.info("✅ Migrated data successfully")
                    
                    # แสดงสถิติ
                    result = conn.execute(text("""
                        SELECT COUNT(*) FROM solutions WHERE question_id IS NOT NULL
                    """))
                    migrated_count = result.fetchone()[0]
                    app_logger.info(f"📊 Migrated {migrated_count} solutions")
                
                # Step 3: ลบตาราง question_solutions
                app_logger.info("Step 3: Dropping question_solutions table...")
                conn.execute(text("DROP TABLE IF EXISTS question_solutions"))
                app_logger.info("✅ Dropped question_solutions table")
            else:
                app_logger.info("⚠️  question_solutions table doesn't exist, skipping migration...")
            
            # Step 4: ทำให้ question_id เป็น NOT NULL และเพิ่ม foreign key
            app_logger.info("Step 4: Making question_id NOT NULL and adding foreign key...")
            
            # ลบ solutions ที่ไม่มี question_id (ถ้ามี)
            result = conn.execute(text("SELECT COUNT(*) FROM solutions WHERE question_id IS NULL"))
            orphan_count = result.fetchone()[0]
            if orphan_count > 0:
                app_logger.warning(f"⚠️  Found {orphan_count} orphan solutions (will be deleted)")
                conn.execute(text("DELETE FROM solutions WHERE question_id IS NULL"))
            
            # ตรวจสอบว่ามี foreign key อยู่แล้วหรือไม่
            result = conn.execute(text("""
                SELECT COUNT(*) 
                FROM information_schema.KEY_COLUMN_USAGE 
                WHERE TABLE_NAME = 'solutions' 
                AND COLUMN_NAME = 'question_id' 
                AND CONSTRAINT_NAME LIKE 'fk_%'
            """))
            fk_exists = result.fetchone()[0] > 0
            
            if not fk_exists:
                # เปลี่ยน column เป็น NOT NULL
                conn.execute(text("""
                    ALTER TABLE solutions 
                    MODIFY COLUMN question_id INT NOT NULL
                """))
                
                # เพิ่ม foreign key constraint
                conn.execute(text("""
                    ALTER TABLE solutions 
                    ADD CONSTRAINT fk_solutions_question_id 
                    FOREIGN KEY (question_id) 
                    REFERENCES questions(id) 
                    ON DELETE CASCADE
                """))
                app_logger.info("✅ Added foreign key constraint")
            else:
                app_logger.info("⚠️  Foreign key already exists, skipping...")
            
            # Commit transaction
            trans.commit()
            app_logger.info("🎉 Migration completed successfully!")
            
            # แสดงสถิติสุดท้าย
            result = conn.execute(text("SELECT COUNT(*) FROM questions"))
            question_count = result.fetchone()[0]
            result = conn.execute(text("SELECT COUNT(*) FROM solutions"))
            solution_count = result.fetchone()[0]
            
            app_logger.info(f"📊 Final statistics:")
            app_logger.info(f"   - Questions: {question_count}")
            app_logger.info(f"   - Solutions: {solution_count}")
            
        except Exception as e:
            trans.rollback()
            app_logger.error(f"❌ Migration failed: {e}", exc_info=True)
            raise

if __name__ == "__main__":
    try:
        migrate_to_one_to_many()
    except Exception as e:
        print(f"Migration failed: {e}")
        sys.exit(1)
