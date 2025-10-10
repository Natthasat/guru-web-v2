from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from course_decoder import decode_course_code, explain_course_code

router = APIRouter()

class CourseCodeRequest(BaseModel):
    code: str

class CourseCodeResponse(BaseModel):
    success: bool
    code: Optional[str] = None
    teacher_code: Optional[str] = None
    teacher_name: Optional[str] = None
    subject: Optional[str] = None
    class_level: Optional[str] = None
    course_type: Optional[str] = None
    course_type_name: Optional[str] = None
    year: Optional[str] = None
    level: Optional[str] = None
    level_name: Optional[str] = None
    category: Optional[str] = None
    chapter: Optional[str] = None
    file_type: Optional[str] = None
    file_type_name: Optional[str] = None
    explanation: Optional[str] = None
    error: Optional[str] = None
    message: Optional[str] = None

@router.post("/decode", response_model=CourseCodeResponse)
async def decode_course(request: CourseCodeRequest):
    """
    ถอดรหัสคอร์ส
    
    รูปแบบรหัส: AABCCDEEFF-GGGG
    - AA = รหัสครู (2 ตัวอักษร)
    - B = ประเภทคอร์ส (S/L/R/P)
    - CC = ปีที่สอน (2 หลัก)
    - D = ระดับเนื้อหา (1 หลัก: 1=พื้นฐาน, 2=เข้มข้น, 3=ตะลุยโจทย์)
    - EE = หมวด/บทเรียน (2 หลัก)
    - FF = บทที่ (2 หลัก)
    - GG = ประเภทไฟล์ (2 หลัก: 51=VDO, 52=PDF, 53=เฉลย, 54=สไลด์)
    
    ตัวอย่าง: JAR25384-0252
    """
    try:
        # ถอดรหัส
        result = decode_course_code(request.code)
        
        # ถ้าสำเร็จ เพิ่ม explanation
        if result.get("success"):
            result["explanation"] = explain_course_code(request.code)
        
        return result
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"เกิดข้อผิดพลาด: {str(e)}")

@router.get("/test/{code}")
async def test_decode(code: str):
    """
    ทดสอบถอดรหัสคอร์สผ่าน GET request
    """
    try:
        result = decode_course_code(code)
        if result.get("success"):
            result["explanation"] = explain_course_code(code)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"เกิดข้อผิดพลาด: {str(e)}")
