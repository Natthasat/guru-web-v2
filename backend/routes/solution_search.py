from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from typing import List, Optional
from pydantic import BaseModel
from database import get_db
from models import Solution, SolutionImage
import traceback

router = APIRouter()

# Response Models
class SolutionImageResponse(BaseModel):
    id: int
    image_path: str
    image_order: int
    
    class Config:
        from_attributes = True

class SolutionSearchResult(BaseModel):
    id: int
    title: Optional[str]
    answer_text: Optional[str]
    teacher_name: Optional[str]
    question_id: int
    usage_count: int  # จำนวนครั้งที่เฉลยนี้ถูกใช้ (ในที่นี้คือ 1 เสมอเพราะ 1:1)
    images: List[SolutionImageResponse]
    
    class Config:
        from_attributes = True

class PaginatedSolutionsResponse(BaseModel):
    solutions: List[SolutionSearchResult]
    total: int
    page: int
    limit: int
    total_pages: int

@router.get("/solutions/list")
async def list_all_solutions(
    page: int = Query(1, ge=1, description="หน้าที่ต้องการ"),
    limit: int = Query(10, ge=1, le=100, description="จำนวนรายการต่อหน้า"),
    db: Session = Depends(get_db)
):
    """
    ดึงรายการเฉลยทั้งหมดพร้อม pagination
    - ใช้สำหรับแสดงเฉลยที่มีในระบบทั้งหมด
    - เรียงตาม ID ล่าสุด
    """
    
    # นับจำนวนเฉลยทั้งหมด
    total = db.query(Solution).filter(
        Solution.answer_text.isnot(None),
        Solution.answer_text != ''
    ).count()
    
    # ดึงเฉลยตาม pagination พร้อม eager load images
    skip = (page - 1) * limit
    solutions = db.query(Solution).options(
        joinedload(Solution.images)
    ).filter(
        Solution.answer_text.isnot(None),
        Solution.answer_text != ''
    ).order_by(Solution.id.desc()).offset(skip).limit(limit).all()
    
    # สร้าง response แบบ dict ธรรมดา
    results = []
    try:
        for solution in solutions:
            images_list = [
                {
                    'id': img.id,
                    'image_path': img.image_path,
                    'image_order': img.image_order
                } for img in solution.images
            ]
            
            results.append({
                'id': solution.id,
                'title': solution.title,
                'answer_text': solution.answer_text,
                'teacher_name': solution.teacher_name,
                'question_id': solution.question_id,
                'usage_count': 1,
                'images': images_list
            })
    except Exception as e:
        print(f"Error processing solutions: {e}")
        traceback.print_exc()
        raise
    
    return {
        'solutions': results,
        'total': total,
        'page': page,
        'limit': limit,
        'total_pages': (total + limit - 1) // limit
    }

@router.get("/solutions/search", response_model=List[SolutionSearchResult])
async def search_solutions_by_text(
    answer_text: str = Query(..., min_length=3, description="คำค้นหาในคำอธิบายเฉลย (ขั้นต่ำ 3 ตัวอักษร)"),
    limit: int = Query(20, ge=1, le=100, description="จำนวนผลลัพธ์สูงสุด"),
    db: Session = Depends(get_db)
):
    """
    ค้นหาเฉลยที่มีคำอธิบายตรงกับคำค้นหา
    - ใช้สำหรับค้นหาเฉลยที่มีอยู่แล้วในระบบเพื่อนำมาใช้ซ้ำ
    - ค้นหาแบบ case-insensitive และ partial match
    """
    
    # ค้นหาเฉลยที่มี answer_text ตรงกับคำค้นหา
    solutions = db.query(Solution).filter(
        Solution.answer_text.isnot(None),
        Solution.answer_text != '',
        func.lower(Solution.answer_text).contains(func.lower(answer_text))
    ).limit(limit).all()
    
    # สร้าง response พร้อมนับจำนวนการใช้งาน
    results = []
    for solution in solutions:
        results.append({
            'id': solution.id,
            'title': solution.title,
            'answer_text': solution.answer_text,
            'teacher_name': solution.teacher_name,
            'question_id': solution.question_id,
            'usage_count': 1,  # ในระบบปัจจุบัน 1 solution = 1 question
            'images': solution.images
        })
    
    return results

@router.get("/solutions/{solution_id}/details")
async def get_solution_details(
    solution_id: int,
    db: Session = Depends(get_db)
):
    """
    ดึงรายละเอียดเฉลยพร้อมรูปภาพทั้งหมด
    - ใช้สำหรับแสดงตัวอย่างเฉลยก่อนคัดลอก
    """
    solution = db.query(Solution).filter(Solution.id == solution_id).first()
    
    if not solution:
        return {"error": "ไม่พบเฉลยที่ระบุ"}
    
    return {
        'id': solution.id,
        'title': solution.title,
        'answer_text': solution.answer_text,
        'teacher_name': solution.teacher_name,
        'question_id': solution.question_id,
        'images': [
            {
                'id': img.id,
                'image_path': img.image_path,
                'image_order': img.image_order
            } for img in solution.images
        ]
    }
