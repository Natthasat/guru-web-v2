# 📚 Guru Web - ระบบจัดการโจทย์และเฉลยแบบ Many-to-Many

> ระบบเว็บแอปพลิเคชันสำหรับจัดการโจทย์และเฉลยอย่างยืดหยุ่น รองรับการเชื่อมโยงโจทย์กับเฉลยแบบ Many-to-Many พร้อมรูปภาพหลายรูปต่อเฉลย

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115.0-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql)](https://www.mysql.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📖 สารบัญ

- [ภาพรวมโปรเจค](#-ภาพรวมโปรเจค)
- [ฟีเจอร์หลัก](#-ฟีเจอร์หลัก)
- [สถาปัตยกรรมระบบ](#-สถาปัตยกรรมระบบ)
- [โครงสร้างฐานข้อมูล](#-โครงสร้างฐานข้อมูล)
- [การติดตั้ง](#-การติดตั้ง)
- [วิธีใช้งาน](#-วิธีใช้งาน)
- [API Documentation](#-api-documentation)
- [โครงสร้างโปรเจค](#-โครงสร้างโปรเจค)
- [เทคโนโลยีที่ใช้](#-เทคโนโลยีที่ใช้)
- [License](#-license)

---

## 🎯 ภาพรวมโปรเจค

**Guru Web** เป็นระบบจัดการโจทย์และเฉลยที่ออกแบบมาสำหรับสถาบันการศึกษา ด้วยสถาปัตยกรรม **Many-to-Many Relationship** ที่ทำให้:

- **โจทย์ 1 ข้อ สามารถมีหลายเฉลยได้** (เช่น วิธีแก้หลายแบบ)
- **เฉลย 1 ชุด สามารถใช้กับหลายโจทย์ได้** (เช่น เฉลยทั่วไปที่ใช้ซ้ำ)
- **เฉลย 1 ชุด สามารถมีรูปภาพหลายรูปได้** (Step-by-step solutions)

### 🌟 จุดเด่นของระบบ

1. **ความยืดหยุ่นสูง** - จัดการความสัมพันธ์ระหว่างโจทย์และเฉลยได้อย่างอิสระ
2. **รองรับรูปภาพหลายรูป** - แสดงขั้นตอนการทำโจทย์ได้ชัดเจน
3. **UI/UX สวยงาม** - ออกแบบด้วย TailwindCSS พร้อม Gradient และ Backdrop Effects
4. **ระบบค้นหารวดเร็ว** - ค้นหาด้วย Book ID, Page, Question Number
5. **Admin Panel ครบครัน** - จัดการข้อมูลได้ง่ายผ่าน Web Interface

---

## ✨ ฟีเจอร์หลัก

### 🔐 ระบบ Authentication
- ✅ Login ด้วย JWT Authentication
- ✅ Protected Routes สำหรับ Admin
- ✅ Session Management

### 📝 จัดการโจทย์ (Questions)
- ✅ เพิ่ม/แก้ไข/ลบโจทย์
- ✅ อัปโหลดรูปภาพโจทย์ (PNG, JPG, GIF)
- ✅ ค้นหาโจทย์ด้วย Book ID + Page + Question Number
- ✅ แสดงรายการโจทย์ทั้งหมดพร้อม Pagination

### ✅ จัดการเฉลย (Solutions) - Many-to-Many
- ✅ สร้างเฉลยแยกจากโจทย์ (Independent Solutions)
- ✅ อัปโหลดรูปภาพหลายรูปต่อเฉลย (Multiple Images per Solution)
- ✅ เชื่อมโยงโจทย์กับเฉลยแบบยืดหยุ่น (Link/Unlink)
- ✅ แสดงเฉลยทั้งหมดที่เชื่อมกับโจทย์
- ✅ เรียงลำดับรูปภาพ (Image Ordering)

### 🔍 ระบบค้นหา
- ✅ ค้นหาโจทย์ + เฉลยพร้อมกัน (`/api/qa/{book_id}/{page}/{question_no}`)
- ✅ แสดงผลโจทย์พร้อมเฉลยทุกชุดที่เกี่ยวข้อง
- ✅ รองรับการแสดงผลรูปภาพหลายรูป

### 🎨 User Interface
- ✅ Admin Dashboard - สถิติและฟอร์มค้นหา
- ✅ Student Search Page - หน้าค้นหาสำหรับนักเรียน
- ✅ Responsive Design - ใช้งานได้ทั้ง Mobile และ Desktop
- ✅ Beautiful Gradients - พื้นหลัง Gradient และ Glass Effect

---

## 🏗️ สถาปัตยกรรมระบบ

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Admin Pages  │  │ Student Page │  │  Components  │      │
│  │ - Dashboard  │  │ - Search     │  │ - Navigation │      │
│  │ - Add Q/S    │  │              │  │ - Protected  │      │
│  │ - Manage Q/S │  │              │  │   Route      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│            │                 │                 │             │
│            └─────────────────┴─────────────────┘             │
│                           │ Axios                            │
└───────────────────────────┼──────────────────────────────────┘
                            │
┌───────────────────────────┼──────────────────────────────────┐
│                    Backend (FastAPI)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Auth API    │  │ Questions API│  │ Solutions API│      │
│  │ - Login      │  │ - CRUD       │  │ - CRUD       │      │
│  │ - JWT        │  │ - Upload     │  │ - Upload     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│            │                 │                 │             │
│            └─────────────────┴─────────────────┘             │
│                           │ SQLAlchemy ORM                   │
└───────────────────────────┼──────────────────────────────────┘
                            │
┌───────────────────────────┼──────────────────────────────────┐
│                    Database (MySQL)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  questions   │←─┤question_     │─→│  solutions   │      │
│  │              │  │ solutions    │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                             ↓                │
│                                      ┌──────────────┐        │
│                                      │solution_     │        │
│                                      │ images       │        │
│                                      └──────────────┘        │
└──────────────────────────────────────────────────────────────┘
```

---

## 🗄️ โครงสร้างฐานข้อมูล

### Entity Relationship Diagram

```
┌─────────────────┐
│   questions     │
├─────────────────┤
│ id (PK)         │
│ book_id         │
│ page            │
│ question_no     │
│ question_text   │
│ question_img    │
│ created_at      │
└────────┬────────┘
         │ 1
         │
         │ N
┌────────┴────────────┐
│ question_solutions  │ (Mapping Table)
├─────────────────────┤
│ id (PK)             │
│ question_id (FK)    │
│ solution_id (FK)    │
│ created_at          │
└────────┬────────────┘
         │ N
         │
         │ 1
┌────────┴────────┐         ┌─────────────────┐
│   solutions     │────────→│ solution_images │
├─────────────────┤    1:N  ├─────────────────┤
│ id (PK)         │         │ id (PK)         │
│ title           │         │ solution_id (FK)│
│ answer_text     │         │ image_path      │
│ created_at      │         │ image_order     │
│ updated_at      │         │ created_at      │
└─────────────────┘         └─────────────────┘
```

### ตารางข้อมูลหลัก

#### `questions` - ตารางโจทย์
| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK) | รหัสโจทย์ |
| book_id | VARCHAR(50) | รหัสหนังสือ |
| page | INT | หน้าหนังสือ |
| question_no | INT | ข้อที่ |
| question_text | TEXT | ข้อความโจทย์ |
| question_img | VARCHAR(255) | ไฟล์รูปโจทย์ |
| created_at | TIMESTAMP | วันที่สร้าง |

#### `solutions` - ตารางเฉลย
| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK) | รหัสเฉลย |
| title | VARCHAR(255) | ชื่อเฉลย |
| answer_text | TEXT | ข้อความเฉลย |
| created_at | TIMESTAMP | วันที่สร้าง |
| updated_at | TIMESTAMP | วันที่แก้ไข |

#### `solution_images` - ตารางรูปภาพเฉลย
| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK) | รหัสรูปภาพ |
| solution_id | INT (FK) | รหัสเฉลย |
| image_path | VARCHAR(255) | ไฟล์รูปภาพ |
| image_order | INT | ลำดับการแสดง |
| created_at | TIMESTAMP | วันที่อัปโหลด |

#### `question_solutions` - ตารางเชื่อมโยง (Mapping)
| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK) | รหัส |
| question_id | INT (FK) | รหัสโจทย์ |
| solution_id | INT (FK) | รหัสเฉลย |
| created_at | TIMESTAMP | วันที่เชื่อม |

---

## 🚀 การติดตั้ง

### ✅ ความต้องการของระบบ

- Python 3.10+
- Node.js 16+
- MySQL 8.0+
- Git

### 📥 1. Clone Repository

```bash
git clone https://github.com/Natthasat/idealguru.git
cd guru-web
```

### 🗄️ 2. ตั้งค่าฐานข้อมูล MySQL

```sql
CREATE DATABASE guru_DB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

แก้ไขไฟล์ `backend/database.py`:

```python
DATABASE_URL = "mysql+pymysql://root:yourpassword@localhost:3306/guru_DB"
```

### ⚙️ 3. ติดตั้ง Backend

```bash
cd backend

# สร้าง Virtual Environment
python -m venv venv

# เปิดใช้งาน venv
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# ติดตั้ง Dependencies
pip install -r requirements.txt

# รัน Backend Server
python main.py
```

Backend จะรันที่ `http://localhost:8000`  
API Docs: `http://localhost:8000/docs`

### 🎨 4. ติดตั้ง Frontend

```bash
cd frontend

# ติดตั้ง Dependencies
npm install

# รัน Development Server
npm start
```

Frontend จะรันที่ `http://localhost:3000`

### 🐳 5. (ทางเลือก) ใช้ Docker Compose

```bash
# รันทั้งระบบด้วยคำสั่งเดียว
docker-compose up -d

# ตรวจสอบ logs
docker-compose logs -f

# หยุดระบบ
docker-compose down
```

---

## 📘 วิธีใช้งาน

### 👨‍💼 สำหรับผู้ดูแล (Admin)

#### 1. เข้าสู่ระบบ

- ไปที่ `http://localhost:3000`
- Login ด้วยบัญชี admin
- (Default: สร้างผ่าน `backend/create_admin.py`)

#### 2. เพิ่มโจทย์

```
Admin Dashboard → เพิ่มโจทย์
- กรอก Book ID, Page, Question No
- (Optional) เพิ่มข้อความโจทย์
- (Optional) อัปโหลดรูปภาพโจทย์
- คลิก "เพิ่มโจทย์"
```

#### 3. เพิ่มเฉลย (แบบใหม่ Many-to-Many)

```
Admin Dashboard → เพิ่มเฉลย
- กรอกชื่อเฉลย (Optional)
- กรอกข้อความเฉลย
- อัปโหลดรูปภาพหลายรูป (สูงสุด 5 รูป)
- คลิก "บันทึกเฉลย"
```

#### 4. เชื่อมโยงโจทย์กับเฉลย

```
Admin Dashboard → เชื่อมโจทย์-เฉลย
- เลือกโจทย์จากรายการซ้าย
- เลือกเฉลยจากรายการขวา
- คลิก "เชื่อมโยง"
```

#### 5. จัดการโจทย์/เฉลย

```
Admin Dashboard → จัดการโจทย์/จัดการเฉลย
- ดูรายการทั้งหมด
- แก้ไข/ลบ ข้อมูล
- ค้นหาด้วย Search Bar
```

### 👨‍🎓 สำหรับนักเรียน (Student)

#### ค้นหาโจทย์และเฉลย

```
1. ไปที่ /student/search หรือใช้ฟอร์มค้นหาในหน้า Admin
2. กรอก:
   - Book ID: เช่น IPL25122-0652
   - Page: เช่น 5
   - Question No: เช่น 2
3. คลิก "ค้นหา"
4. ระบบจะแสดง:
   - โจทย์พร้อมรูปภาพ (ถ้ามี)
   - เฉลยทุกชุดที่เกี่ยวข้อง
   - รูปภาพเฉลยทุกรูป (เรียงตาม order)
```

---

## 📡 API Documentation

### Authentication

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password"
}

Response: { "access_token": "...", "token_type": "bearer" }
```

### Questions API

#### เพิ่มโจทย์
```http
POST /api/questions
Content-Type: multipart/form-data

book_id: string
page: integer
question_no: integer
question_text: string (optional)
question_img: file (optional)
```

#### ดูโจทย์ทั้งหมด
```http
GET /api/questions
```

#### ลบโจทย์
```http
DELETE /api/questions/{question_id}
```

### Solutions API (Many-to-Many)

#### สร้างเฉลยใหม่
```http
POST /api/solutions
Content-Type: multipart/form-data

title: string (optional)
answer_text: string
```

#### อัปโหลดรูปภาพเฉลย
```http
POST /api/solutions/{solution_id}/images
Content-Type: multipart/form-data

images: file[] (multiple files)
```

#### เชื่อมโยงโจทย์กับเฉลย
```http
POST /api/questions/{question_id}/solutions/{solution_id}
```

#### ยกเลิกการเชื่อมโยง
```http
DELETE /api/questions/{question_id}/solutions/{solution_id}
```

#### ดูเฉลยทั้งหมด
```http
GET /api/solutions
```

### Combined Query

#### ค้นหาโจทย์ + เฉลยพร้อมกัน
```http
GET /api/qa/{book_id}/{page}/{question_no}

Example: GET /api/qa/IPL25122-0652/5/2

Response:
{
  "id": 1,
  "book_id": "IPL25122-0652",
  "page": 5,
  "question_no": 2,
  "question_text": "...",
  "question_img": "uploads/xxx.png",
  "solutions": [
    {
      "id": 1,
      "title": "วิธีที่ 1",
      "answer_text": "...",
      "images": [
        {
          "id": 1,
          "image_path": "uploads/yyy.png",
          "image_order": 0
        },
        {
          "id": 2,
          "image_path": "uploads/zzz.png",
          "image_order": 1
        }
      ]
    }
  ]
}
```

### ตัวอย่างการเรียกใช้ด้วย JavaScript

```javascript
// ค้นหาโจทย์และเฉลย
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// ค้นหา
async function searchQuestion(bookId, page, questionNo) {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/qa/${bookId}/${page}/${questionNo}`
    );
    console.log('Question:', response.data);
    console.log('Solutions:', response.data.solutions);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

// เพิ่มโจทย์
async function addQuestion(formData) {
  const data = new FormData();
  data.append('book_id', formData.book_id);
  data.append('page', formData.page);
  data.append('question_no', formData.question_no);
  if (formData.question_text) data.append('question_text', formData.question_text);
  if (formData.question_img) data.append('question_img', formData.question_img);

  const response = await axios.post(`${API_BASE_URL}/questions`, data);
  return response.data;
}

// เพิ่มเฉลยพร้อมรูปหลายรูป
async function addSolutionWithImages(solutionData, images) {
  // 1. สร้างเฉลย
  const solutionResponse = await axios.post(`${API_BASE_URL}/solutions`, solutionData);
  const solutionId = solutionResponse.data.id;

  // 2. อัปโหลดรูปภาพ
  const imageFormData = new FormData();
  images.forEach(image => imageFormData.append('images', image));
  await axios.post(`${API_BASE_URL}/solutions/${solutionId}/images`, imageFormData);

  return solutionId;
}

// เชื่อมโยงโจทย์กับเฉลย
async function linkQuestionToSolution(questionId, solutionId) {
  const response = await axios.post(
    `${API_BASE_URL}/questions/${questionId}/solutions/${solutionId}`
  );
  return response.data;
}

// ใช้งาน
searchQuestion('IPL25122-0652', 5, 2);
```

---

## 📂 โครงสร้างโปรเจค

```
guru-web/
├── 📁 backend/                     # FastAPI Backend
│   ├── 📄 main.py                 # Application entry point
│   ├── 📄 database.py             # Database connection & session
│   ├── 📄 models.py               # SQLAlchemy ORM models (Many-to-Many)
│   ├── 📄 auth.py                 # JWT Authentication
│   ├── 📄 create_admin.py         # Script สร้าง admin user
│   ├── 📄 requirements.txt        # Python dependencies
│   ├── 📄 Dockerfile              # Backend container config
│   ├── 📄 migrate_to_many_to_many.py    # Migration script
│   ├── 📄 fix_question_solutions_table.py
│   ├── 📄 fix_solution_images_table.py
│   ├── 📁 routes/                 # API route modules
│   │   ├── 📄 __init__.py
│   │   ├── 📄 auth.py            # Authentication endpoints
│   │   ├── 📄 questions.py       # Question CRUD API
│   │   └── 📄 solutions.py       # Solution CRUD API (Many-to-Many)
│   └── 📁 uploads/                # File storage (images)
│
├── 📁 frontend/                    # React Frontend
│   ├── 📄 package.json            # Node.js dependencies
│   ├── 📄 tailwind.config.js      # TailwindCSS config
│   ├── 📄 postcss.config.js
│   ├── 📄 Dockerfile              # Frontend container config
│   ├── 📁 public/
│   │   └── 📄 index.html
│   └── 📁 src/
│       ├── 📄 App.js              # Main application & routing
│       ├── 📄 index.js            # Entry point
│       ├── 📄 index.css           # Global styles
│       ├── 📁 components/
│       │   ├── 📄 Navigation.jsx      # Navigation bar
│       │   └── 📄 ProtectedRoute.jsx  # Route protection HOC
│       └── 📁 pages/
│           ├── 📄 Login.jsx                    # Admin login page
│           ├── 📄 AdminDashboard.jsx           # Admin dashboard
│           ├── 📄 AdminAddQuestion.jsx         # Add questions
│           ├── 📄 AdminManageQuestions.jsx     # Manage questions
│           ├── 📄 AdminAddSolution.jsx         # Add solutions (old)
│           ├── 📄 AdminAddSolutionNew.jsx      # Add solutions (new M2M)
│           ├── 📄 AdminLinkQuestionSolution.jsx # Link Q&S
│           ├── 📄 AdminManageSolutions.jsx     # Manage solutions
│           ├── 📄 StudentSearch.jsx            # Student search page
│           └── 📄 SolutionSearch.jsx           # Solution search
│
├── 📄 docker-compose.yml           # Multi-container orchestration
├── 📄 DEPLOY.md                    # Deployment guide
├── 📄 MIGRATION_GUIDE.md           # Many-to-Many migration guide
├── 📄 README.md                    # This file
└── 📄 .gitignore
```

---

## 🛠️ เทคโนโลยีที่ใช้

### Backend
- **[FastAPI](https://fastapi.tiangolo.com/)** `0.115.0` - Modern Python web framework
- **[SQLAlchemy](https://www.sqlalchemy.org/)** `2.0.36` - ORM for database operations
- **[PyMySQL](https://pymysql.readthedocs.io/)** `1.1.1` - MySQL connector
- **[PyJWT](https://pyjwt.readthedocs.io/)** - JWT authentication
- **[Passlib](https://passlib.readthedocs.io/)** - Password hashing
- **[Python-Multipart](https://andrew-d.github.io/python-multipart/)** - File upload support
- **[Uvicorn](https://www.uvicorn.org/)** - ASGI server

### Frontend
- **[React](https://reactjs.org/)** `18.2.0` - UI library
- **[React Router](https://reactrouter.com/)** `6.18.0` - Client-side routing
- **[Axios](https://axios-http.com/)** `1.6.2` - HTTP client
- **[TailwindCSS](https://tailwindcss.com/)** `3.3.5` - Utility-first CSS framework

### Database
- **[MySQL](https://www.mysql.com/)** `8.0+` - Relational database
- **Many-to-Many Architecture** - Flexible relationship management

### DevOps
- **[Docker](https://www.docker.com/)** - Containerization
- **[Docker Compose](https://docs.docker.com/compose/)** - Multi-container orchestration

---

## 🔧 การพัฒนาเพิ่มเติม

### Migration จาก 1:1 เป็น Many-to-Many

หากมีข้อมูลเก่าในระบบ สามารถใช้ Migration Script:

```bash
cd backend
python migrate_to_many_to_many.py
```

Script นี้จะ:
1. สำรองข้อมูลเก่าใน `solutions_backup`
2. สร้างตาราง `solutions`, `solution_images`, `question_solutions` ใหม่
3. แปลงข้อมูลเก่าเป็นรูปแบบใหม่
4. ลบตารางเก่าและเปลี่ยนชื่อตารางใหม่

ดูรายละเอียดเพิ่มเติมใน `MIGRATION_GUIDE.md`

### การแก้ไขปัญหาที่พบบ่อย

#### ปัญหา: ตาราง question_solutions ไม่มี id
```bash
python backend/fix_question_solutions_table.py
```

#### ปัญหา: ตาราง solution_images มีโครงสร้างผิด
```bash
python backend/fix_solution_images_table.py
```

---

## 📄 License

MIT License

Copyright (c) 2025 Guru Web Project

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

## 🙏 ขอบคุณ

- [FastAPI](https://fastapi.tiangolo.com/) - Amazing Python web framework
- [React](https://reactjs.org/) - Powerful UI library
- [TailwindCSS](https://tailwindcss.com/) - Beautiful utility-first CSS
- [SQLAlchemy](https://www.sqlalchemy.org/) - The Python SQL toolkit

---

## 👥 ผู้พัฒนา

- **GitHub:** [Natthasat](https://github.com/Natthasat)
- **Repository:** [idealguru](https://github.com/Natthasat/idealguru)

---

## 📞 ติดต่อ & สนับสนุน

หากพบปัญหาหรือมีข้อเสนอแนะ:
- 🐛 **Bug Reports:** [GitHub Issues](https://github.com/Natthasat/idealguru/issues)
- 💡 **Feature Requests:** [GitHub Discussions](https://github.com/Natthasat/idealguru/discussions)

---

<div align="center">

### ⭐ ถ้าโปรเจคนี้มีประโยชน์ อย่าลืมกด Star ด้วยนะ! ⭐

**สร้างด้วย ❤️ เพื่อการศึกษา**

</div>