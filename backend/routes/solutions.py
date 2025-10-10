from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from database import get_db
from models import Solution, SolutionImage, Question
from status_helper import update_question_status
import os
import uuid
from pathlib import Path

router = APIRouter()

# ==================== Helper Functions ====================

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

# Pydantic schemas
class SolutionImageResponse(BaseModel):
    id: int
    image_path: str
    image_order: int
    
    class Config:
        from_attributes = True

class SolutionResponse(BaseModel):
    id: int
    question_id: int
    title: Optional[str] = None
    teacher_name: Optional[str] = None
    answer_text: Optional[str] = None
    created_at: datetime
    images: List[SolutionImageResponse] = []
    
    class Config:
        from_attributes = True

# ==================== Solution CRUD ====================

@router.post("/questions/{question_id}/solutions")
async def create_solution_for_question(
    question_id: int,
    title: str = Form(None),
    teacher_name: str = Form(None),
    answer_text: str = Form(""),
    db: Session = Depends(get_db)
):
    """
    สร้างเฉลยใหม่สำหรับโจทย์ (One-to-Many: 1 โจทย์มีหลายเฉลย)
    """
    # ตรวจสอบว่าโจทย์มีอยู่จริง
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    # สร้างเฉลยใหม่ผูกกับโจทย์
    new_solution = Solution(
        question_id=question_id,
        title=title if title else None,
        teacher_name=teacher_name if teacher_name and teacher_name.strip() else None,
        answer_text=answer_text if answer_text.strip() else None
    )
    db.add(new_solution)
    db.commit()
    db.refresh(new_solution)
    
    # อัพเดทสถานะโจทย์
    update_question_status(db, question_id)
    
    return {
        "id": new_solution.id,
        "question_id": new_solution.question_id,
        "title": new_solution.title,
        "answer_text": new_solution.answer_text,
        "created_at": new_solution.created_at.isoformat() if new_solution.created_at else None,
        "images": []
    }

