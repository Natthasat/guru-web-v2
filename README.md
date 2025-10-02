guru-web/
├── 📁 backend/                    # FastAPI Backend
│   ├── 📄 main.py                # Application entry point
│   ├── 📄 database.py            # Database connection & session
│   ├── 📄 models.py              # SQLAlchemy ORM models
│   ├── 📄 auth.py                # Authentication utilities
│   ├── 📄 requirements.txt       # Python dependencies
│   ├── 📄 Dockerfile             # Backend container config
│   ├── 📁 routes/                # API route modules
│   │   ├── 📄 auth.py           # Authentication endpoints
│   │   ├── 📄 questions.py      # Question management API
│   │   └── 📄 solutions.py      # Solution management API
│   └── 📁 uploads/               # File storage directory
├── 📁 frontend/                   # React Frontend
│   ├── 📄 package.json           # Node.js dependencies
│   ├── 📄 tailwind.config.js     # TailwindCSS configuration
│   ├── 📄 Dockerfile             # Frontend container config
│   ├── 📁 public/                # Static assets
│   └── 📁 src/                   # React source code
│       ├── 📄 App.js             # Main application component
│       ├── 📄 index.js           # Application entry point
│       ├── 📁 components/        # Reusable components
│       │   ├── 📄 Navigation.jsx # Navigation component
│       │   └── 📄 ProtectedRoute.jsx # Route protection
│       └── 📁 pages/             # Page components
│           ├── 📄 Login.jsx              # Admin login
│           ├── 📄 StudentSearch.jsx      # Student search interface
│           ├── 📄 SolutionSearch.jsx     # Solution search
│           ├── 📄 AdminAddQuestion.jsx   # Add questions
│           ├── 📄 AdminAddSolution.jsx   # Add solutions
│           ├── 📄 AdminManageQuestions.jsx # Manage questions
│           └── 📄 AdminManageSolutions.jsx # Manage solutions
├── 📄 docker-compose.yml         # Multi-container setup
├── 📄 DEPLOY.md                  # Deployment guide
└── 📄 README.md                  # Project documentation
git clone <repository-url>
docker-compose up -d
<!-- README.md ภาษาไทย สำหรับโปรเจค Guru Web -->

# Guru Web - ระบบจัดการโจทย์และเฉลย

ระบบเว็บแอปพลิเคชันสำหรับบริหารโจทย์และเฉลย เหมาะกับโรงเรียนหรือสถาบันการศึกษา พัฒนาโดยใช้ FastAPI (Python) สำหรับฝั่ง Backend และ React (JavaScript) สำหรับฝั่ง Frontend พร้อมระบบอัปโหลดไฟล์ รูปภาพ และระบบผู้ดูแล (Admin) ที่ปลอดภัย

---

## 📝 ภาพรวมโปรเจค (Project Overview)

Guru Web คือระบบที่ช่วยให้ผู้ดูแลสามารถเพิ่ม แก้ไข ลบ และค้นหาโจทย์/เฉลยได้อย่างสะดวก นักเรียนสามารถค้นหาโจทย์และเฉลยได้รวดเร็วผ่านหน้าเว็บ รองรับการอัปโหลดรูปภาพโจทย์และเฉลย มีระบบล็อกอินสำหรับผู้ดูแล และสามารถใช้งานผ่าน Docker ได้ทันที

---

## 🚩 ฟีเจอร์หลัก (Features)

- ระบบล็อกอินผู้ดูแล (JWT)
- เพิ่ม/แก้ไข/ลบ/ค้นหาโจทย์และเฉลย
- อัปโหลดรูปภาพโจทย์และเฉลย
- ค้นหาโจทย์และเฉลยด้วยรหัสหนังสือ หน้า ข้อที่
- แสดงผลโจทย์และเฉลยคู่กัน
- ระบบแยกหน้า Admin และ Student
- รองรับ React Router, TailwindCSS, Axios
- ใช้งานง่ายทั้ง Desktop และ Mobile
- รองรับ Docker Compose สำหรับ production

---

## 🗂️ โครงสร้างโฟลเดอร์ (Folder Structure)

