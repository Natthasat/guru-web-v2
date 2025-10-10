from excel_dropdown_service import get_dropdown_options_from_excel
import json

print("=== Testing Excel Dropdown Service ===\n")

options = get_dropdown_options_from_excel()

print(f"Teachers: {len(options['teachers'])} คน")
print(f"Subjects: {len(options['subjects'])} วิชา")
print(f"Class Levels: {len(options['class_levels'])} ระดับ")
print(f"Course Types: {len(options['course_types'])} ชนิด")
print(f"File Types: {len(options['file_types'])} ประเภท")
print(f"Content Levels: {len(options['content_levels'])} ระดับ")
print(f"Years: {len(options['years'])} ปี")

print("\n=== Full Data ===")
print(json.dumps(options, ensure_ascii=False, indent=2))