@router.post("/solutions/{solution_id}/images")
async def upload_solution_images(
    solution_id: int,
    images: List[UploadFile] = File(default=[]),
    copied_image_paths: List[str] = Form(default=[]),
    page: int = Form(None),
    question_no: int = Form(None),
    solution_index: int = Form(None),
    db: Session = Depends(get_db)
):
    """
    อัปโหลดรูปภาพให้กับเฉลย (รองรับหลายรูป)
    รูปแบบชื่อไฟล์: {book_id}_{page}_{question_no}_Answer{solution_index}_{image_counter}.ext
    """
    # ตรวจสอบว่าเฉลยมีอยู่จริงและดึงข้อมูลโจทย์มาด้วย
    solution = db.query(Solution).filter(Solution.id == solution_id).first()
    if not solution:
        raise HTTPException(status_code=404, detail="Solution not found")
    
    # ดึงข้อมูลโจทย์เพื่อใช้ book_id และ question_no
    question = db.query(Question).filter(Question.id == solution.question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    # ใช้ page, question_no และ solution_index ที่ส่งมาจาก frontend
    # ถ้าไม่ได้ส่งมา ให้ fallback ไปใช้ค่าจาก database
    if page is None:
        page = question.page
    
    if question_no is None:
        question_no = question.question_no
    
    if solution_index is None:
        # Query เฉลยทั้งหมดของโจทย์นี้เพื่อหาลำดับ (fallback)
        db.commit()
        db.refresh(solution)
        db.refresh(question)
        all_solutions = db.query(Solution).filter(
            Solution.question_id == question.id
        ).order_by(Solution.id).all()
        solution_index = next((i + 1 for i, s in enumerate(all_solutions) if s.id == solution_id), 1)
    
    print(f"📊 Debug: Book ID={question.book_id}, Page={page}, Question No={question_no}, Solution Index={solution_index}")
    
    # นับจำนวนรูปที่มีอยู่แล้วในเฉลยนี้ (สำหรับ image_order)
    initial_image_count = db.query(SolutionImage).filter(
        SolutionImage.solution_id == solution_id
    ).count()
    
    uploaded_images = []
    # ใช้ path relative จาก backend/ directory
    uploads_dir = Path(__file__).parent.parent / "uploads"
    uploads_dir.mkdir(exist_ok=True)
    
    # ใช้ counter แยกสำหรับนับเลขรูป
    image_counter = 1
    
    # 1. Copy รูปภาพที่คัดลอกมา (ภายใน server)
    import shutil
    for copied_path in copied_image_paths:
        try:
            source_file = Path(__file__).parent.parent / copied_path
            if not source_file.exists():
                print(f"⚠️  ไฟล์ต้นฉบับไม่พบ: {copied_path}")
                continue
            
            # สร้างชื่อไฟล์ใหม่สำหรับรูปที่ copy
            file_extension = source_file.suffix
            safe_book_id = question.book_id.replace('/', '-').replace('\\', '-').replace(':', '-')
            file_uuid = str(uuid.uuid4())[:8]
            unique_filename = f"{safe_book_id}_{page}_{question_no}_Answer{solution_index}_{image_counter}_{file_uuid}{file_extension}"
            dest_file = uploads_dir / unique_filename
            
            # Copy file
            shutil.copy2(source_file, dest_file)
            print(f"📋 Copied: {copied_path} -> {unique_filename}")
            
            # บันทึกลง database
            solution_image = SolutionImage(
                solution_id=solution_id,
                image_path=f"uploads/{unique_filename}",
                image_order=initial_image_count + image_counter
            )
            db.add(solution_image)
            uploaded_images.append(solution_image)
            image_counter += 1
            
        except Exception as e:
            print(f"❌ Error copying image {copied_path}: {e}")
            continue
    
    # 2. อัปโหลดรูปใหม่ที่ user เลือก
    
    for idx, image in enumerate(images):
        if not image.filename:
            continue
            
        # ตรวจสอบประเภทไฟล์
        allowed_extensions = {'.jpg', '.jpeg', '.png', '.gif'}
        file_extension = Path(image.filename).suffix.lower()
        if file_extension not in allowed_extensions:
            raise HTTPException(
                status_code=400, 
                detail=f"Invalid file type: {image.filename}. Only JPG, PNG, GIF allowed."
            )
        
        # สร้างชื่อไฟล์แบบใหม่: {book_id}_{page}_{question_no}_Answer{solution_index}_{image_counter}_{uuid}.ext
        # เพิ่ม UUID เพื่อป้องกันชื่อไฟล์ซ้ำ
        safe_book_id = question.book_id.replace('/', '-').replace('\\', '-').replace(':', '-')
        file_uuid = str(uuid.uuid4())[:8]  # ใช้ 8 ตัวอักษรแรกของ UUID
        unique_filename = f"{safe_book_id}_{page}_{question_no}_Answer{solution_index}_{image_counter}_{file_uuid}{file_extension}"
        file_path = uploads_dir / unique_filename
        
        print(f"📸 Saving: {unique_filename} (หน้า {page}, ข้อ {question_no}, เฉลย {solution_index}, รูป {image_counter}, UUID: {file_uuid})")
        
        # บันทึกไฟล์
        try:
            with open(file_path, "wb") as buffer:
                content = await image.read()
                buffer.write(content)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")
        
        # เพิ่มข้อมูลรูปภาพลงฐานข้อมูล
        solution_image = SolutionImage(
            solution_id=solution_id,
            image_path=f"uploads/{unique_filename}",
            image_order=initial_image_count + idx
        )
        db.add(solution_image)
        uploaded_images.append({
            "filename": unique_filename,
            "path": f"uploads/{unique_filename}",
            "order": initial_image_count + idx
        })
        
        # เพิ่ม counter สำหรับรูปถัดไป
        image_counter += 1
    
    db.commit()
    
    # อัพเดทสถานะโจทย์หลังอัปโหลดรูป
    update_question_status(db, solution.question_id)
    
    return {
        "message": f"Uploaded {len(uploaded_images)} image(s) successfully",
        "images": uploaded_images
    }

@router.get("/solutions")
async def get_all_solutions(db: Session = Depends(get_db)):
    """
    ดูเฉลยทั้งหมด (พร้อมรูปภาพและข้อมูลโจทย์)
    """
    solutions = db.query(Solution).options(
        joinedload(Solution.images),
        joinedload(Solution.question)
    ).all()
    
    result = []
    for solution in solutions:
        result.append({
            "id": solution.id,
            "question_id": solution.question_id,
            "title": solution.title,
            "teacher_name": solution.teacher_name,
            "answer_text": solution.answer_text,
            "created_at": solution.created_at.isoformat() if solution.created_at else None,
            "question": {
                "id": solution.question.id,
                "book_id": solution.question.book_id,
                "page": solution.question.page,
                "question_no": solution.question.question_no,
            } if solution.question else None,
            "images": [
                {
                    "id": img.id,
                    "image_path": img.image_path,
                    "image_order": img.image_order
                }
                for img in solution.images
            ]
        })
    
    return result

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
    from sqlalchemy.orm import joinedload
    
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
    
    # สร้าง response
    results = []
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
    
    return {
        'solutions': results,
        'total': total,
        'page': page,
        'limit': limit,
        'total_pages': (total + limit - 1) // limit
    }

@router.get("/solutions/{solution_id}")
async def get_solution_by_id(solution_id: int, db: Session = Depends(get_db)):
    """
    ดูเฉลยตาม ID (พร้อมรูปภาพ)
    """
    solution = db.query(Solution).options(joinedload(Solution.images)).filter(
        Solution.id == solution_id
    ).first()
    
    if not solution:
        raise HTTPException(status_code=404, detail="Solution not found")
    
    return {
        "id": solution.id,
        "question_id": solution.question_id,
        "title": solution.title,
        "teacher_name": solution.teacher_name,
        "answer_text": solution.answer_text,
        "created_at": solution.created_at.isoformat() if solution.created_at else None,
        "images": [
            {
                "id": img.id,
                "image_path": img.image_path,
                "image_order": img.image_order
            }
            for img in solution.images
        ]
    }

@router.put("/solutions/{solution_id}")
async def update_solution(
    solution_id: int,
    title: str = Form(None),
    teacher_name: str = Form(None),
    answer_text: str = Form(""),
    db: Session = Depends(get_db)
):
    """
    แก้ไขเฉลย
    """
    solution = db.query(Solution).filter(Solution.id == solution_id).first()
    if not solution:
        raise HTTPException(status_code=404, detail="Solution not found")
    
    solution.title = title if title else None
    solution.teacher_name = teacher_name if teacher_name and teacher_name.strip() else None
    solution.answer_text = answer_text if answer_text.strip() else None
    
    db.commit()
    db.refresh(solution)
    
    # โหลดรูปภาพด้วย
    solution = db.query(Solution).options(joinedload(Solution.images)).filter(
        Solution.id == solution_id
    ).first()
    
    return {
        "id": solution.id,
        "question_id": solution.question_id,
        "title": solution.title,
        "teacher_name": solution.teacher_name,
        "answer_text": solution.answer_text,
        "created_at": solution.created_at.isoformat() if solution.created_at else None,
        "images": [
            {
                "id": img.id,
                "image_path": img.image_path,
                "image_order": img.image_order
            }
            for img in solution.images
        ]
    }

@router.delete("/solutions/{solution_id}")
async def delete_solution(solution_id: int, db: Session = Depends(get_db)):
    """
    ลบเฉลย (รูปภาพจะถูกลบอัตโนมัติด้วย CASCADE)
    """
    solution = db.query(Solution).filter(Solution.id == solution_id).first()
    if not solution:
        raise HTTPException(status_code=404, detail="Solution not found")
    
    # ลบไฟล์รูปภาพ
    for image in solution.images:
        # image.image_path = "uploads/xxx.png"
        image_path = Path(__file__).parent.parent / image.image_path
        if image_path.exists():
            image_path.unlink()
    
    db.delete(solution)
    db.commit()
    
    return {"message": "Solution deleted successfully"}

@router.delete("/solutions/{solution_id}/images/{image_id}")
async def delete_solution_image(
    solution_id: int, 
    image_id: int, 
    db: Session = Depends(get_db)
):
    """
    ลบรูปภาพเฉพาะรูป
    """
    image = db.query(SolutionImage).filter(
        SolutionImage.id == image_id,
        SolutionImage.solution_id == solution_id
    ).first()
    
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    
    # ลบไฟล์
    # image.image_path = "uploads/xxx.png"
    image_path = Path(__file__).parent.parent / image.image_path
    if image_path.exists():
        image_path.unlink()
    
    db.delete(image)
    db.commit()
    
    return {"message": "Image deleted successfully"}

# ==================== Query Solutions for Question ====================

@router.get("/questions/{question_id}/solutions")
async def get_solutions_for_question(question_id: int, db: Session = Depends(get_db)):
    """
    ดูเฉลยทั้งหมดของโจทย์ (One-to-Many)
    """
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    # ดึงเฉลยทั้งหมดที่เป็นของโจทย์นี้
    solutions = db.query(Solution).options(joinedload(Solution.images)).filter(
        Solution.question_id == question_id
    ).all()
    
    result = []
    for solution in solutions:
        result.append({
            "id": solution.id,
            "title": solution.title,
            "answer_text": solution.answer_text,
            "created_at": solution.created_at.isoformat() if solution.created_at else None,
            "images": [
                {
                    "id": img.id,
                    "image_path": img.image_path,
                    "image_order": img.image_order
                }
                for img in sorted(solution.images, key=lambda x: x.image_order)
            ]
        })
    
    return result

# ==================== Combined Query ====================

@router.get("/qa/{book_id}/{page}/{question_no}")
async def get_question_with_solutions(
    book_id: str, 
    page: int, 
    question_no: int, 
    db: Session = Depends(get_db)
):
    """
    แสดงโจทย์ + เฉลยทั้งหมด (One-to-Many)
    รองรับการค้นหาด้วยรหัสหนังสือแบบใหม่ (book_id) หรือแบบเก่า (old_book_id)
    """
    # หาโจทย์โดยใช้ reusable function
    question = find_question_by_any_book_id(db, book_id, page, question_no)
    
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    # ดึงเฉลยทั้งหมดของโจทย์นี้
    solutions = db.query(Solution).options(joinedload(Solution.images)).filter(
        Solution.question_id == question.id
    ).all()
    
    solution_list = []
    for solution in solutions:
        solution_list.append({
            "id": solution.id,
            "title": solution.title,
            "answer_text": solution.answer_text,
            "teacher_name": solution.teacher_name,
            "created_at": solution.created_at.isoformat() if solution.created_at else None,
            "images": [
                {
                    "id": img.id,
                    "image_path": img.image_path,
                    "image_order": img.image_order
                }
                for img in sorted(solution.images, key=lambda x: x.image_order)
            ]
        })
    
    return {
        "question": {
            "id": question.id,
            "book_id": question.book_id,
            "old_book_id": question.old_book_id,
            "page": question.page,
            "question_no": question.question_no,
            "question_text": question.question_text,
            "question_img": question.question_img,
            "created_at": question.created_at.isoformat() if question.created_at else None
        },
        "solutions": solution_list
    }
