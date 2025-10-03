# คู่มือ Migration: 1:1 → Many-to-Many

## 📋 Overview

เอกสารนี้อธิบายขั้นตอนการอัพเดทระบบจากโครงสร้าง 1:1 (Question ↔ Solution) เป็น Many-to-Many

---

## 🔄 ขั้นตอนการ Migration

### 1. สำรองข้อมูล

```bash
# สำรองฐานข้อมูลก่อน migration
mysqldump -u username -p guru_DB > guru_DB_backup.sql
```

### 2. รัน Migration Script

```bash
cd backend
python migrate_to_many_to_many.py
```

Script จะทำการ:
- สำรองตาราง `solutions` เดิมเป็น `solutions_backup`
- สร้างตารางใหม่: `solutions`, `solution_images`, `question_solutions`
- แปลงข้อมูลเก่าให้เข้าโครงสร้างใหม่
- ลบตารางเก่าและเปลี่ยนชื่อตารางใหม่

### 3. อัพเดท Backend Routes

```bash
# แทนที่ไฟล์เก่า
mv backend/routes/solutions.py backend/routes/solutions_old.py
mv backend/routes/solutions_new.py backend/routes/solutions.py
```

### 4. รีสตาร์ท Backend Server

```bash
cd backend
python main.py
```

### 5. อัพเดท Frontend

ไฟล์ใหม่ที่ถูกสร้าง:
- `AdminAddSolutionNew.jsx` - เพิ่มเฉลยแบบใหม่ (รองรับหลายรูป)
- `AdminLinkQuestionSolution.jsx` - เชื่อมโจทย์กับเฉลย

```bash
cd frontend
npm start
```

---

## 📊 โครงสร้างฐานข้อมูลใหม่

### ตาราง `solutions`
```sql
CREATE TABLE solutions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    answer_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### ตาราง `solution_images`
```sql
CREATE TABLE solution_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    solution_id INT NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    image_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (solution_id) REFERENCES solutions(id) ON DELETE CASCADE
);
```

### ตาราง `question_solutions`
```sql
CREATE TABLE question_solutions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question_id INT NOT NULL,
    solution_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    FOREIGN KEY (solution_id) REFERENCES solutions(id) ON DELETE CASCADE,
    UNIQUE KEY unique_question_solution (question_id, solution_id)
);
```

---

## 🔌 API Endpoints ใหม่

### สร้างเฉลย
```
POST /api/solutions
Body (form-data):
  - title: string (optional)
  - answer_text: string
```

### อัปโหลดรูปภาพ
```
POST /api/solutions/{solution_id}/images
Body (form-data):
  - images: file[] (multiple files)
```

### เชื่อมโจทย์กับเฉลย
```
POST /api/questions/{question_id}/solutions/{solution_id}
```

### ยกเลิกการเชื่อม
```
DELETE /api/questions/{question_id}/solutions/{solution_id}
```

### ดูเฉลยของโจทย์
```
GET /api/questions/{question_id}/solutions
```

### ดูโจทย์พร้อมเฉลยทั้งหมด
```
GET /api/qa/{book_id}/{page}/{question_no}

Response:
{
  "question": {...},
  "solutions": [
    {
      "id": 1,
      "title": "...",
      "answer_text": "...",
      "images": [
        {"id": 1, "image_path": "uploads/...", "image_order": 0},
        {"id": 2, "image_path": "uploads/...", "image_order": 1}
      ]
    }
  ]
}
```

---

## 💡 ตัวอย่างการใช้งาน

### 1. สร้างเฉลยใหม่

```javascript
const formData = new FormData();
formData.append('title', 'วิธีทำข้อ 1-5');
formData.append('answer_text', 'คำตอบ...');

const response = await axios.post('http://localhost:8000/api/solutions', formData);
const solutionId = response.data.id;
```

### 2. อัปโหลดรูปภาพ

```javascript
const imageFormData = new FormData();
imageFormData.append('images', file1);
imageFormData.append('images', file2);
imageFormData.append('images', file3);

await axios.post(
  `http://localhost:8000/api/solutions/${solutionId}/images`,
  imageFormData
);
```

### 3. เชื่อมโจทย์กับเฉลย

```javascript
await axios.post(
  `http://localhost:8000/api/questions/${questionId}/solutions/${solutionId}`
);
```

### 4. Query โจทย์พร้อมเฉลย

```javascript
const response = await axios.get(
  'http://localhost:8000/api/qa/IPL25122-0652/5/2'
);

console.log(response.data.question);
console.log(response.data.solutions); // Array of solutions
```

---

## ✅ Checklist

- [ ] สำรองฐานข้อมูล
- [ ] รัน migration script
- [ ] ตรวจสอบตารางใหม่ถูกสร้างครบ
- [ ] อัพเดท backend routes
- [ ] รีสตาร์ท backend server
- [ ] ทดสอบ API endpoints
- [ ] อัพเดท frontend components
- [ ] ทดสอบการเพิ่มเฉลย
- [ ] ทดสอบการอัปโหลดรูปหลายรูป
- [ ] ทดสอบการเชื่อมโจทย์กับเฉลย
- [ ] ทดสอบ query โจทย์พร้อมเฉลย

---

## 🐛 Troubleshooting

### ปัญหา: Foreign Key Constraint Failed
```sql
-- ตรวจสอบ FK constraints
SHOW CREATE TABLE question_solutions;

-- ถ้าจำเป็น ลบ FK เก่า
ALTER TABLE solutions DROP FOREIGN KEY solutions_ibfk_1;
```

### ปัญหา: ข้อมูลเก่าหายไป
```sql
-- กู้คืนจาก backup table
SELECT * FROM solutions_backup;
```

### ปัญหา: รูปภาพไม่แสดง
```bash
# ตรวจสอบ permission
chmod 755 backend/uploads

# ตรวจสอบ path
ls -la backend/uploads/
```

---

## 📞 Support

หากมีปัญหา กรุณาตรวจสอบ:
1. Log ของ migration script
2. Backend console logs
3. Browser Developer Tools (Network tab)
4. ข้อมูลในตาราง `solutions_backup` (สำรองข้อมูล)
