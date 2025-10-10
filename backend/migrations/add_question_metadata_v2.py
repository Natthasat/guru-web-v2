"""
Simple Migration: Add QuestionMetadata table using raw SQL
"""

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

import pymysql
from config import settings

def run_migration():
    """Run migration using raw SQL"""
    print("Starting migration: add_question_metadata (raw SQL)")
    
    # Parse database URL
    # Format: mysql+pymysql://user:pass@host:port/dbname
    url = settings.DATABASE_URL.replace('mysql+pymysql://', '')
    auth, rest = url.split('@')
    username, password = auth.split(':')
    host_port, dbname = rest.split('/')
    host = host_port.split(':')[0]
    port = int(host_port.split(':')[1]) if ':' in host_port else 3306
    
    # Connect to database
    connection = pymysql.connect(
        host=host,
        port=port,
        user=username,
        password=password,
        database=dbname,
        charset='utf8mb4'
    )
    
    try:
        with connection.cursor() as cursor:
            # 1. Add columns to questions table
            print("1. Adding updated_at and updated_by columns to questions...")
            try:
                cursor.execute("""
                    ALTER TABLE questions 
                    ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                """)
                print("   ✅ Added updated_at column")
            except Exception as e:
                if "Duplicate column" in str(e):
                    print("   ⚠️  updated_at column already exists")
                else:
                    print(f"   ❌ Error: {e}")
            
            try:
                cursor.execute("""
                    ALTER TABLE questions 
                    ADD COLUMN updated_by VARCHAR(50) DEFAULT NULL
                """)
                print("   ✅ Added updated_by column")
            except Exception as e:
                if "Duplicate column" in str(e):
                    print("   ⚠️  updated_by column already exists")
                else:
                    print(f"   ❌ Error: {e}")
            
            # 2. Create question_metadata table
            print("2. Creating question_metadata table...")
            cursor.execute("""
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
            
            connection.commit()
            print("\n✅ Migration completed successfully!")
            
    finally:
        connection.close()

def populate_metadata():
    """Populate metadata for existing questions"""
    print("\n" + "="*60)
    print("Populating metadata for existing questions...")
    print("="*60)
    
    from course_decoder import decode_course_code
    
    # Parse database URL
    url = settings.DATABASE_URL.replace('mysql+pymysql://', '')
    auth, rest = url.split('@')
    username, password = auth.split(':')
    host_port, dbname = rest.split('/')
    host = host_port.split(':')[0]
    port = int(host_port.split(':')[1]) if ':' in host_port else 3306
    
    connection = pymysql.connect(
        host=host,
        port=port,
        user=username,
        password=password,
        database=dbname,
        charset='utf8mb4'
    )
    
    try:
        with connection.cursor(pymysql.cursors.DictCursor) as cursor:
            # Get all questions
            cursor.execute("SELECT id, book_id FROM questions")
            questions = cursor.fetchall()
            print(f"\nFound {len(questions)} questions to process")
            
            success_count = 0
            skip_count = 0
            error_count = 0
            
            for q in questions:
                q_id = q['id']
                book_id = q['book_id']
                
                # Check if metadata already exists
                cursor.execute("SELECT id FROM question_metadata WHERE question_id = %s", (q_id,))
                if cursor.fetchone():
                    skip_count += 1
                    continue
                
                # Decode book_id
                decoded = decode_course_code(book_id)
                
                if decoded.get('success'):
                    # Get solution count and images count
                    cursor.execute("""
                        SELECT COUNT(*) as solution_count 
                        FROM solutions 
                        WHERE question_id = %s
                    """, (q_id,))
                    solution_count = cursor.fetchone()['solution_count']
                    
                    cursor.execute("""
                        SELECT COUNT(*) as image_count 
                        FROM solution_images si
                        JOIN solutions s ON si.solution_id = s.id
                        WHERE s.question_id = %s
                    """, (q_id,))
                    image_count = cursor.fetchone()['image_count']
                    
                    # Determine status
                    if solution_count == 0:
                        status = 'incomplete'  # ขาดเฉลย (แดง)
                    elif image_count == 0:
                        status = 'missing_images'  # ขาดรูปวิธีทำ (ส้ม)
                    else:
                        status = 'complete'  # ครบแล้ว (เขียว)
                    
                    # Insert metadata
                    cursor.execute("""
                        INSERT INTO question_metadata (
                            question_id, teacher_code, teacher_name, subject, class_level,
                            course_type, course_type_name, year, content_level, content_level_name,
                            category, chapter, file_type, file_type_name, status
                        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """, (
                        q_id,
                        decoded.get('teacher_code'),
                        decoded.get('teacher_name'),
                        decoded.get('subject'),
                        decoded.get('class_level'),
                        decoded.get('course_type'),
                        decoded.get('course_type_name'),
                        decoded.get('year'),
                        decoded.get('level'),
                        decoded.get('level_name'),
                        decoded.get('category'),
                        decoded.get('chapter'),
                        decoded.get('file_type'),
                        decoded.get('file_type_name'),
                        status
                    ))
                    
                    success_count += 1
                    
                    if success_count % 10 == 0:
                        print(f"   Processed {success_count} questions...")
                        connection.commit()
                else:
                    error_count += 1
                    print(f"   ⚠️  Failed to decode: {book_id}")
            
            connection.commit()
            print(f"\n{'='*60}")
            print("✅ Metadata population completed!")
            print(f"{'='*60}")
            print(f"   ✅ Success: {success_count}")
            print(f"   ⏭️  Skipped: {skip_count}")
            print(f"   ❌ Errors: {error_count}")
            
    except Exception as e:
        connection.rollback()
        print(f"❌ Error populating metadata: {e}")
        import traceback
        traceback.print_exc()
    finally:
        connection.close()

if __name__ == "__main__":
    run_migration()
    
    response = input("\nDo you want to populate metadata for existing questions? (y/n): ")
    if response.lower() == 'y':
        populate_metadata()
    else:
        print("Skipped metadata population. You can run this script again later.")
