from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from database import get_db
from models import Question
import os
import uuid
from pathlib import Path

router = APIRouter()

# Pydantic schemas
class QuestionCreate(BaseModel):
    book_id: str
    page: int
    question_no: int
    question_text: Optional[str] = None
    question_img: Optional[str] = None

class SolutionBasic(BaseModel):
    id: int
    title: Optional[str] = None
    
    class Config:
        from_attributes = True

class QuestionResponse(BaseModel):
    id: int
    book_id: str
    page: int
    question_no: int
    question_text: Optional[str] = None
    question_img: Optional[str] = None
    created_at: datetime
    solutions: List[SolutionBasic] = []
    
    class Config:
        from_attributes = True

@router.post("/questions", response_model=QuestionResponse)
async def create_question(
    book_id: str = Form(...),
    page: int = Form(...),
    question_no: int = Form(...),
    question_text: str = Form(""),
    question_img: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    """เพิ่มโจทย์ใหม่ (รองรับการอัปโหลดรูปภาพ)"""
    
    # จัดการการอัปโหลดรูปภาพ
    image_filename = None
    if question_img and question_img.filename:
        # ตรวจสอบประเภทไฟล์
        allowed_extensions = {'.jpg', '.jpeg', '.png', '.gif'}
        file_extension = Path(question_img.filename).suffix.lower()
        
        if file_extension not in allowed_extensions:
            raise HTTPException(status_code=400, detail="ประเภทไฟล์ไม่รองรับ กรุณาใช้ JPG, PNG หรือ GIF")
        
        # ตรวจสอบขนาดไฟล์ (จำกัดที่ 5MB)
        max_size = 5 * 1024 * 1024  # 5MB
        contents = await question_img.read()
        if len(contents) > max_size:
            raise HTTPException(status_code=400, detail="ไฟล์มีขนาดใหญ่เกินไป (จำกัดที่ 5MB)")
        
        # สร้างชื่อไฟล์ที่ไม่ซ้ำ
        image_filename = f"{uuid.uuid4()}{file_extension}"
        upload_path = Path("backend/uploads") / image_filename
        
        # สร้างโฟลเดอร์ถ้าไม่มี
        upload_path.parent.mkdir(parents=True, exist_ok=True)
        
        # บันทึกไฟล์
        try:
            with open(upload_path, "wb") as f:
                f.write(contents)
            # เก็บ path สัมพัทธ์สำหรับเก็บในฐานข้อมูล
            image_filename = f"uploads/{image_filename}"
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"ไม่สามารถบันทึกไฟล์ได้: {str(e)}")
    
    # สร้างโจทย์ใหม่
    db_question = Question(
        book_id=book_id,
        page=page,
        question_no=question_no,
        question_text=question_text if question_text else None,
        question_img=image_filename
    )
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    return db_question

@router.get("/questions", response_model=List[QuestionResponse])
async def get_all_questions(db: Session = Depends(get_db)):
    """ดูโจทย์ทั้งหมด พร้อมข้อมูลเฉลยที่เชื่อมโยง"""
    from sqlalchemy.orm import joinedload
    questions = db.query(Question).options(joinedload(Question.solutions)).order_by(Question.id.desc()).all()
    return questions

