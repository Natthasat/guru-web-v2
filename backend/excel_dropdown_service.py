"""
Excel Dropdown Data Service
อ่านข้อมูลจากไฟล์ Excel สำหรับใช้ใน dropdown filters
"""
import pandas as pd
from pathlib import Path
from typing import Dict, List, Set

BASE_DIR = Path(__file__).resolve().parent
REFERENCE_FILE = BASE_DIR / "data" / "ดิจิท.xlsx"
SHEET_NAME = "ชีต1"

def get_dropdown_options_from_excel() -> Dict:
    """
    อ่านข้อมูลจาก Excel และสร้าง dropdown options
    
    Returns:
        Dict ที่มี keys: teachers, subjects, class_levels, course_types, file_types, content_levels
    """
    try:
        df = pd.read_excel(REFERENCE_FILE, sheet_name=SHEET_NAME)
        
        # เก็บข้อมูลในรูป set เพื่อหลีกเลี่ยงค่าซ้ำ
        teachers_set = set()
        subjects_set = set()
        class_levels_set = set()
        
        # อ่านข้อมูลจากแถวที่ 3 เป็นต้นไป (index 3)
        # คอลัมน์ 0: รหัสครู, 1: ชื่อครู, 2: วิชา, 3: ช่วงชั้น
        for i in range(3, len(df)):
            code = df.iloc[i, 0]
            teacher = df.iloc[i, 1]
            subject = df.iloc[i, 2]
            level = df.iloc[i, 3]
            
            # ข้ามแถวที่ไม่มีข้อมูล
            if pd.isna(code) or pd.isna(teacher) or str(code).strip() == "":
                continue
            
            code_str = str(code).strip()
            teacher_str = str(teacher).strip() if not pd.isna(teacher) else ""
            subject_str = str(subject).strip() if not pd.isna(subject) else ""
            level_str = str(level).strip() if not pd.isna(level) else ""
            
            # เก็บเฉพาะรหัสครูที่มี 2 ตัวอักษร
            if len(code_str) == 2 and code_str != "AA":
                if teacher_str and teacher_str != "-":
                    teachers_set.add(teacher_str)
                if subject_str and subject_str != "-":
                    subjects_set.add(subject_str)
                if level_str and level_str != "-":
                    class_levels_set.add(level_str)
        
        # ชนิดคอร์ส (Course Types) - จาก course_decoder.py
        course_types = [
            "Onsite",
            "Online/VDO ทบทวน",
            "VDO Rerun",
            "VDO",
            "UP (Pre-test)",
            "Turn Course",
            "แจกฟรี",
            "UP",
            "LIVE Rerun"
        ]
        
        # ประเภทไฟล์ (File Types) - จาก course_decoder.py
        file_types = [
            "ไม่ระบุ",
            "คำถาม",
            "VDO",
            "เอกสาร For Print (PDF)",
            "เอกสาร For Tablet",
            "สไลด์/ประกอบ",
            "เฉลยทั้งชื่อ(พิมพ์)"
        ]
        
        # ระดับเนื้อหา (Content Levels) - จาก course_decoder.py
        content_levels = [
            "ตัวสอบ Midterm/final",
            "พื้นฐาน",
            "ศรุนเข้มและโจทย์เพิ่ม/super",
            "ตะลุยโจทย์/ADVANCE",
            "MID",
            "สนามสอบ",
            "intensive",
            "shortcut",
            "Express",
            "summary"
        ]
        
        return {
            "teachers": sorted(list(teachers_set)),
            "subjects": sorted(list(subjects_set)),
            "class_levels": sorted(list(class_levels_set)),
            "course_types": course_types,
            "file_types": file_types,
            "content_levels": content_levels,
            "years": [str(year) for year in range(2020, 2030)]  # ปี 2020-2029
        }
        
    except Exception as e:
        print(f"Error reading Excel file: {e}")
        # ถ้าอ่านไม่ได้ ให้คืนค่า default ว่างๆ
        return {
            "teachers": [],
            "subjects": [],
            "class_levels": [],
            "course_types": [],
            "file_types": [],
            "content_levels": [],
            "years": []
        }

def get_teacher_info_by_name(teacher_name: str) -> List[Dict]:
    """
    ค้นหาข้อมูลครูจากชื่อ
    
    Args:
        teacher_name: ชื่อครู
        
    Returns:
        List of dicts ที่มีข้อมูล code, subject, level
    """
    try:
        df = pd.read_excel(REFERENCE_FILE, sheet_name=SHEET_NAME)
        results = []
        
        for i in range(3, len(df)):
            code = df.iloc[i, 0]
            teacher = df.iloc[i, 1]
            subject = df.iloc[i, 2]
            level = df.iloc[i, 3]
            
            if pd.isna(code) or pd.isna(teacher):
                continue
                
            teacher_str = str(teacher).strip()
            
            if teacher_str == teacher_name:
                results.append({
                    "code": str(code).strip(),
                    "teacher": teacher_str,
                    "subject": str(subject).strip() if not pd.isna(subject) else "",
                    "level": str(level).strip() if not pd.isna(level) else ""
                })
        
        return results
    except Exception as e:
        print(f"Error: {e}")
        return []

# สำหรับ testing
if __name__ == "__main__":
    print("=== Dropdown Options from Excel ===")
    options = get_dropdown_options_from_excel()
    
    print(f"\nครู ({len(options['teachers'])} คน):")
    print(options['teachers'])
    
    print(f"\nวิชา ({len(options['subjects'])} วิชา):")
    print(options['subjects'])
    
    print(f"\nช่วงชั้น ({len(options['class_levels'])} ระดับ):")
    print(options['class_levels'])
    
    print(f"\nชนิดคอร์ส ({len(options['course_types'])} ชนิด):")
    print(options['course_types'])
    
    print(f"\nประเภทไฟล์ ({len(options['file_types'])} ประเภท):")
    print(options['file_types'])
    
    print(f"\nระดับเนื้อหา ({len(options['content_levels'])} ระดับ):")
    print(options['content_levels'])
