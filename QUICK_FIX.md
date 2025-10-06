# 📋 Quick Summary - Bug Report

## 🔴 Critical Issues (ควรแก้ไขทันที)

1. **`backend/auth.py`** - ไฟล์ซ้ำ ❌ ลบทิ้ง (ใช้ `backend/routes/auth.py` แทน)
2. **`backend/backend/uploads/`** - Path ผิด ❌ ย้ายไฟล์ไป `backend/uploads/`
3. **`StudentSearch.jsx.backup`** - Backup file ❌ ลบทิ้ง

## 🟡 Should Fix (ปรับปรุงโครงสร้าง)

4. **Migration scripts** - กระจัดกระจาย 📦 ย้ายไป `backend/migrations/`
5. **`guru_web.db`** - SQLite เก่า 🗄️ ลบทิ้ง (ใช้ MySQL แล้ว)
6. **`uploads/` in root** - โฟลเดอร์ไม่ใช้ 📁 ตรวจสอบและลบ

## ✅ Quick Fix

```powershell
# วิธีที่ 1: รันสคริปต์อัตโนมัติ (แนะนำ)
.\cleanup.ps1

# วิธีที่ 2: ลบทีละไฟล์
Remove-Item "frontend\src\pages\StudentSearch.jsx.backup"
Remove-Item "backend\auth.py"
Remove-Item "guru_web.db"
```

## 📖 Full Report

ดูรายละเอียดครบใน: **BUG_REPORT.md**
