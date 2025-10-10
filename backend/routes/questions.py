from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from database import get_db
from models import Question, QuestionMetadata
from course_decoder import decode_course_code
from status_helper import calculate_question_status, update_question_status
import os
import uuid
from pathlib import Path

router = APIRouter()

# Pydantic schemas
class QuestionCreate(BaseModel):
    book_id: str  # รหัสหนังสือแบบใหม่
    old_book_id: Optional[str] = None  # รหัสหนังสือแบบเก่า (optional)
    page: int
    question_no: int
    question_text: Optional[str] = None
    question_img: Optional[str] = None

class SolutionBasic(BaseModel):
    id: int
    title: Optional[str] = None
    teacher_name: Optional[str] = None
    
    class Config:
        from_attributes = True

class QuestionResponse(BaseModel):
    id: int
    book_id: str  # รหัสหนังสือแบบใหม่
    old_book_id: Optional[str] = None  # รหัสหนังสือแบบเก่า
    page: int
    question_no: int
    question_text: Optional[str] = None
    question_img: Optional[str] = None
    status: str = 'ขาดเฉลย'  # สถานะโจทย์
    created_at: datetime
    solutions: List[SolutionBasic] = []
    
    class Config:
        from_attributes = True

@router.post("/questions", response_model=QuestionResponse)
async def create_question(
    book_id: str = Form(...),
    old_book_id: Optional[str] = Form(None),
    page: int = Form(...),
    question_no: int = Form(...),
    question_text: str = Form(""),
    question_img: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    """เพิ่มโจทย์ใหม่ (รองรับการอัปโหลดรูปภาพ + รหัสหนังสือแบบเก่า + ป้องกันความซ้ำ)"""
    
    # Debug: แสดงข้อมูลที่ได้รับ
    print(f"📥 Received data:")
    print(f"   book_id: {book_id}")
    print(f"   old_book_id: {old_book_id} (type: {type(old_book_id)})")
    print(f"   page: {page}, question_no: {question_no}")
    
    # ตรวจสอบความซ้ำ
    existing = db.query(Question).filter(
        Question.book_id == book_id,
        Question.page == page,
        Question.question_no == question_no
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=409,
            detail=f"โจทย์ซ้ำ! มีโจทย์ {book_id} หน้า {page} ข้อ {question_no} อยู่แล้ว (ID: {existing.id})"
        )
    
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
        
        # สร้างชื่อไฟล์แบบใหม่: [รหัสหนังสือ]_[หน้า]_[ข้อที่].ext
        # ทำความสะอาดชื่อไฟล์ (เอาอักขระพิเศษออก)
        safe_book_id = book_id.replace('/', '-').replace('\\', '-').replace(':', '-')
        image_filename = f"{safe_book_id}_{page}_{question_no}{file_extension}"
        
        # ใช้ path relative จาก backend/ directory
        uploads_dir = Path(__file__).parent.parent / "uploads"
        uploads_dir.mkdir(exist_ok=True)
        upload_path = uploads_dir / image_filename
        
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
        old_book_id=old_book_id if old_book_id else None,
        page=page,
        question_no=question_no,
        question_text=question_text if question_text else None,
        question_img=image_filename
    )
    print(f"💾 Saving to database: old_book_id = {db_question.old_book_id}")
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    print(f"✅ Saved successfully! Question ID: {db_question.id}, old_book_id in DB: {db_question.old_book_id}")
    
    # ถอดรหัส book_id และสร้าง QuestionMetadata
    try:
        decoded = decode_course_code(book_id)
        if decoded.get("success"):
            metadata = QuestionMetadata(
                question_id=db_question.id,
                teacher_code=decoded.get("teacher_code"),
                teacher_name=decoded.get("teacher_name"),
                subject=decoded.get("subject"),
                class_level=decoded.get("class_level"),
                course_type=decoded.get("course_type"),
                course_type_name=decoded.get("course_type_name"),
                year=decoded.get("year"),
                content_level=decoded.get("level"),
                content_level_name=decoded.get("level_name"),
                category=decoded.get("category"),
                chapter=decoded.get("chapter"),
                file_type=decoded.get("file_type"),
                file_type_name=decoded.get("file_type_name"),
                status='incomplete'  # สถานะเริ่มต้น
            )
            db.add(metadata)
            db.commit()
            print(f"📊 Metadata created: Teacher={decoded.get('teacher_name')}, Subject={decoded.get('subject')}")
        else:
            print(f"⚠️ Cannot decode book_id: {decoded.get('error')}")
    except Exception as e:
        print(f"❌ Error creating metadata: {e}")
        # ไม่ raise error เพราะโจทย์ถูกสร้างแล้ว แค่ metadata ไม่สำเร็จ
    
    # อัพเดทสถานะโจทย์
    update_question_status(db, db_question.id)
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
    old_book_id: Optional[str] = Form(None),
    page: int = Form(...),
    question_no: int = Form(...),
    question_text: str = Form(""),
    updated_by: Optional[str] = Form(None),
    question_img: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    """แก้ไขโจทย์ (รองรับการอัปเดตรหัสหนังสือแบบเก่า)"""
    
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
            # db_question.question_img = "uploads/xxx.png"
            old_file_path = Path(__file__).parent.parent / db_question.question_img
            if old_file_path.exists():
                old_file_path.unlink()
        
        # สร้างชื่อไฟล์แบบใหม่: [รหัสหนังสือ]_[หน้า]_[ข้อที่].ext
        # ทำความสะอาดชื่อไฟล์ (เอาอักขระพิเศษออก)
        safe_book_id = book_id.replace('/', '-').replace('\\', '-').replace(':', '-')
        image_filename = f"{safe_book_id}_{page}_{question_no}{file_extension}"
        
        # ใช้ path relative จาก backend/ directory
        uploads_dir = Path(__file__).parent.parent / "uploads"
        uploads_dir.mkdir(exist_ok=True)
        upload_path = uploads_dir / image_filename
        
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
    db_question.old_book_id = old_book_id if old_book_id else None
    db_question.page = page
    db_question.question_no = question_no
    db_question.question_text = question_text if question_text else None
    db_question.question_img = image_filename
    if updated_by:
        db_question.updated_by = updated_by
    
    db.commit()
    db.refresh(db_question)
    return db_question