@router.put("/questions/{question_id}", response_model=QuestionResponse)
async def update_question(
    question_id: int,
    book_id: str = Form(...),
    page: int = Form(...),
    question_no: int = Form(...),
    question_text: str = Form(""),
    question_img: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    """แก้ไขโจทย์"""
    
    # ตรวจสอบว่าโจทย์มีอยู่จริง
    db_question = db.query(Question).filter(Question.id == question_id).first()
    if not db_question:
        raise HTTPException(status_code=404, detail="ไม่พบโจทย์ที่ระบุ")
    
    # จัดการการอัปโหลดรูปภาพ
    image_filename = db_question.question_img  # เก็บรูปเดิมไว้
    if question_img and question_img.filename:
        # ตรวจสอบประเภทไฟล์
        allowed_extensions = {'.jpg', '.jpeg', '.png', '.gif'}
        file_extension = Path(question_img.filename).suffix.lower()
        
        if file_extension not in allowed_extensions:
            raise HTTPException(status_code=400, detail="ประเภทไฟล์ไม่รองรับ กรุณาใช้ JPG, PNG หรือ GIF")
        
        # ตรวจสอบขนาดไฟล์ (จำกัดที่ 5MB)
        max_size = 5 * 1024 * 1024  # 5MB
        contents = await question_img.read()
        if len(contents) > max_size:
            raise HTTPException(status_code=400, detail="ไฟล์มีขนาดใหญ่เกินไป (จำกัดที่ 5MB)")
        
        # ลบไฟล์เก่า (ถ้ามี)
        if db_question.question_img:
            old_file_path = Path("backend") / db_question.question_img
            if old_file_path.exists():
                old_file_path.unlink()
        
        # สร้างชื่อไฟล์ใหม่
        image_filename = f"{uuid.uuid4()}{file_extension}"
        upload_path = Path("backend/uploads") / image_filename
        
        # สร้างโฟลเดอร์ถ้าไม่มี
        upload_path.parent.mkdir(parents=True, exist_ok=True)
        
        # บันทึกไฟล์
        try:
            with open(upload_path, "wb") as f:
                f.write(contents)
            # เก็บ path สัมพัทธ์สำหรับเก็บในฐานข้อมูล
            image_filename = f"uploads/{image_filename}"
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"ไม่สามารถบันทึกไฟล์ได้: {str(e)}")
    
    # อัปเดตข้อมูลโจทย์
    db_question.book_id = book_id
    db_question.page = page
    db_question.question_no = question_no
    db_question.question_text = question_text if question_text else None
    db_question.question_img = image_filename
    
    db.commit()
    db.refresh(db_question)
    return db_question

@router.delete("/questions/{question_id}")
async def delete_question(question_id: int, db: Session = Depends(get_db)):
    """ลบโจทย์ (รองรับ Many-to-Many architecture)"""
    
    # ตรวจสอบว่าโจทย์มีอยู่จริง
    db_question = db.query(Question).filter(Question.id == question_id).first()
    if not db_question:
        raise HTTPException(status_code=404, detail="ไม่พบโจทย์ที่ระบุ")
    
    # ลบไฟล์รูปภาพของโจทย์ (ถ้ามี)
    if db_question.question_img:
        file_path = Path("backend") / db_question.question_img
        if file_path.exists():
            try:
                file_path.unlink()
            except Exception as e:
                print(f"Warning: Cannot delete question image file: {e}")
    
    # ลบความสัมพันธ์ใน question_solutions (CASCADE จะทำให้ลบอัตโนมัติ)
    # ไม่ต้องลบ Solution เพราะอาจใช้กับโจทย์อื่นอยู่
    # CASCADE DELETE ใน Foreign Key จะจัดการให้
    
    # ลบโจทย์ (CASCADE จะลบ question_solutions ที่เกี่ยวข้องโดยอัตโนมัติ)
    db.delete(db_question)
    db.commit()
    
    return {"message": "ลบโจทย์สำเร็จแล้ว"}

@router.get("/questions/{book_id}/{page}", response_model=List[QuestionResponse])
async def get_questions_by_page(book_id: str, page: int, db: Session = Depends(get_db)):
    """ดูโจทย์ทั้งหมดในหน้าหนังสือ"""
    questions = db.query(Question).filter(
        Question.book_id == book_id,
        Question.page == page
    ).all()
    return questions

@router.get("/questions/{question_id}", response_model=QuestionResponse)
async def get_question(question_id: int, db: Session = Depends(get_db)):
    """ดูโจทย์ตาม ID"""
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    return question