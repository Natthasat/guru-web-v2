"""
Helper functions สำหรับจัดการสถานะของโจทย์
"""
from sqlalchemy.orm import Session
from models import Question, Solution, SolutionImage

def calculate_question_status(db: Session, question_id: int) -> str:
    """
    คำนวณสถานะของโจทย์ตามเงื่อนไข:
    - ขาดเฉลย: ไม่มีเฉลยเลย
    - ขาดรูปวิธีทำ: มีเฉลยแต่ไม่มีรูปภาพเฉลยเลย
    - ครบแล้ว: มีเฉลยและมีรูปภาพเฉลยอย่างน้อย 1 รูป
    """
    # ตรวจสอบว่ามีเฉลยหรือไม่
    solutions = db.query(Solution).filter(Solution.question_id == question_id).all()
    
    if not solutions:
        return 'ขาดเฉลย'
    
    # ตรวจสอบว่ามีรูปภาพเฉลยหรือไม่
    has_image = False
    for solution in solutions:
        images = db.query(SolutionImage).filter(SolutionImage.solution_id == solution.id).first()
        if images:
            has_image = True
            break
    
    if has_image:
        return 'ครบแล้ว'
    else:
        return 'ขาดรูปวิธีทำ'

def update_question_status(db: Session, question_id: int):
    """
    อัพเดทสถานะของโจทย์
    """
    new_status = calculate_question_status(db, question_id)
    question = db.query(Question).filter(Question.id == question_id).first()
    
    if question and question.status != new_status:
        question.status = new_status
        db.commit()
        db.refresh(question)
        print(f"✅ อัพเดทสถานะโจทย์ ID {question_id}: {new_status}")
    
    return new_status

def get_status_badge_info(status: str) -> dict:
    """
    คืนค่าข้อมูลสำหรับแสดง badge ของสถานะ
    """
    status_map = {
        'ขาดเฉลย': {
            'color': 'red',
            'bg': 'bg-red-500',
            'text': 'text-white',
            'icon': '❌'
        },
        'ขาดรูปวิธีทำ': {
            'color': 'orange',
            'bg': 'bg-orange-500',
            'text': 'text-white',
            'icon': '⚠️'
        },
        'ครบแล้ว': {
            'color': 'green',
            'bg': 'bg-green-500',
            'text': 'text-white',
            'icon': '✅'
        }
    }
    
    return status_map.get(status, status_map['ขาดเฉลย'])
