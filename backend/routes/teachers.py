"""
Teacher Management API
จัดการข้อมูลครูโดยไม่ต้องแก้ไข Excel โดยตรง
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from database import get_db
from models import User
from auth import decode_access_token
from fastapi.security import OAuth2PasswordBearer
import pandas as pd
from pathlib import Path
import shutil
import tempfile

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Dependency สำหรับตรวจสอบ user ที่ login
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    """Get current authenticated user from JWT token"""
    credentials_exception = HTTPException(
        status_code=401,
        detail="ไม่สามารถยืนยันตัวตนได้",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception
    
    username: str = payload.get("sub")
    if username is None:
        raise credentials_exception
    
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise credentials_exception
    
    return user

BASE_DIR = Path(__file__).resolve().parent.parent
REFERENCE_FILE = BASE_DIR / "data" / "ดิจิท.xlsx"
SHEET_NAME = "ชีต1"

class TeacherCreate(BaseModel):
    teacher_code: str  # รหัสครู 2 ตัวอักษร เช่น "JA"
    teacher_name: str  # ชื่อครู
    subject: str       # วิชาที่สอน
    class_level: str   # ช่วงชั้น เช่น "ม.ต้น"

class TeacherUpdate(BaseModel):
    teacher_name: Optional[str] = None
    subject: Optional[str] = None
    class_level: Optional[str] = None

class TeacherResponse(BaseModel):
    teacher_code: str
    teacher_name: str
    subject: str
    class_level: str

def safe_write_excel(df, file_path, sheet_name):
    """
    เขียน Excel แบบปลอดภัย โดยใช้ temporary file
    """
    try:
        # Convert Path object to string
        file_path_str = str(file_path)
        
        # สร้าง temporary file
        temp_file = tempfile.NamedTemporaryFile(mode='wb', delete=False, suffix='.xlsx')
        temp_path = temp_file.name
        temp_file.close()
        
        # เขียนไปที่ temp file ก่อน
        df.to_excel(temp_path, sheet_name=sheet_name, index=False, engine='openpyxl')
        
        # ถ้าสำเร็จ ให้แทนที่ไฟล์เดิม
        shutil.move(temp_path, file_path_str)
        
        return True
    except Exception as e:
        # ถ้าเกิด error ให้ลบ temp file
        try:
            if Path(temp_path).exists():
                Path(temp_path).unlink()
        except:
            pass
        raise e

@router.get("/teachers/list")
async def list_all_teachers(current_user: User = Depends(get_current_user)):
    """
    ดึงรายชื่อครูทั้งหมดจาก Excel (ต้อง login)
    """
    try:
        df = pd.read_excel(REFERENCE_FILE, sheet_name=SHEET_NAME)
        teachers = []
        
        for i in range(3, len(df)):
            code = df.iloc[i, 0]
            teacher = df.iloc[i, 1]
            subject = df.iloc[i, 2]
            level = df.iloc[i, 3]
            
            if pd.isna(code) or str(code).strip() == "":
                continue
            
            code_str = str(code).strip()
            
            if len(code_str) == 2 and code_str != "AA":
                teachers.append({
                    "teacher_code": code_str,
                    "teacher_name": str(teacher).strip() if not pd.isna(teacher) else "",
                    "subject": str(subject).strip() if not pd.isna(subject) else "",
                    "class_level": str(level).strip() if not pd.isna(level) else ""
                })
        
        return {
            "success": True,
            "total": len(teachers),
            "teachers": sorted(teachers, key=lambda x: x['teacher_code'])
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading Excel: {str(e)}")

@router.post("/teachers/add", response_model=dict)
async def add_teacher(teacher: TeacherCreate, current_user: User = Depends(get_current_user)):
    """
    เพิ่มครูใหม่ลงใน Excel (ต้อง login)
    """
    try:
        # ตรวจสอบรหัสครู
        if len(teacher.teacher_code) != 2 or not teacher.teacher_code.isalpha():
            raise HTTPException(
                status_code=400,
                detail="รหัสครูต้องเป็นตัวอักษร 2 ตัว เช่น 'JA', 'NP'"
            )
        
        teacher_code = teacher.teacher_code.upper()
        
        # อ่าน Excel
        df = pd.read_excel(REFERENCE_FILE, sheet_name=SHEET_NAME)
        
        # ตรวจสอบว่ามีรหัสครูนี้อยู่แล้วหรือไม่
        for i in range(3, len(df)):
            code = str(df.iloc[i, 0]).strip()
            if code == teacher_code:
                raise HTTPException(
                    status_code=409,
                    detail=f"รหัสครู '{teacher_code}' มีอยู่แล้ว"
                )
        
        # เพิ่มข้อมูลครูใหม่โดยสร้าง dict ที่มีทุก column
        new_row_dict = {col: pd.NA for col in df.columns}
        new_row_dict[df.columns[0]] = teacher_code
        new_row_dict[df.columns[1]] = teacher.teacher_name
        new_row_dict[df.columns[2]] = teacher.subject
        new_row_dict[df.columns[3]] = teacher.class_level
        
        new_row = pd.DataFrame([new_row_dict])
        
        # รวม DataFrame เก่ากับใหม่
        df = pd.concat([df, new_row], ignore_index=True)
        
        # บันทึกกลับไปที่ Excel แบบปลอดภัย
        safe_write_excel(df, REFERENCE_FILE, SHEET_NAME)
        
        # Reload course_decoder cache
        from course_decoder import load_teacher_map
        import course_decoder
        course_decoder.TEACHER_MAP = load_teacher_map()
        
        return {
            "success": True,
            "message": f"เพิ่มครู '{teacher.teacher_name}' (รหัส: {teacher_code}) สำเร็จ",
            "teacher": {
                "teacher_code": teacher_code,
                "teacher_name": teacher.teacher_name,
                "subject": teacher.subject,
                "class_level": teacher.class_level
            }
        }
    
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        print(f"Error adding teacher: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Error adding teacher: {str(e)}")

@router.put("/teachers/{teacher_code}")
async def update_teacher(teacher_code: str, teacher: TeacherUpdate, current_user: User = Depends(get_current_user)):
    """
    แก้ไขข้อมูลครู (ต้อง login)
    """
    try:
        teacher_code = teacher_code.upper()
        
        # อ่าน Excel
        df = pd.read_excel(REFERENCE_FILE, sheet_name=SHEET_NAME)
        
        # หาแถวของครูที่ต้องการแก้ไข
        found = False
        for i in range(3, len(df)):
            code = str(df.iloc[i, 0]).strip()
            if code == teacher_code:
                found = True
                
                # อัปเดตข้อมูล (เฉพาะค่าที่ส่งมา)
                if teacher.teacher_name is not None:
                    df.iloc[i, 1] = teacher.teacher_name
                if teacher.subject is not None:
                    df.iloc[i, 2] = teacher.subject
                if teacher.class_level is not None:
                    df.iloc[i, 3] = teacher.class_level
                
                break
        
        if not found:
            raise HTTPException(
                status_code=404,
                detail=f"ไม่พบรหัสครู '{teacher_code}'"
            )
        
        # บันทึกกลับไปที่ Excel แบบปลอดภัย
        safe_write_excel(df, REFERENCE_FILE, SHEET_NAME)
        
        # Reload course_decoder cache
        from course_decoder import load_teacher_map
        import course_decoder
        course_decoder.TEACHER_MAP = load_teacher_map()
        
        return {
            "success": True,
            "message": f"อัปเดตข้อมูลครู '{teacher_code}' สำเร็จ"
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating teacher: {str(e)}")

@router.delete("/teachers/{teacher_code}")
async def delete_teacher(teacher_code: str, current_user: User = Depends(get_current_user)):
    """
    ลบข้อมูลครู (ต้อง login)
    """
    try:
        teacher_code = teacher_code.upper()
        
        # อ่าน Excel
        df = pd.read_excel(REFERENCE_FILE, sheet_name=SHEET_NAME)
        
        # หาและลบแถวของครู
        found = False
        for i in range(3, len(df)):
            code = str(df.iloc[i, 0]).strip()
            if code == teacher_code:
                found = True
                teacher_name = df.iloc[i, 1]
                df = df.drop(index=i)
                break
        
        if not found:
            raise HTTPException(
                status_code=404,
                detail=f"ไม่พบรหัสครู '{teacher_code}'"
            )
        
        # บันทึกกลับไปที่ Excel แบบปลอดภัย
        safe_write_excel(df, REFERENCE_FILE, SHEET_NAME)
        
        # Reload course_decoder cache
        from course_decoder import load_teacher_map
        import course_decoder
        course_decoder.TEACHER_MAP = load_teacher_map()
        
        return {
            "success": True,
            "message": f"ลบครู '{teacher_name}' (รหัส: {teacher_code}) สำเร็จ"
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting teacher: {str(e)}")

@router.get("/teachers/{teacher_code}")
async def get_teacher(teacher_code: str):
    """
    ดูข้อมูลครูคนใดคนหนึ่ง
    """
    try:
        teacher_code = teacher_code.upper()
        
        df = pd.read_excel(REFERENCE_FILE, sheet_name=SHEET_NAME)
        
        for i in range(3, len(df)):
            code = str(df.iloc[i, 0]).strip()
            if code == teacher_code:
                return {
                    "success": True,
                    "teacher": {
                        "teacher_code": code,
                        "teacher_name": str(df.iloc[i, 1]).strip(),
                        "subject": str(df.iloc[i, 2]).strip(),
                        "class_level": str(df.iloc[i, 3]).strip()
                    }
                }
        
        raise HTTPException(
            status_code=404,
            detail=f"ไม่พบรหัสครู '{teacher_code}'"
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting teacher: {str(e)}")
