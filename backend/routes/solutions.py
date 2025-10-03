from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from database import get_db
from models import Solution, SolutionImage, Question, QuestionSolution
import os
import uuid
from pathlib import Path

router = APIRouter()

# Pydantic schemas
class SolutionImageResponse(BaseModel):
    id: int
    image_path: str
    image_order: int
    
    class Config:
        from_attributes = True

class SolutionResponse(BaseModel):
    id: int
    title: Optional[str] = None
    answer_text: Optional[str] = None
    created_at: datetime
    images: List[SolutionImageResponse] = []
    
    class Config:
        from_attributes = True

class QuestionSolutionResponse(BaseModel):
    question_id: int
    solution_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

@router.post("/solutions", response_model=SolutionResponse)
async def create_solution(
    title: str = Form(None),
    answer_text: str = Form(""),
    db: Session = Depends(get_db)
):
    """
    สร้างเฉลยใหม่ (ไม่ผูกกับโจทย์)
    ใช้สำหรับสร้างเฉลยก่อน แล้วค่อยเชื่อมกับโจทย์ภายหลัง
    """
    new_solution = Solution(
        title=title if title else None,
        answer_text=answer_text if answer_text.strip() else None
    )
    db.add(new_solution)
    db.commit()
    db.refresh(new_solution)
    
    return new_solution

@router.post("/solutions/{solution_id}/images")
async def upload_solution_images(
    solution_id: int,
    images: List[UploadFile] = File(...),
    db: Session = Depends(get_db)
):
    """
    อัปโหลดรูปภาพให้กับเฉลย (รองรับหลายรูป)
    """
    # ตรวจสอบว่าเฉลยมีอยู่จริง
    solution = db.query(Solution).filter(Solution.id == solution_id).first()
    if not solution:
        raise HTTPException(status_code=404, detail="Solution not found")
    
    uploaded_images = []
    uploads_dir = Path("backend/uploads")
    uploads_dir.mkdir(exist_ok=True)
    
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
        
        # สร้างชื่อไฟล์ใหม่
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = uploads_dir / unique_filename
        
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
            image_order=idx
        )
        db.add(solution_image)
        uploaded_images.append({
            "filename": unique_filename,
            "path": f"uploads/{unique_filename}",
            "order": idx
        })
    
    db.commit()
    
    return {
        "message": f"Uploaded {len(uploaded_images)} image(s) successfully",
        "images": uploaded_images
    }

@router.get("/solutions", response_model=List[SolutionResponse])
async def get_all_solutions(db: Session = Depends(get_db)):
    """
    ดูเฉลยทั้งหมด (พร้อมรูปภาพ)
    """
    solutions = db.query(Solution).options(joinedload(Solution.images)).all()
    return solutions

@router.get("/solutions/{solution_id}", response_model=SolutionResponse)
async def get_solution_by_id(solution_id: int, db: Session = Depends(get_db)):
    """
    ดูเฉลยตาม ID (พร้อมรูปภาพ)
    """
    solution = db.query(Solution).options(joinedload(Solution.images)).filter(
        Solution.id == solution_id
    ).first()
    
    if not solution:
        raise HTTPException(status_code=404, detail="Solution not found")
    
    return solution

