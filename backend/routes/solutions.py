from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from database import get_db
from models import Solution, Question
import os
import uuid
from pathlib import Path

router = APIRouter()

# Pydantic schemas
class SolutionCreate(BaseModel):
    question_id: int
    answer_text: Optional[str] = None
    answer_img: Optional[str] = None

class SolutionResponse(BaseModel):
    id: int
    question_id: int
    answer_text: Optional[str] = None
    answer_img: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class QuestionWithSolution(BaseModel):
    question: dict
    solution: dict = None

@router.post("/solutions", response_model=SolutionResponse)
async def create_solution(
    question_id: int = Form(...),
    answer_text: str = Form(""),
    answer_img: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    """เพิ่มเฉลยใหม่ (รองรับการอัปโหลดรูปภาพ)"""
    # ตรวจสอบว่าโจทย์มีอยู่จริง
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    # จัดการการอัปโหลดรูปภาพ
    image_filename = None
    if answer_img and answer_img.filename:
        # ตรวจสอบประเภทไฟล์
        allowed_extensions = {'.jpg', '.jpeg', '.png', '.gif'}
        file_extension = Path(answer_img.filename).suffix.lower()
        
        if file_extension not in allowed_extensions:
            raise HTTPException(status_code=400, detail="ประเภทไฟล์ไม่รองรับ กรุณาใช้ JPG, PNG หรือ GIF")
        
        # สร้างชื่อไฟล์ที่ไม่ซ้ำ
        image_filename = f"{uuid.uuid4()}{file_extension}"
        upload_path = Path("backend/uploads") / image_filename
        
        # สร้างโฟลเดอร์ถ้าไม่มี
        upload_path.parent.mkdir(parents=True, exist_ok=True)
        
        # ตรวจสอบขนาดไฟล์ (จำกัดที่ 5MB)
        max_size = 5 * 1024 * 1024  # 5MB
        contents = await answer_img.read()
        if len(contents) > max_size:
            raise HTTPException(status_code=400, detail="ไฟล์มีขนาดใหญ่เกินไป (จำกัดที่ 5MB)")
        
        # บันทึกไฟล์
        try:
            with open(upload_path, "wb") as f:
                f.write(contents)
            # เก็บ path สัมพัทธ์สำหรับเก็บในฐานข้อมูล
            image_filename = f"uploads/{image_filename}"
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"ไม่สามารถบันทึกไฟล์ได้: {str(e)}")
    
    db_solution = Solution(
        question_id=question_id,
        answer_text=answer_text if answer_text else None,
        answer_img=image_filename
    )
    db.add(db_solution)
    db.commit()
    db.refresh(db_solution)
    return db_solution

@router.get("/solutions", response_model=List[SolutionResponse])
async def get_all_solutions(db: Session = Depends(get_db)):
    """ดูเฉลยทั้งหมด"""
    solutions = db.query(Solution).all()
    return solutions

@router.get("/solutions/{question_id}", response_model=List[SolutionResponse])
async def get_solutions_by_question(question_id: int, db: Session = Depends(get_db)):
    """ดูเฉลยของโจทย์"""
    solutions = db.query(Solution).filter(Solution.question_id == question_id).all()
    return solutions

@router.put("/solutions/{solution_id}", response_model=SolutionResponse)
async def update_solution(
    solution_id: int,
    question_id: int = Form(...),
    answer_text: str = Form(""),
    answer_img: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    """อัพเดทเฉลย"""
    # หาเฉลยที่ต้องการอัพเดท
    solution = db.query(Solution).filter(Solution.id == solution_id).first()
    if not solution:
        raise HTTPException(status_code=404, detail="Solution not found")
    
    # ตรวจสอบว่าโจทย์มีอยู่จริง
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    # จัดการการอัปโหลดรูปภาพใหม่
    image_filename = solution.answer_img  # เก็บรูปเก่าไว้ก่อน
    if answer_img and answer_img.filename:
        # ลบรูปเก่า (ถ้ามี)
        if solution.answer_img:
            old_image_path = Path("uploads") / solution.answer_img.replace("uploads/", "")
            if old_image_path.exists():
                old_image_path.unlink()
        
        # ตรวจสอบประเภทไฟล์
        allowed_extensions = {'.jpg', '.jpeg', '.png', '.gif'}
        file_extension = Path(answer_img.filename).suffix.lower()
        if file_extension not in allowed_extensions:
            raise HTTPException(status_code=400, detail="Invalid file type. Only JPG, PNG, GIF allowed.")
        
        # สร้างชื่อไฟล์ใหม่
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = Path("uploads") / unique_filename
        
        # สร้างโฟลเดอร์ถ้าไม่มี
        file_path.parent.mkdir(exist_ok=True)
        
        # บันทึกไฟล์
        with open(file_path, "wb") as buffer:
            content = await answer_img.read()
            buffer.write(content)
        
        image_filename = f"uploads/{unique_filename}"
    
    # อัพเดทข้อมูลในฐานข้อมูล
    solution.question_id = question_id
    solution.answer_text = answer_text if answer_text.strip() else None
    solution.answer_img = image_filename
    
    db.commit()
    db.refresh(solution)
    return solution

@router.delete("/solutions/{solution_id}")
async def delete_solution(solution_id: int, db: Session = Depends(get_db)):
    """ลบเฉลย"""
    solution = db.query(Solution).filter(Solution.id == solution_id).first()
    if not solution:
        raise HTTPException(status_code=404, detail="Solution not found")
    
    # ลบรูปภาพ (ถ้ามี)
    if solution.answer_img:
        image_path = Path("uploads") / solution.answer_img.replace("uploads/", "")
        if image_path.exists():
            image_path.unlink()
    
    # ลบจากฐานข้อมูล
    db.delete(solution)
    db.commit()
    
    return {"message": "Solution deleted successfully"}

@router.get("/qa/{book_id}/{page}/{question_no}")
async def get_question_with_solution(book_id: str, page: int, question_no: int, db: Session = Depends(get_db)):
    """แสดงโจทย์ + เฉลยคู่กัน"""
    # หาโจทย์
    question = db.query(Question).filter(
        Question.book_id == book_id,
        Question.page == page,
        Question.question_no == question_no
    ).first()
    
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    # หาเฉลย (ล่าสุด)
    solution = db.query(Solution).filter(Solution.question_id == question.id).order_by(Solution.id.desc()).first()
    
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
        "solution": {
            "id": solution.id if solution else None,
            "answer_text": solution.answer_text if solution else None,
            "answer_img": solution.answer_img if solution else None,
            "created_at": solution.created_at.isoformat() if solution and solution.created_at else None
        } if solution else None
    }