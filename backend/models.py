from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
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
    book_id = Column(String(50), nullable=False)
    page = Column(Integer, nullable=False)
    question_no = Column(Integer, nullable=False)
    question_text = Column(Text, nullable=True)
    question_img = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    # Many-to-Many relationship with solutions through question_solutions
    question_solutions = relationship("QuestionSolution", back_populates="question", cascade="all, delete-orphan")

class Solution(Base):
    """
    ตารางเก็บเฉลยกลาง (ไม่ผูกกับโจทย์โดยตรง)
    สามารถใช้เฉลยเดียวกันกับหลายโจทย์ได้
    """
    __tablename__ = "solutions"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(255), nullable=True)  # ชื่อเฉลย (optional)
    answer_text = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # One-to-Many relationship with solution_images
    images = relationship("SolutionImage", back_populates="solution", cascade="all, delete-orphan")
    
    # Many-to-Many relationship with questions through question_solutions
    question_solutions = relationship("QuestionSolution", back_populates="solution", cascade="all, delete-orphan")

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

class QuestionSolution(Base):
    """
    ตาราง mapping ระหว่าง questions ↔ solutions (Many-to-Many)
    """
    __tablename__ = "question_solutions"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    question_id = Column(Integer, ForeignKey("questions.id", ondelete="CASCADE"), nullable=False)
    solution_id = Column(Integer, ForeignKey("solutions.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    # Relationships
    question = relationship("Question", back_populates="question_solutions")
    solution = relationship("Solution", back_populates="question_solutions")