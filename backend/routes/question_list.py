from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session, joinedload
from typing import Optional, List
from database import get_db
from models import Question, QuestionMetadata, Solution, SolutionImage
from pydantic import BaseModel
from datetime import datetime
from excel_dropdown_service import get_dropdown_options_from_excel

router = APIRouter()

class QuestionListItem(BaseModel):
    id: int
    book_id: str
    old_book_id: Optional[str]
    page: int
    question_no: int
    question_img: Optional[str]
    created_at: datetime
    updated_at: Optional[datetime]
    updated_by: Optional[str]
    
    # Metadata
    teacher_name: Optional[str]
    subject: Optional[str]
    class_level: Optional[str]
    course_type_name: Optional[str]
    content_level_name: Optional[str]
    file_type_name: Optional[str]
    year: Optional[str]
    
    # Status
    status: str
    solution_count: int
    image_count: int
    
    class Config:
        from_attributes = True

class FilterOptions(BaseModel):
    class_levels: List[str]
    subjects: List[str]
    teachers: List[str]
    content_levels: List[str]
    course_types: List[str]
    file_types: List[str]
    years: List[str]
    statuses: List[dict]

@router.get("/questions/list")
async def get_questions_list(
    # Filters
    class_level: Optional[str] = Query(None),
    subject: Optional[str] = Query(None),
    teacher: Optional[str] = Query(None),
    content_level: Optional[str] = Query(None),
    course_type: Optional[str] = Query(None),
    file_type: Optional[str] = Query(None),
    year: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    book_id: Optional[str] = Query(None),
    old_book_id: Optional[str] = Query(None),
    page: Optional[int] = Query(None),
    question_no: Optional[int] = Query(None),
    updated_by: Optional[str] = Query(None),
    
    # Sorting
    sort_by: str = Query("updated_at", regex="^(updated_at|created_at|book_id|page|question_no|status|updated_by)$"),
    sort_order: str = Query("desc", regex="^(asc|desc)$"),
    
    # Pagination
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    
    db: Session = Depends(get_db)
):
    """
    Get filtered and paginated list of questions with metadata
    """
    
    # Base query with eager loading
    query = db.query(Question).join(QuestionMetadata, Question.id == QuestionMetadata.question_id, isouter=True)
    
    # Apply filters
    if class_level:
        query = query.filter(QuestionMetadata.class_level == class_level)
    if subject:
        query = query.filter(QuestionMetadata.subject == subject)
    if teacher:
        query = query.filter(QuestionMetadata.teacher_name == teacher)
    if content_level:
        query = query.filter(QuestionMetadata.content_level_name == content_level)
    if course_type:
        query = query.filter(QuestionMetadata.course_type_name == course_type)
    if file_type:
        query = query.filter(QuestionMetadata.file_type_name == file_type)
    if year:
        query = query.filter(QuestionMetadata.year == year)
    if status:
        query = query.filter(Question.status == status)
    if book_id:
        query = query.filter(Question.book_id.like(f"%{book_id}%"))
    if old_book_id:
        query = query.filter(Question.old_book_id.like(f"%{old_book_id}%"))
    if page is not None:
        query = query.filter(Question.page == page)
    if question_no is not None:
        query = query.filter(Question.question_no == question_no)
    if updated_by:
        query = query.filter(Question.updated_by == updated_by)
    
    # Apply sorting
    if sort_by == "updated_at":
        query = query.order_by(Question.updated_at.desc() if sort_order == "desc" else Question.updated_at.asc())
    elif sort_by == "created_at":
        query = query.order_by(Question.created_at.desc() if sort_order == "desc" else Question.created_at.asc())
    elif sort_by == "book_id":
        query = query.order_by(Question.book_id.desc() if sort_order == "desc" else Question.book_id.asc())
    elif sort_by == "page":
        query = query.order_by(Question.page.desc() if sort_order == "desc" else Question.page.asc())
    elif sort_by == "question_no":
        query = query.order_by(Question.question_no.desc() if sort_order == "desc" else Question.question_no.asc())
    elif sort_by == "status":
        # Sort by custom status order: ขาดรูปวิธีทำ -> ขาดเฉลย -> ครบแล้ว
        from sqlalchemy import case
        status_order = case(
            (Question.status == 'ขาดรูปวิธีทำ', 1),
            (Question.status == 'ขาดเฉลย', 2),
            (Question.status == 'ครบแล้ว', 3),
            else_=4
        )
        if sort_order == "asc":
            query = query.order_by(status_order.asc())
        else:
            query = query.order_by(status_order.desc())
    elif sort_by == "updated_by":
        # Sort with NULL values last, then A-Z English, then Thai ก-ฮ
        if sort_order == "asc":
            query = query.order_by(Question.updated_by.is_(None), Question.updated_by.asc())
        else:
            query = query.order_by(Question.updated_by.is_(None), Question.updated_by.desc())
    
    # Get total count
    total = query.count()
    
    # Apply pagination
    questions = query.offset(skip).limit(limit).all()
    
    # Format results
    results = []
    for q in questions:
        metadata = q.decoded_data
        
        # Count solutions and images
        solution_count = len(q.solutions)
        image_count = sum(len(sol.images) for sol in q.solutions)
        
        results.append({
            "id": q.id,
            "book_id": q.book_id,
            "old_book_id": q.old_book_id,
            "page": q.page,
            "question_no": q.question_no,
            "question_img": q.question_img,
            "created_at": q.created_at,
            "updated_at": q.updated_at,
            "updated_by": q.updated_by,
            
            "teacher_name": metadata.teacher_name if metadata else None,
            "subject": metadata.subject if metadata else None,
            "class_level": metadata.class_level if metadata else None,
            "course_type_name": metadata.course_type_name if metadata else None,
            "content_level_name": metadata.content_level_name if metadata else None,
            "file_type_name": metadata.file_type_name if metadata else None,
            "year": metadata.year if metadata else None,
            
            "status": q.status if hasattr(q, 'status') else "ขาดเฉลย",
            "solution_count": solution_count,
            "image_count": image_count
        })
    
    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "questions": results
    }

@router.get("/questions/filter-options")
async def get_filter_options(db: Session = Depends(get_db)):
    """
    Get all available filter options from Excel reference file
    """
    
    # อ่านข้อมูลจาก Excel
    excel_options = get_dropdown_options_from_excel()
    
    # Status options - ใช้ค่าภาษาไทยตรงกับฐานข้อมูล
    statuses = [
        {"value": "ขาดเฉลย", "label": "ขาดเฉลย", "color": "red"},
        {"value": "ขาดรูปวิธีทำ", "label": "ขาดรูปวิธีทำ", "color": "orange"},
        {"value": "ครบแล้ว", "label": "ครบแล้ว", "color": "green"}
    ]
    
    return {
        "class_levels": excel_options["class_levels"],
        "subjects": excel_options["subjects"],
        "teachers": excel_options["teachers"],
        "content_levels": excel_options["content_levels"],
        "course_types": excel_options["course_types"],
        "file_types": excel_options["file_types"],
        "years": excel_options["years"],
        "statuses": statuses
    }
