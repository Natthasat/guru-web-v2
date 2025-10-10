import pandas as pd
from pathlib import Path

REFERENCE_FILE = Path(__file__).parent / "data" / "ดิจิท.xlsx"

# ดูว่ามี sheet อะไรบ้าง
excel_file = pd.ExcelFile(REFERENCE_FILE)
print("Available sheets:", excel_file.sheet_names)

# อ่าน sheet แรก
df = pd.read_excel(REFERENCE_FILE, sheet_name=0)
print("\nColumns:", df.columns.tolist())
print("\nShape:", df.shape)
print("\nFirst 6 rows:")
print(df.head(6))