```text
guru-web/
├── backend/                # โค้ดฝั่ง Backend (FastAPI)
│   ├── main.py             # จุดเริ่มต้น API Server
│   ├── database.py         # การเชื่อมต่อฐานข้อมูล MySQL
│   ├── models.py           # ORM Models (Questions, Solutions, Users)
│   ├── auth.py             # ฟังก์ชันเกี่ยวกับ Auth
│   ├── requirements.txt    # Python dependencies
│   ├── Dockerfile          # สำหรับ build backend container
│   ├── routes/             # API route modules
│   │   ├── auth.py
│   │   ├── questions.py
│   │   └── solutions.py
│   └── uploads/            # เก็บไฟล์รูปภาพ
├── frontend/               # โค้ดฝั่ง Frontend (React)
│   ├── package.json
│   ├── tailwind.config.js
│   ├── Dockerfile
│   ├── public/
│   └── src/
│       ├── App.js
│       ├── index.js
│       ├── components/
│       │   ├── Navigation.jsx
│       │   └── ProtectedRoute.jsx
│       └── pages/
│           ├── Login.jsx
│           ├── AdminDashboard.jsx
│           ├── AdminAddQuestion.jsx
│           ├── AdminAddSolution.jsx
│           ├── AdminManageQuestions.jsx
│           ├── AdminManageSolutions.jsx
│           ├── StudentSearch.jsx
│           └── SolutionSearch.jsx
├── docker-compose.yml      # สำหรับรันทุก container พร้อมกัน
├── DEPLOY.md               # คู่มือ deploy production
└── README.md               # คู่มือโปรเจคนี้
```

---

## ⚙️ การติดตั้ง (Installation)

### 1. เตรียมฐานข้อมูล MySQL

```sql
CREATE DATABASE guru_DB;
USE guru_DB;
-- ตารางจะถูกสร้างอัตโนมัติเมื่อรัน backend ครั้งแรก
```

### 2. ติดตั้งและรัน Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # (Windows) หรือ source venv/bin/activate (Linux/Mac)
pip install -r requirements.txt
# แก้ไข DATABASE_URL ใน database.py ให้ตรงกับ MySQL ของคุณ
python main.py
# API Docs: http://localhost:8000/docs
```

### 3. ติดตั้งและรัน Frontend

```bash
cd frontend
npm install
npm start
# เปิด http://localhost:3000
```

### 4. (ทางเลือก) ใช้งานผ่าน Docker Compose

```bash
docker-compose up -d
# Backend: http://localhost:8000  |  Frontend: http://localhost:3000
```

---

## 🧑‍� วิธีใช้งาน (Usage)

### สำหรับผู้ดูแล (Admin)
1. ล็อกอินด้วยบัญชีผู้ดูแล
2. เพิ่ม/แก้ไข/ลบโจทย์และเฉลยผ่านหน้า Admin
3. อัปโหลดรูปภาพโจทย์หรือเฉลยได้
4. ค้นหาโจทย์ด้วยรหัสหนังสือ หน้า ข้อที่

### สำหรับนักเรียน (Student)
1. ค้นหาโจทย์และเฉลยผ่านหน้า Student
2. กรอกรหัสหนังสือ หน้า ข้อที่ เพื่อดูเฉลย

### ตัวอย่างโค้ดเรียก API (ค้นหาโจทย์+เฉลย)

```js
// ตัวอย่างการเรียก API ด้วย axios
axios.get('http://localhost:8000/api/qa/IPL25122-0652/5/2')
  .then(res => console.log(res.data))
  .catch(err => console.error(err));
```

---

## 🔑 ตัวอย่าง Endpoint สำคัญ

- `POST /api/auth/login` — ล็อกอินผู้ดูแล
- `POST /api/questions` — เพิ่มโจทย์ใหม่
- `POST /api/solutions` — เพิ่มเฉลยใหม่
- `GET /api/questions/{book_id}/{page}` — ดูโจทย์ในแต่ละหน้า
- `GET /api/solutions/{question_id}` — ดูเฉลยของโจทย์
- `GET /api/qa/{book_id}/{page}/{question_no}` — ดูโจทย์+เฉลยคู่กัน

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

- **Backend:** FastAPI, SQLAlchemy, PyMySQL, Uvicorn, Pydantic
- **Frontend:** React, React Router, Axios, TailwindCSS
- **Database:** MySQL
- **DevOps:** Docker, Docker Compose

---

## � License

MIT License

---

## 🙏 ขอบคุณ

- FastAPI Community
- React Community
- Contributors ทุกท่าน

---

**สร้างด้วย ❤️ เพื่อการศึกษา**