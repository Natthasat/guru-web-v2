import pandas as pd
import re
from pathlib import Path

# กำหนด path ของไฟล์ Excel
BASE_DIR = Path(__file__).resolve().parent
REFERENCE_FILE = BASE_DIR / "data" / "ดิจิท.xlsx"
SHEET_NAME = "ชีต1"

# โหลดตารางจาก Excel และสร้าง mapping
def load_teacher_map():
    """โหลดข้อมูลครูจากไฟล์ Excel"""
    try:
        df = pd.read_excel(REFERENCE_FILE, sheet_name=SHEET_NAME)
        teacher_map = {}
        
        for _, row in df.iterrows():
            code = str(row.iloc[0]).strip()
            if len(code) == 2 and code != "AA":
                teacher_map[code] = {
                    "teacher": str(row.iloc[1]).strip(),
                    "subject": str(row.iloc[2]).strip() if not pd.isna(row.iloc[2]) else "",
                    "level": str(row.iloc[3]).strip() if not pd.isna(row.iloc[3]) else ""
                }
        
        return teacher_map
    except Exception as e:
        print(f"Error loading teacher map: {e}")
        return {}

# mapping ค่าคงที่
COURSE_TYPE = {
    "S": "Onsite",
    "L": "Online/VDO ทบทวน",
    "R": "VDO Rerun",
    "V": "VDO",
    "P": "UP (Pre-test)",
    "C": "Turn Course",
    "F": "แจกฟรี",
    "U": "UP",  # สำหรับ UP
    "LR": "LIVE Rerun"  # สำหรับกรณีพิเศษ
}

FILE_TYPE = {
    "00": "ไม่ระบุ",
    "01": "คำถาม",
    "02": "คำถาม",
    "03": "คำถาม",
    "04": "คำถาม",
    "05": "คำถาม",
    "06": "คำถาม",
    "07": "คำถาม",
    "08": "คำถาม",
    "09": "คำถาม",
    "10": "คำถาม",
    "51": "VDO",
    "52": "เอกสาร For Print (PDF)",
    "53": "เอกสาร For Tablet",
    "54": "สไลด์/ประกอบ",
    "55": "เฉลยทั้งชื่อ(พิมพ์)"
}

LEVEL_TYPE = {
    "1": "พื้นฐาน",
    "2": "ศรุนเข้มและโจทย์เพิ่ม/super",
    "3": "ตะลุยโจทย์/ADVANCE",
    "4": "MID",
    "5": "สนามสอบ",
    "6": "intensive",
    "7": "shortcut",
    "8": "Express",
    "9": "summary",
    "0": "ตัวสอบ Midterm/final"
}

# โหลด teacher map ครั้งเดียวตอน import module
TEACHER_MAP = load_teacher_map()

def explain_parts(AA, B, CC, D, EE, FF, GG, info):
    """สร้างคำอธิบายแบบละเอียด"""
    parts = []
    parts.append(f"👨‍🏫 {AA} = {info['teacher']}")
    parts.append(f"📚 {B} = {COURSE_TYPE.get(B, 'ไม่ทราบ')}")
    parts.append(f"📅 {CC} = ปี 20{CC}")
    parts.append(f"📊 {D} = {LEVEL_TYPE.get(D, 'ไม่ทราบ')}")
    parts.append(f"🏷️ {EE} = หมวด {EE}")
    parts.append(f"📖 {FF} = บทที่ {FF}")
    parts.append(f"📄 {GG} = {FILE_TYPE.get(GG, 'ไม่ทราบ')}")
    return "\n".join(parts)

def decode_course_code(code: str) -> dict:
    """
    ถอดรหัสคอร์ส เช่น 'JAR25384-0252' → คืนค่าความหมายทั้งหมดในรูปแบบ dict
    
    รูปแบบรหัส: AABCCDEEFF-GGGG
    AA = รหัสครู (2 ตัวอักษร)
    B = ประเภทคอร์ส (S/L/R/P)
    CC = ปีที่สอน (2 หลัก)
    D = ระดับเนื้อหา (1 หลัก)
    EE = หมวด/บทเรียน (2 หลัก)
    FF = บทที่ (2 หลัก)
    GG = ประเภทไฟล์ (2 หลัก)
    """
    # ลบช่องว่างและทำให้เป็นตัวพิมพ์ใหญ่
    code = code.strip().upper()
    
    # รูปแบบ: AA B CC D EE - FF GG
    # รองรับทั้ง 1 ตัวอักษร (S,L,R,V,C,F,P,U) และ 2 ตัว (UP, LR)
    pattern = r"^([A-Z]{2})([A-Z]{1,2})(\d{2})(\d)(\d{2})-?(\d{2})(\d{2})$"
    match = re.match(pattern, code)
    
    if not match:
        return {
            "success": False,
            "error": "รูปแบบรหัสไม่ถูกต้อง",
            "message": "รูปแบบที่ถูกต้อง: AABCCDEEFF-GGGG (เช่น JAR25384-0252)"
        }

    AA, B, CC, D, EE, FF, GG = match.groups()
    
    # ดึงข้อมูลครูจาก mapping
    info = TEACHER_MAP.get(AA, {
        "teacher": f"ไม่พบรหัสครู ({AA})",
        "subject": "-",
        "level": "-"
    })

    result = {
        "success": True,
        "code": code,  # รหัสต้นฉบับ
        "teacher_code": AA,
        "teacher_name": info["teacher"],
        "subject": info["subject"],
        "class_level": info["level"],
        "course_type": B,
        "course_type_name": COURSE_TYPE.get(B, f"ไม่ทราบ ({B})"),
        "year": f"20{CC}",
        "level": D,
        "level_name": LEVEL_TYPE.get(D, f"ไม่ทราบ ({D})"),
        "category": EE,
        "chapter": FF,
        "file_type": GG,
        "file_type_name": FILE_TYPE.get(GG, f"ไม่ทราบ ({GG})"),
        "explanation": explain_parts(AA, B, CC, D, EE, FF, GG, info)
    }
    
    return result

def explain_course_code(code: str) -> str:
    """แปลงผลลัพธ์ dict ให้อยู่ในรูปข้อความอ่านเข้าใจง่าย"""
    data = decode_course_code(code)
    
    if not data.get("success", False):
        return data.get("error", "เกิดข้อผิดพลาด")

    return (
        f"📘 {data['teacher_name']} – {data['subject']} ({data['class_level']})\n"
        f"🧩 ประเภทคอร์ส: {data['course_type_name']}\n"
        f"📅 ปี {data['year']}\n"
        f"⚙️ ระดับเนื้อหา: {data['level_name']}\n"
        f"📚 หมวด {data['category']} – บทที่ {data['chapter']}\n"
        f"🖨️ ประเภทไฟล์: {data['file_type_name']}"
    )

# 🔹 ทดลองใช้งาน
if __name__ == "__main__":
    test_codes = ["JAR25384-0252", "JAR25384-0252", "INVALID"]
    
    for code in test_codes:
        print(f"\n{'='*60}")
        print(f"รหัส: {code}")
        print(f"{'='*60}")
        result = decode_course_code(code)
        if result.get("success"):
            print(explain_course_code(code))
        else:
            print(f"❌ {result.get('error')}")
