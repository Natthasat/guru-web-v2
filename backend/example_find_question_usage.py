"""
ตัวอย่างการใช้งาน find_question_by_any_book_id()

ฟังก์ชันนี้เป็น reusable utility สำหรับค้นหาโจทย์โดยรองรับ:
- รหัสหนังสือแบบใหม่ (book_id)
- รหัสหนังสือแบบเก่า (old_book_id)
"""

from sqlalchemy.orm import Session
from sqlalchemy import or_
from models import Question
from typing import Optional

def find_question_by_any_book_id(
    db: Session, 
    book_id: str, 
    page: int, 
    question_no: int
) -> Optional[Question]:
    """
    ค้นหาโจทย์โดยรองรับการค้นหาจากรหัสหนังสือทั้งแบบใหม่ (book_id) และแบบเก่า (old_book_id)
    
    Args:
        db (Session): SQLAlchemy database session
        book_id (str): รหัสหนังสือที่ต้องการค้นหา (สามารถเป็นรหัสใหม่หรือเก่าก็ได้)
        page (int): หน้าหนังสือ
        question_no (int): ข้อที่
    
    Returns:
        Optional[Question]: Question object ถ้าพบ, None ถ้าไม่พบ
    
    Example:
        >>> question = find_question_by_any_book_id(db, "IPL5203-1051", 5, 2)
        >>> question = find_question_by_any_book_id(db, "1710-0141", 5, 2)  # ใช้รหัสเก่าก็ได้
    """
    return db.query(Question).filter(
        or_(
            Question.book_id == book_id,
            Question.old_book_id == book_id
        ),
        Question.page == page,
        Question.question_no == question_no
    ).first()


# ==================== ตัวอย่างการใช้งาน ====================

def example_usage_1(db: Session):
    """ค้นหาด้วยรหัสใหม่"""
    question = find_question_by_any_book_id(
        db=db,
        book_id="IPL5203-1051",  # รหัสใหม่
        page=5,
        question_no=2
    )
    
    if question:
        print(f"✅ พบโจทย์: {question.book_id} (เก่า: {question.old_book_id})")
        print(f"   หน้า {question.page} ข้อ {question.question_no}")
    else:
        print("❌ ไม่พบโจทย์")


def example_usage_2(db: Session):
    """ค้นหาด้วยรหัสเก่า"""
    question = find_question_by_any_book_id(
        db=db,
        book_id="1710-0141",  # รหัสเก่า
        page=5,
        question_no=2
    )
    
    if question:
        print(f"✅ พบโจทย์: {question.book_id} (เก่า: {question.old_book_id})")
        print(f"   หน้า {question.page} ข้อ {question.question_no}")
    else:
        print("❌ ไม่พบโจทย์")


def example_usage_3(db: Session):
    """ใช้ในหลาย endpoints"""
    # สามารถใช้ฟังก์ชันเดียวกันในหลาย endpoints
    
    # Endpoint 1: ค้นหาโจทย์และเฉลย
    question = find_question_by_any_book_id(db, "IPL5203-1051", 5, 2)
    if question:
        # ดึงเฉลยที่เชื่อมโยง
        solutions = question.solutions
        print(f"พบ {len(solutions)} เฉลย")
    
    # Endpoint 2: ลบโจทย์
    question = find_question_by_any_book_id(db, "1710-0141", 5, 2)
    if question:
        db.delete(question)
        db.commit()
        print("ลบโจทย์สำเร็จ")
    
    # Endpoint 3: อัปเดตโจทย์
    question = find_question_by_any_book_id(db, "IPL5203-1051", 5, 2)
    if question:
        question.question_text = "โจทย์ใหม่"
        db.commit()
        print("อัปเดตโจทย์สำเร็จ")


# ==================== Unit Tests ====================

def test_find_with_new_book_id():
    """Test: ค้นหาด้วยรหัสใหม่"""
    # Arrange
    from database import SessionLocal
    db = SessionLocal()
    
    # Act
    question = find_question_by_any_book_id(db, "IPL5203-1051", 5, 2)
    
    # Assert
    assert question is not None
    assert question.book_id == "IPL5203-1051"
    print("✅ Test passed: find_with_new_book_id")
    
    db.close()


def test_find_with_old_book_id():
    """Test: ค้นหาด้วยรหัสเก่า"""
    # Arrange
    from database import SessionLocal
    db = SessionLocal()
    
    # Act
    question = find_question_by_any_book_id(db, "1710-0141", 5, 2)
    
    # Assert
    assert question is not None
    assert question.old_book_id == "1710-0141"
    print("✅ Test passed: find_with_old_book_id")
    
    db.close()


def test_find_not_found():
    """Test: ไม่พบโจทย์"""
    # Arrange
    from database import SessionLocal
    db = SessionLocal()
    
    # Act
    question = find_question_by_any_book_id(db, "XXX-YYY", 999, 999)
    
    # Assert
    assert question is None
    print("✅ Test passed: find_not_found")
    
    db.close()


# ==================== SQL Query ที่เกิดขึ้น ====================
"""
SELECT * FROM questions
WHERE (
    book_id = 'IPL5203-1051' OR 
    old_book_id = 'IPL5203-1051'
)
AND page = 5
AND question_no = 2
LIMIT 1;
"""

# ==================== Performance Considerations ====================
"""
1. ใช้ OR condition - MySQL จะใช้ index scan
2. ใช้ .first() - จะหยุดทันทีที่เจอ record แรก
3. ไม่ใช้ joinedload - เพื่อความเร็วในการค้นหาเบื้องต้น
4. สามารถเพิ่ม index ที่ (book_id, old_book_id, page, question_no) เพื่อเพิ่มความเร็ว
"""

# ==================== การใช้งานใน FastAPI ====================
"""
from routes.solutions import find_question_by_any_book_id

@router.get("/questions/search")
async def search_question(
    book_id: str,
    page: int,
    question_no: int,
    db: Session = Depends(get_db)
):
    question = find_question_by_any_book_id(db, book_id, page, question_no)
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    return question
"""