@router.delete("/questions/{question_id}")
async def delete_question(question_id: int, db: Session = Depends(get_db)):
    """ลบโจทย์พร้อมรูปภาพทั้งหมดที่เกี่ยวข้อง"""
    from models import Solution, SolutionImage
    
    # ตรวจสอบว่าโจทย์มีอยู่จริง
    db_question = db.query(Question).filter(Question.id == question_id).first()
    if not db_question:
        raise HTTPException(status_code=404, detail="ไม่พบโจทย์ที่ระบุ")
    
    # ลบไฟล์รูปภาพของโจทย์ (ถ้ามี)
    if db_question.question_img:
        file_path = Path(__file__).parent.parent / db_question.question_img
        if file_path.exists():
            try:
                file_path.unlink()
                print(f"✅ ลบรูปโจทย์: {db_question.question_img}")
            except Exception as e:
                print(f"⚠️ Warning: Cannot delete question image file: {e}")
    
    # ดึงเฉลยทั้งหมดที่เกี่ยวข้องกับโจทย์นี้
    solutions = db.query(Solution).filter(Solution.question_id == question_id).all()
    
    # ลบรูปภาพของเฉลยทั้งหมด
    for solution in solutions:
        solution_images = db.query(SolutionImage).filter(SolutionImage.solution_id == solution.id).all()
        
        for img in solution_images:
            # ลบไฟล์รูปภาพจาก filesystem
            img_path = Path(__file__).parent.parent / img.image_path
            if img_path.exists():
                try:
                    img_path.unlink()
                    print(f"✅ ลบรูปเฉลย: {img.image_path}")
                except Exception as e:
                    print(f"⚠️ Warning: Cannot delete solution image file: {e}")
    
    # ลบโจทย์ (CASCADE จะลบ solutions และ solution_images โดยอัตโนมัติ)
    db.delete(db_question)
    db.commit()
    
    return {"message": "ลบโจทย์และรูปภาพทั้งหมดสำเร็จแล้ว"}

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