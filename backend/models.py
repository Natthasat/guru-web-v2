from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

class Question(Base):
    __tablename__ = "questions"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    book_id = Column(String(50), nullable=False, index=True)  # รหัสหนังสือแบบใหม่ (เช่น IPL5203-1051)
    old_book_id = Column(String(50), nullable=True)  # รหัสหนังสือแบบเก่า (เช่น 1710-0141) - optional
    page = Column(Integer, nullable=False, index=True)
    question_no = Column(Integer, nullable=False, index=True)
    question_text = Column(Text, nullable=True)
    question_img = Column(String(255), nullable=True)
    status = Column(String(20), nullable=False, default='ขาดเฉลย', index=True)  # สถานะ: ขาดเฉลย, ขาดรูปวิธีทำ, ครบแล้ว
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    updated_by = Column(String(50), nullable=True)  # ผู้แก้ไขล่าสุด
    
    # One-to-Many relationship: 1 question -> many solutions
    solutions = relationship("Solution", back_populates="question", cascade="all, delete-orphan")
    
    # One-to-One relationship: 1 question -> 1 decoded_data
    decoded_data = relationship("QuestionMetadata", back_populates="question", uselist=False, cascade="all, delete-orphan")
    
    # UNIQUE constraint: ป้องกันโจทย์ซ้ำ
    __table_args__ = (
        UniqueConstraint('book_id', 'page', 'question_no', name='unique_question'),
    )

class Solution(Base):
    """
    ตารางเก็บเฉลย (แต่ละเฉลยผูกกับโจทย์เดียว)
    1 โจทย์สามารถมีหลายเฉลยได้
    """
    __tablename__ = "solutions"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    question_id = Column(Integer, ForeignKey("questions.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=True)  # ชื่อเฉลย เช่น "วิธีที่ 1", "วิธีที่ 2"
    teacher_name = Column(String(100), nullable=True)  # ชื่อครูผู้ให้เฉลย
    answer_text = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # Many-to-One relationship: many solutions -> 1 question
    question = relationship("Question", back_populates="solutions")
    
    # One-to-Many relationship with solution_images
    images = relationship("SolutionImage", back_populates="solution", cascade="all, delete-orphan")

class SolutionImage(Base):
    """
    ตารางเก็บรูปภาพของเฉลย (รองรับหลายรูปต่อ 1 เฉลย)
    """
    __tablename__ = "solution_images"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    solution_id = Column(Integer, ForeignKey("solutions.id", ondelete="CASCADE"), nullable=False)
    image_path = Column(String(255), nullable=False)
    image_order = Column(Integer, default=0)  # ลำดับการแสดงรูป
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    # Relationship with solution
    solution = relationship("Solution", back_populates="images")

class QuestionMetadata(Base):
    """
    ตารางเก็บข้อมูลที่ถอดรหัสจาก book_id สำหรับใช้ในการค้นหาและกรอง
    """
    __tablename__ = "question_metadata"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    question_id = Column(Integer, ForeignKey("questions.id", ondelete="CASCADE"), nullable=False, unique=True)
    
    # ข้อมูลที่ถอดรหัสจาก book_id
    teacher_code = Column(String(10), nullable=True, index=True)  # รหัสครู (เช่น IP)
    teacher_name = Column(String(100), nullable=True, index=True)  # ชื่อครู (เช่น ปาม็อบ)
    subject = Column(String(100), nullable=True, index=True)  # วิชา (เช่น ฟิสิกส์)
    class_level = Column(String(50), nullable=True, index=True)  # ช่วงชั้น (เช่น ม.ปลาย)
    course_type = Column(String(10), nullable=True, index=True)  # ประเภทคอร์ส (เช่น V=VDO)
    course_type_name = Column(String(100), nullable=True)  # ชื่อประเภทคอร์ส (เช่น VDO)
    year = Column(String(10), nullable=True, index=True)  # ปี (เช่น 2025)
    content_level = Column(String(10), nullable=True, index=True)  # ระดับเนื้อหา (เช่น 1=พื้นฐาน)
    content_level_name = Column(String(100), nullable=True)  # ชื่อระดับเนื้อหา
    category = Column(String(10), nullable=True, index=True)  # หมวด (เช่น 00)
    chapter = Column(String(10), nullable=True, index=True)  # บท (เช่น 01)
    file_type = Column(String(10), nullable=True, index=True)  # ประเภทไฟล์ (เช่น 52)
    file_type_name = Column(String(100), nullable=True)  # ชื่อประเภทไฟล์
    
    # สถานะโจทย์
    status = Column(String(20), nullable=False, default='incomplete', index=True)  
    # incomplete = ขาดเฉลย (แดง)
    # missing_images = ขาดรูปวิธีทำ (ส้ม)
    # complete = ครบแล้ว (เขียว)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    # One-to-One relationship: 1 metadata -> 1 question
    question = relationship("Question", back_populates="decoded_data")

# ไม่ต้องใช้ QuestionSolution (junction table) อีกต่อไป เพราะเปลี่ยนเป็น One-to-Many แล้ว