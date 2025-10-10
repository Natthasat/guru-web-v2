"""
Migration: Add QuestionMetadata table and update Questions table
เพิ่มตาราง question_metadata และอัพเดตโครงสร้าง questions
"""

import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from config import settings

# Create engine
engine = create_engine(settings.DATABASE_URL)

def upgrade():
    """Run migration"""
    print("Starting migration: add_question_metadata")
    
    with engine.connect() as conn:
        # 1. เพิ่ม columns ใหม่ใน questions table
        print("1. Adding updated_at and updated_by columns to questions...")
        try:
            conn.execute("""
                ALTER TABLE questions 
                ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            """)
            conn.execute("""
                ALTER TABLE questions 
                ADD COLUMN updated_by VARCHAR(50) DEFAULT NULL
            """)
            print("   ✅ Added columns to questions table")
        except Exception as e:
            print(f"   ⚠️ Columns might already exist: {e}")
        
        # 2. สร้างตาราง question_metadata
        print("2. Creating question_metadata table...")
        try:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS question_metadata (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    question_id INT NOT NULL UNIQUE,
                    teacher_code VARCHAR(10) DEFAULT NULL,
                    teacher_name VARCHAR(100) DEFAULT NULL,
                    subject VARCHAR(100) DEFAULT NULL,
                    class_level VARCHAR(50) DEFAULT NULL,
                    course_type VARCHAR(10) DEFAULT NULL,
                    course_type_name VARCHAR(100) DEFAULT NULL,
                    year VARCHAR(10) DEFAULT NULL,
                    content_level VARCHAR(10) DEFAULT NULL,
                    content_level_name VARCHAR(100) DEFAULT NULL,
                    category VARCHAR(10) DEFAULT NULL,
                    chapter VARCHAR(10) DEFAULT NULL,
                    file_type VARCHAR(10) DEFAULT NULL,
                    file_type_name VARCHAR(100) DEFAULT NULL,
                    status VARCHAR(20) NOT NULL DEFAULT 'incomplete',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    
                    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
                    INDEX idx_teacher_code (teacher_code),
                    INDEX idx_teacher_name (teacher_name),
                    INDEX idx_subject (subject),
                    INDEX idx_class_level (class_level),
                    INDEX idx_course_type (course_type),
                    INDEX idx_year (year),
                    INDEX idx_content_level (content_level),
                    INDEX idx_category (category),
                    INDEX idx_chapter (chapter),
                    INDEX idx_file_type (file_type),
                    INDEX idx_status (status)
                )
            """)
            print("   ✅ Created question_metadata table")
        except Exception as e:
            print(f"   ⚠️ Table might already exist: {e}")
        
        conn.commit()
        print("✅ Migration completed successfully!")

def populate_metadata():
    """Populate metadata for existing questions"""
    print("\nPopulating metadata for existing questions...")
    
    from course_decoder import decode_course_code
    from sqlalchemy.orm import sessionmaker
    from models import Question, QuestionMetadata
    
    Session = sessionmaker(bind=engine)
    session = Session()
    
    try:
        questions = session.query(Question).all()
        print(f"Found {len(questions)} questions to process")
        
        success_count = 0
        skip_count = 0
        error_count = 0
        
        for q in questions:
            # ตรวจสอบว่ามี metadata อยู่แล้วหรือยัง
            existing = session.query(QuestionMetadata).filter_by(question_id=q.id).first()
            if existing:
                skip_count += 1
                continue
            
            # ถอดรหัส book_id
            decoded = decode_course_code(q.book_id)
            
            if decoded.get('success'):
                # คำนวณ status
                has_solutions = len(q.solutions) > 0
                has_images = any(len(sol.images) > 0 for sol in q.solutions) if has_solutions else False
                
                if not has_solutions:
                    status = 'incomplete'  # ขาดเฉลย (แดง)
                elif not has_images:
                    status = 'missing_images'  # ขาดรูปวิธีทำ (ส้ม)
                else:
                    status = 'complete'  # ครบแล้ว (เขียว)
                
                # สร้าง metadata
                metadata = QuestionMetadata(
                    question_id=q.id,
                    teacher_code=decoded.get('teacher_code'),
                    teacher_name=decoded.get('teacher_name'),
                    subject=decoded.get('subject'),
                    class_level=decoded.get('class_level'),
                    course_type=decoded.get('course_type'),
                    course_type_name=decoded.get('course_type_name'),
                    year=decoded.get('year'),
                    content_level=decoded.get('level'),
                    content_level_name=decoded.get('level_name'),
                    category=decoded.get('category'),
                    chapter=decoded.get('chapter'),
                    file_type=decoded.get('file_type'),
                    file_type_name=decoded.get('file_type_name'),
                    status=status
                )
                session.add(metadata)
                success_count += 1
                
                if success_count % 10 == 0:
                    print(f"   Processed {success_count} questions...")
            else:
                error_count += 1
                print(f"   ⚠️ Failed to decode: {q.book_id}")
        
        session.commit()
        print(f"\n✅ Metadata population completed!")
        print(f"   - Success: {success_count}")
        print(f"   - Skipped: {skip_count}")
        print(f"   - Errors: {error_count}")
        
    except Exception as e:
        session.rollback()
        print(f"❌ Error populating metadata: {e}")
    finally:
        session.close()

if __name__ == "__main__":
    upgrade()
    
    # ถามว่าต้องการ populate metadata หรือไม่
    response = input("\nDo you want to populate metadata for existing questions? (y/n): ")
    if response.lower() == 'y':
        populate_metadata()
    else:
        print("Skipping metadata population. You can run this script again later.")
