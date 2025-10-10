import pandas as pd
import json

# โหลดไฟล์ Excel
df = pd.read_excel('data/ดิจิท.xlsx', sheet_name='ชีต1')

print("=== โครงสร้างตาราง ===")
print("Row 2 (Headers):", df.iloc[2].tolist()[:8])

print("\n=== ข้อมูลตัวอย่าง (10 แถวแรก) ===")
for i in range(3, 13):
    row_data = df.iloc[i, 0:4].tolist()
    print(f"Row {i}: {row_data}")

print("\n=== สร้าง Dropdown Options ===")

# ดึงข้อมูลครู + วิชา + ช่วงชั้น (คอลัมน์ 0-3)
teachers = []
subjects = set()
class_levels = set()

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
    
    if len(code_str) == 2 and code_str != "AA":
        teachers.append({
            "code": code_str,
            "teacher": teacher_str,
            "subject": subject_str,
            "level": level_str
        })
        
        if subject_str:
            subjects.add(subject_str)
        if level_str:
            class_levels.add(level_str)

print(f"\nจำนวนครู: {len(teachers)}")
print(f"วิชา: {sorted(list(subjects))}")
print(f"ช่วงชั้น: {sorted(list(class_levels))}")

print("\n=== ครู 5 คนแรก ===")
for t in teachers[:5]:
    print(f"  {t['code']}: {t['teacher']} - {t['subject']} - {t['level']}")

# สร้างข้อมูล JSON สำหรับใช้ใน API
dropdown_data = {
    "teachers": [f"{t['teacher']}" for t in teachers],
    "subjects": sorted(list(subjects)),
    "class_levels": sorted(list(class_levels))
}

print("\n=== Dropdown Data (JSON) ===")
print(json.dumps(dropdown_data, ensure_ascii=False, indent=2))
