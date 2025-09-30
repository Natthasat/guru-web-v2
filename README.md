# Guru Web - ระบบโจทย์-เฉลย (Question-Answer System)

## ภาพรวมโปรเจกต์

ระบบเว็บแอปพลิเคชันสำหรับจัดการโจทย์และเฉลย ประกอบด้วย Backend ที่ใช้ FastAPI + MySQL และ Frontend ที่ใช้ React + TailwindCSS

## โครงสร้างโปรเจกต์

```
guru-web/
├── backend/
│   ├── main.py                 # Entry point FastAPI
│   ├── database.py             # การเชื่อมต่อ MySQL + Session
│   ├── models.py               # ORM Schema (Questions, Solutions)
│   ├── requirements.txt        # Python dependencies
│   └── routes/
│       ├── __init__.py
│       ├── questions.py        # API สำหรับจัดการโจทย์
│       └── solutions.py        # API สำหรับจัดการเฉลย
├── frontend/
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── src/
│       ├── index.js
│       ├── index.css
│       ├── App.js              # Main App Component
│       └── pages/
│           ├── AdminAddQuestion.jsx   # ฟอร์มเพิ่มโจทย์
│           ├── AdminAddSolution.jsx   # ฟอร์มเพิ่มเฉลย
│           ├── StudentSearch.jsx      # หน้าค้นหาโจทย์+เฉลย
│           └── SolutionSearch.jsx     # หน้าค้นหาเฉลย (ใหม่)
└── README.md
```

## ฟีเจอร์หลัก

### Backend API Endpoints
- `POST /api/questions` - เพิ่มโจทย์ใหม่
- `POST /api/solutions` - เพิ่มเฉลยใหม่
- `GET /api/questions/{book_id}/{page}` - ดูโจทย์ทั้งหมดในหน้า
- `GET /api/solutions/{question_id}` - ดูเฉลยของโจทย์
- `GET /api/qa/{book_id}/{page}/{question_no}` - ดูโจทย์+เฉลยคู่กัน
- `GET /api/solutions/search?book_code=...&page=...&question_number=...` - ค้นหาเฉลยด้วยรหัสหนังสือ หน้า เลขข้อ (ใหม่)

### Frontend Pages
**หน้าหลัก (StudentSearch)**: ค้นหาโจทย์และเฉลย
**ค้นหาเฉลย (SolutionSearch)**: กรอกรหัสหนังสือ หน้า เลขข้อ เพื่อค้นหาเฉลยโดยตรง (ใหม่)
**เพิ่มโจทย์ (AdminAddQuestion)**: ฟอร์มสำหรับผู้ดูแลเพิ่มโจทย์
**เพิ่มเฉลย (AdminAddSolution)**: ฟอร์มสำหรับผู้ดูแลเพิ่มเฉลย

## การติดตั้งและรันโปรเจกต์

### 1. เตรียม Database (MySQL)

สร้าง database และ tables ใน MySQL:

```sql
CREATE DATABASE guru_DB;
USE guru_DB;

CREATE TABLE questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    book_id VARCHAR(50) NOT NULL,
    page INT NOT NULL,
    question_no INT NOT NULL,
    question_text TEXT,
    question_img VARCHAR(255)
) ENGINE=InnoDB;

CREATE TABLE solutions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question_id INT NOT NULL,
    answer_img VARCHAR(255),
    FOREIGN KEY (question_id) REFERENCES questions(id)
) ENGINE=InnoDB;
```

**หมายเหตุ:** แก้ไข username และ password ใน `backend/database.py` ให้ตรงกับ MySQL server ของคุณ:
```python
DATABASE_URL = "mysql+pymysql://your_username:your_password@localhost:3306/guru_DB"
```

### 2. Backend Setup

```bash
cd backend

# สร้าง virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# ติดตั้ง dependencies
pip install -r requirements.txt

# แก้ไข database.py ให้ตรงกับ MySQL credentials ของคุณ
# DATABASE_URL = "mysql+pymysql://username:password@localhost:3306/guru_DB"

# รันเซิร์ฟเวอร์
python main.py
```

เซิร์ฟเวอร์จะรันที่: http://localhost:8000
API Documentation: http://localhost:8000/docs

### 3. Frontend Setup

```bash
cd frontend

# ติดตั้ง dependencies
npm install

# รันโปรเจกต์
npm start
```

เว็บแอปจะรันที่: http://localhost:3000

## เทคโนโลยีที่ใช้

### Backend
- **FastAPI**: Web framework สำหรับ Python
- **SQLAlchemy**: ORM สำหรับ Python
- **PyMySQL**: MySQL connector สำหรับ Python
- **Uvicorn**: ASGI server
- **Pydantic**: Data validation

### Frontend
- **React**: JavaScript library สำหรับ UI
- **React Router**: Client-side routing
- **Axios**: HTTP client สำหรับเรียก API
- **TailwindCSS**: Utility-first CSS framework

### Database
- **MySQL**: Relational database

## การใช้งาน

### สำหรับผู้ดูแล (Admin)
1. **เพิ่มโจทย์**: ไปที่หน้า "เพิ่มโจทย์" กรอกข้อมูลโจทย์
2. **เพิ่มเฉลย**: ไปที่หน้า "เพิ่มเฉลย" ค้นหาโจทย์แล้วเพิ่มเฉลย

### สำหรับนักเรียน (Student)
1. **ค้นหาโจทย์**: ไปที่หน้าหลัก กรอกรหัสหนังสือ หน้า และข้อที่
2. **ค้นหาเฉลย**: ไปที่หน้า "ค้นหาเฉลย" กรอกรหัสหนังสือ หน้า เลขข้อ เพื่อดูเฉลยโดยตรง
3. **ดูผลลัพธ์**: ระบบจะแสดงโจทย์และเฉลย (ถ้ามี)

## หมายเหตุ

- รูปภาพใช้ URL จากภายนอก (ต้องเป็น URL ที่เข้าถึงได้)
- มีระบบค้นหาเฉลยแยกต่างหากสำหรับทดสอบข้อมูล
- สำหรับการใช้งานจริง ควรเพิ่มระบบอัปโหลดไฟล์
- ควรเพิ่มระบบยืนยันตัวตนสำหรับ Admin
- ควรเพิ่ม input validation และ error handling เพิ่มเติม