@router.put("/solutions/{solution_id}", response_model=SolutionResponse)
async def update_solution(
    solution_id: int,
    title: str = Form(None),
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
    solution.answer_text = answer_text if answer_text.strip() else None
    
    db.commit()
    db.refresh(solution)
    
    # โหลดรูปภาพด้วย
    solution = db.query(Solution).options(joinedload(Solution.images)).filter(
        Solution.id == solution_id
    ).first()
    
    return solution

@router.delete("/solutions/{solution_id}")
async def delete_solution(solution_id: int, db: Session = Depends(get_db)):
    """
    ลบเฉลย (รูปภาพและ mapping จะถูกลบอัตโนมัติด้วย CASCADE)
    """
    solution = db.query(Solution).filter(Solution.id == solution_id).first()
    if not solution:
        raise HTTPException(status_code=404, detail="Solution not found")
    
    # ลบไฟล์รูปภาพ
    for image in solution.images:
        image_path = Path("backend") / image.image_path
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
    image_path = Path("backend") / image.image_path
    if image_path.exists():
        image_path.unlink()
    
    db.delete(image)
    db.commit()
    
    return {"message": "Image deleted successfully"}

# ==================== Question-Solution Mapping ====================

@router.post("/questions/{question_id}/solutions/{solution_id}", response_model=QuestionSolutionResponse)
async def link_question_solution(
    question_id: int,
    solution_id: int,
    db: Session = Depends(get_db)
):
    """
    เชื่อมโจทย์กับเฉลย (Many-to-Many)
    """
    # ตรวจสอบว่าโจทย์และเฉลยมีอยู่จริง
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    solution = db.query(Solution).filter(Solution.id == solution_id).first()
    if not solution:
        raise HTTPException(status_code=404, detail="Solution not found")
    
    # ตรวจสอบว่ามีการเชื่อมแล้วหรือไม่
    existing = db.query(QuestionSolution).filter(
        QuestionSolution.question_id == question_id,
        QuestionSolution.solution_id == solution_id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="This question-solution link already exists")
    
    # สร้างการเชื่อม
    link = QuestionSolution(
        question_id=question_id,
        solution_id=solution_id
    )
    db.add(link)
    db.commit()
    db.refresh(link)
    
    return link

@router.delete("/questions/{question_id}/solutions/{solution_id}")
async def unlink_question_solution(
    question_id: int,
    solution_id: int,
    db: Session = Depends(get_db)
):
    """
    ยกเลิกการเชื่อมโจทย์กับเฉลย
    """
    link = db.query(QuestionSolution).filter(
        QuestionSolution.question_id == question_id,
        QuestionSolution.solution_id == solution_id
    ).first()
    
    if not link:
        raise HTTPException(status_code=404, detail="Link not found")
    
    db.delete(link)
    db.commit()
    
    return {"message": "Question-solution link removed successfully"}

@router.get("/questions/{question_id}/solutions")
async def get_solutions_for_question(question_id: int, db: Session = Depends(get_db)):
    """
    ดูเฉลยทั้งหมดของโจทย์
    """
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    # JOIN เพื่อดึงเฉลยและรูปภาพ
    links = db.query(QuestionSolution).filter(
        QuestionSolution.question_id == question_id
    ).all()
    
    solutions = []
    for link in links:
        solution = db.query(Solution).options(joinedload(Solution.images)).filter(
            Solution.id == link.solution_id
        ).first()
        if solution:
            solutions.append({
                "id": solution.id,
                "title": solution.title,
                "answer_text": solution.answer_text,
                "created_at": solution.created_at,
                "images": [
                    {
                        "id": img.id,
                        "image_path": img.image_path,
                        "image_order": img.image_order
                    }
                    for img in solution.images
                ]
            })
    
    return solutions

# ==================== Combined Query ====================

@router.get("/qa/{book_id}/{page}/{question_no}")
async def get_question_with_solutions(
    book_id: str, 
    page: int, 
    question_no: int, 
    db: Session = Depends(get_db)
):
    """
    แสดงโจทย์ + เฉลยทั้งหมด (JOIN question_solutions + solutions + solution_images)
    """
    # หาโจทย์
    question = db.query(Question).filter(
        Question.book_id == book_id,
        Question.page == page,
        Question.question_no == question_no
    ).first()
    
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    # JOIN เพื่อดึงเฉลยและรูปภาพทั้งหมด
    links = db.query(QuestionSolution).filter(
        QuestionSolution.question_id == question.id
    ).all()
    
    solutions = []
    for link in links:
        solution = db.query(Solution).options(joinedload(Solution.images)).filter(
            Solution.id == link.solution_id
        ).first()
        if solution:
            solutions.append({
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
    
    return {
        "question": {
            "id": question.id,
            "book_id": question.book_id,
            "page": question.page,
            "question_no": question.question_no,
            "question_text": question.question_text,
            "question_img": question.question_img,
            "created_at": question.created_at.isoformat() if question.created_at else None
        },
        "solutions": solutions
    }
