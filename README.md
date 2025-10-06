# 📚 Guru Web - ระบบจัดการโจทย์และเฉลยแบบ Many-to-Many# 📚 Guru Web - ระบบจัดการโจทย์และเฉลยแบบ Many-to-Many



> ระบบเว็บแอปพลิเคชันสำหรับจัดการโจทย์และเฉลยอย่างยืดหยุ่น รองรับการเชื่อมโยงโจทย์กับเฉลยแบบ Many-to-Many พร้อมรูปภาพหลายรูปต่อเฉลย> ระบบเว็บแอปพลิเคชันสำหรับจัดการโจทย์และเฉลยอย่างยืดหยุ่น รองรับการเชื่อมโยงโจทย์กับเฉลยแบบ Many-to-Many พร้อมรูปภาพหลายรูปต่อเฉลย



[![FastAPI](https://img.shields.io/badge/FastAPI-0.115.0-009688?logo=fastapi)](https://fastapi.tiangolo.com/)[![FastAPI](https://img.shields.io/badge/FastAPI-0.115.0-009688?logo=fastapi)](https://fastapi.tiangolo.com/)

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)](https://reactjs.org/)[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)](https://reactjs.org/)

[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql)](https://www.mysql.com/)[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql)](https://www.mysql.com/)

[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

---

## 📖 สารบัญ

## 📖 สารบัญ

- [ภาพรวมโปรเจค](#-ภาพรวมโปรเจค)

- [ฟีเจอร์หลัก](#-ฟีเจอร์หลัก)- [ภาพรวมโปรเจค](#-ภาพรวมโปรเจค)

- [สถาปัตยกรรมระบบ](#-สถาปัตยกรรมระบบ)- [ฟีเจอร์หลัก](#-ฟีเจอร์หลัก)

- [โครงสร้างฐานข้อมูล](#-โครงสร้างฐานข้อมูล)- [สถาปัตยกรรมระบบ](#-สถาปัตยกรรมระบบ)

- [การติดตั้ง](#-การติดตั้ง)- [โครงสร้างฐานข้อมูล](#-โครงสร้างฐานข้อมูล)

- [วิธีใช้งาน](#-วิธีใช้งาน)- [การติดตั้ง](#-การติดตั้ง)

- [API Documentation](#-api-documentation)- [วิธีใช้งาน](#-วิธีใช้งาน)

- [โครงสร้างโปรเจค](#-โครงสร้างโปรเจค)- [API Documentation](#-api-documentation)

- [เทคโนโลยีที่ใช้](#-เทคโนโลยีที่ใช้)- [โครงสร้างโปรเจค](#-โครงสร้างโปรเจค)

- [การแก้ปัญหา](#-การแก้ปัญหา)- [เทคโนโลยีที่ใช้](#-เทคโนโลยีที่ใช้)

- [License](#-license)- [License](#-license)



------



## 🎯 ภาพรวมโปรเจค## 🎯 ภาพรวมโปรเจค



**Guru Web** เป็นระบบจัดการโจทย์และเฉลยที่ออกแบบมาสำหรับสถาบันการศึกษา ด้วยสถาปัตยกรรม **Many-to-Many Relationship** ที่ทำให้:**Guru Web** เป็นระบบจัดการโจทย์และเฉลยที่ออกแบบมาสำหรับสถาบันการศึกษา ด้วยสถาปัตยกรรม **Many-to-Many Relationship** ที่ทำให้:



- ✅ **โจทย์ 1 ข้อ สามารถมีหลายเฉลยได้** (เช่น วิธีแก้หลายแบบ)- **โจทย์ 1 ข้อ สามารถมีหลายเฉลยได้** (เช่น วิธีแก้หลายแบบ)

- ✅ **เฉลย 1 ชุด สามารถใช้กับหลายโจทย์ได้** (เช่น เฉลยทั่วไปที่ใช้ซ้ำ)- **เฉลย 1 ชุด สามารถใช้กับหลายโจทย์ได้** (เช่น เฉลยทั่วไปที่ใช้ซ้ำ)

- ✅ **เฉลย 1 ชุด สามารถมีรูปภาพหลายรูปได้** (Step-by-step solutions)- **เฉลย 1 ชุด สามารถมีรูปภาพหลายรูปได้** (Step-by-step solutions)



### 🌟 จุดเด่นของระบบ### 🌟 จุดเด่นของระบบ



- 🔐 **ระบบ Authentication** - Login ด้วย JWT, Protected Routes1. **ความยืดหยุ่นสูง** - จัดการความสัมพันธ์ระหว่างโจทย์และเฉลยได้อย่างอิสระ

- 🎨 **UI/UX สวยงาม** - TailwindCSS พร้อม Gradient และ Glass Effects2. **รองรับรูปภาพหลายรูป** - แสดงขั้นตอนการทำโจทย์ได้ชัดเจน

- 🔍 **ค้นหารวดเร็ว** - ค้นหาด้วย Book ID + Page + Question Number3. **UI/UX สวยงาม** - ออกแบบด้วย TailwindCSS พร้อม Gradient และ Backdrop Effects

- 📱 **Responsive Design** - ใช้งานได้ทั้ง Desktop และ Mobile4. **ระบบค้นหารวดเร็ว** - ค้นหาด้วย Book ID, Page, Question Number

- 🖼️ **รองรับรูปหลายรูป** - แสดงขั้นตอนการทำโจทย์แบบละเอียด5. **Admin Panel ครบครัน** - จัดการข้อมูลได้ง่ายผ่าน Web Interface



------



## ✨ ฟีเจอร์หลัก## ✨ ฟีเจอร์หลัก



### 🔐 ระบบ Authentication### 🔐 ระบบ Authentication

- ✅ เข้าสู่ระบบด้วย JWT (JSON Web Tokens)- ✅ Login ด้วย JWT Authentication

- ✅ Protected Routes สำหรับหน้า Admin- ✅ Protected Routes สำหรับ Admin

- ✅ ออกจากระบบพร้อมลบ Session- ✅ Session Management

- ✅ ตรวจสอบสิทธิ์อัตโนมัติ

### 📝 จัดการโจทย์ (Questions)

### 📝 จัดการโจทย์ (Questions)- ✅ เพิ่ม/แก้ไข/ลบโจทย์

- ✅ เพิ่มโจทย์พร้อมรูปภาพ (PNG, JPG, GIF)- ✅ อัปโหลดรูปภาพโจทย์ (PNG, JPG, GIF)

- ✅ แก้ไขข้อมูลโจทย์- ✅ ค้นหาโจทย์ด้วย Book ID + Page + Question Number

- ✅ ลบโจทย์ (Cascade delete เฉลยที่เชื่อมโยง)- ✅ แสดงรายการโจทย์ทั้งหมดพร้อม Pagination

- ✅ ค้นหาด้วย Book ID, Page, Question Number

- ✅ แสดงรายการโจทย์พร้อมสถานะ (มีเฉลยหรือยัง)### ✅ จัดการเฉลย (Solutions) - Many-to-Many

- ✅ สร้างเฉลยแยกจากโจทย์ (Independent Solutions)

### ✅ จัดการเฉลย (Solutions) - Many-to-Many- ✅ อัปโหลดรูปภาพหลายรูปต่อเฉลย (Multiple Images per Solution)

- ✅ สร้างเฉลยแยกจากโจทย์ (Independent)- ✅ เชื่อมโยงโจทย์กับเฉลยแบบยืดหยุ่น (Link/Unlink)

- ✅ อัปโหลดรูปภาพหลายรูปต่อเฉลย (สูงสุด 5 รูป)- ✅ แสดงเฉลยทั้งหมดที่เชื่อมกับโจทย์

- ✅ เรียงลำดับรูปภาพ (Order numbering)- ✅ เรียงลำดับรูปภาพ (Image Ordering)

- ✅ เชื่อมโยงโจทย์กับเฉลยแบบยืดหยุ่น

- ✅ ยกเลิกการเชื่อมโยง (Unlink)### 🔍 ระบบค้นหา

- ✅ แสดงโจทย์ที่เชื่อมกับเฉลยแต่ละชุด- ✅ ค้นหาโจทย์ + เฉลยพร้อมกัน (`/api/qa/{book_id}/{page}/{question_no}`)

- ✅ แสดงผลโจทย์พร้อมเฉลยทุกชุดที่เกี่ยวข้อง

### 🔗 ระบบเชื่อมโยง (Link Management)- ✅ รองรับการแสดงผลรูปภาพหลายรูป

- ✅ หน้าเชื่อมโยงโจทย์-เฉลยแบบ Visual

- ✅ แสดงรูปตัวอย่างขณะเลือก (Live Preview)### 🎨 User Interface

- ✅ Modal ยืนยันพร้อมแสดงรูปภาพเต็ม- ✅ Admin Dashboard - สถิติและฟอร์มค้นหา

- ✅ แสดงสถานะการเชื่อมโยง (จำนวนโจทย์/เฉลยที่เชื่อม)- ✅ Student Search Page - หน้าค้นหาสำหรับนักเรียน

- ✅ ค้นหาโจทย์และเฉลยได้ทั้งสองฝั่ง- ✅ Responsive Design - ใช้งานได้ทั้ง Mobile และ Desktop

- ✅ Beautiful Gradients - พื้นหลัง Gradient และ Glass Effect

### 🎨 User Interface

- ✅ **Admin Dashboard** - หน้าหลักพร้อมฟอร์มค้นหา---

- ✅ **Student Search** - หน้าค้นหาสำหรับนักเรียน

- ✅ **Responsive Design** - ใช้งานได้ทุกอุปกรณ์## 🏗️ สถาปัตยกรรมระบบ

- ✅ **Glass Morphism** - พื้นหลัง Gradient พร้อม Backdrop Blur

- ✅ **Smooth Animations** - Transitions และ Hover Effects```

┌─────────────────────────────────────────────────────────────┐

---│                      Frontend (React)                        │

│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │

## 🏗️ สถาปัตยกรรมระบบ│  │ Admin Pages  │  │ Student Page │  │  Components  │      │

│  │ - Dashboard  │  │ - Search     │  │ - Navigation │      │

```│  │ - Add Q/S    │  │              │  │ - Protected  │      │

┌─────────────────────────────────────────────────────────────┐│  │ - Manage Q/S │  │              │  │   Route      │      │

│                    Frontend (React + TailwindCSS)            ││  └──────────────┘  └──────────────┘  └──────────────┘      │

│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      ││            │                 │                 │             │

│  │ Admin Pages  │  │ Student Page │  │  Components  │      ││            └─────────────────┴─────────────────┘             │

│  │ - Dashboard  │  │ - Search     │  │ - Navigation │      ││                           │ Axios                            │

│  │ - Add Q/S    │  │              │  │ - Protected  │      │└───────────────────────────┼──────────────────────────────────┘

│  │ - Manage Q/S │  │              │  │   Route      │      │                            │

│  │ - Link Q-S   │  │              │  │              │      │┌───────────────────────────┼──────────────────────────────────┐

│  └──────────────┘  └──────────────┘  └──────────────┘      ││                    Backend (FastAPI)                         │

│            │                 │                 │             ││  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │

│            └─────────────────┴─────────────────┘             ││  │  Auth API    │  │ Questions API│  │ Solutions API│      │

│                       │ HTTP (Axios)                         ││  │ - Login      │  │ - CRUD       │  │ - CRUD       │      │

└───────────────────────┼──────────────────────────────────────┘│  │ - JWT        │  │ - Upload     │  │ - Upload     │      │

                        ││  └──────────────┘  └──────────────┘  └──────────────┘      │

┌───────────────────────┼──────────────────────────────────────┐│            │                 │                 │             │

│                Backend (FastAPI + SQLAlchemy)                ││            └─────────────────┴─────────────────┘             │

│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      ││                           │ SQLAlchemy ORM                   │

│  │  Auth API    │  │ Questions API│  │ Solutions API│      │└───────────────────────────┼──────────────────────────────────┘

│  │ - Login      │  │ - CRUD       │  │ - CRUD       │      │                            │

│  │ - JWT        │  │ - Upload Img │  │ - Upload Imgs│      │┌───────────────────────────┼──────────────────────────────────┐

│  │              │  │ - Search     │  │ - Link/Unlink│      ││                    Database (MySQL)                          │

│  └──────────────┘  └──────────────┘  └──────────────┘      ││  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │

│            │                 │                 │             ││  │  questions   │←─┤question_     │─→│  solutions   │      │

│            └─────────────────┴─────────────────┘             ││  │              │  │ solutions    │  │              │      │

│                    │ SQLAlchemy ORM                          ││  └──────────────┘  └──────────────┘  └──────────────┘      │

└────────────────────┼─────────────────────────────────────────┘│                                             ↓                │

                     ││                                      ┌──────────────┐        │

┌────────────────────┼─────────────────────────────────────────┐│                                      │solution_     │        │

│                Database (MySQL 8.0)                          ││                                      │ images       │        │

│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      ││                                      └──────────────┘        │

│  │  users       │  │  questions   │  │  solutions   │      │└──────────────────────────────────────────────────────────────┘

│  │              │  │              │  │              │      │```

│  └──────────────┘  └──────┬───────┘  └──────┬───────┘      │

│                           │                  │               │---

│                    ┌──────┴──────────────────┴───────┐      │

│                    │   question_solutions (M2M)      │      │## 🗄️ โครงสร้างฐานข้อมูล

│                    └─────────────────────────────────┘      │

│                                    │                         │### Entity Relationship Diagram

│                             ┌──────┴───────┐                │

│                             │solution_images│                │```

│                             └───────────────┘                │┌─────────────────┐

└──────────────────────────────────────────────────────────────┘│   questions     │

```├─────────────────┤

│ id (PK)         │

---│ book_id         │

│ page            │

## 🗄️ โครงสร้างฐานข้อมูล│ question_no     │

│ question_text   │

### Entity Relationship Diagram│ question_img    │

│ created_at      │

```└────────┬────────┘

┌─────────────────┐         │ 1

│     users       │         │

├─────────────────┤         │ N

│ id (PK)         │┌────────┴────────────┐

│ username (UQ)   ││ question_solutions  │ (Mapping Table)

│ password_hash   │├─────────────────────┤

│ created_at      ││ id (PK)             │

└─────────────────┘│ question_id (FK)    │

│ solution_id (FK)    │

│ created_at          │

┌─────────────────┐└────────┬────────────┘

│   questions     │         │ N

├─────────────────┤         │

│ id (PK)         │         │ 1

│ book_id         │┌────────┴────────┐         ┌─────────────────┐

│ page            ││   solutions     │────────→│ solution_images │

│ question_no     │├─────────────────┤    1:N  ├─────────────────┤

│ question_text   ││ id (PK)         │         │ id (PK)         │

│ question_img    ││ title           │         │ solution_id (FK)│

│ created_at      ││ answer_text     │         │ image_path      │

└────────┬────────┘│ created_at      │         │ image_order     │

         │ 1│ updated_at      │         │ created_at      │

         │└─────────────────┘         └─────────────────┘

         │ N```

┌────────┴────────────┐

│ question_solutions  │ (Mapping Table - Many to Many)### ตารางข้อมูลหลัก

├─────────────────────┤

│ id (PK)             │#### `questions` - ตารางโจทย์

│ question_id (FK)    │| Column | Type | Description |

│ solution_id (FK)    │|--------|------|-------------|

│ created_at          │| id | INT (PK) | รหัสโจทย์ |

└────────┬────────────┘| book_id | VARCHAR(50) | รหัสหนังสือ |

         │ N| page | INT | หน้าหนังสือ |

         │| question_no | INT | ข้อที่ |

         │ 1| question_text | TEXT | ข้อความโจทย์ |

┌────────┴────────┐         ┌─────────────────┐| question_img | VARCHAR(255) | ไฟล์รูปโจทย์ |

│   solutions     │────────→│ solution_images │| created_at | TIMESTAMP | วันที่สร้าง |

├─────────────────┤    1:N  ├─────────────────┤

│ id (PK)         │         │ id (PK)         │#### `solutions` - ตารางเฉลย

│ title           │         │ solution_id (FK)│| Column | Type | Description |

│ answer_text     │         │ image_path      │|--------|------|-------------|

│ created_at      │         │ image_order     │| id | INT (PK) | รหัสเฉลย |

│ updated_at      │         │ created_at      │| title | VARCHAR(255) | ชื่อเฉลย |

└─────────────────┘         └─────────────────┘| answer_text | TEXT | ข้อความเฉลย |

```| created_at | TIMESTAMP | วันที่สร้าง |

| updated_at | TIMESTAMP | วันที่แก้ไข |

### ตารางข้อมูลหลัก

#### `solution_images` - ตารางรูปภาพเฉลย

#### 📋 `users` - ผู้ใช้งาน| Column | Type | Description |

| Column | Type | Description ||--------|------|-------------|

|--------|------|-------------|| id | INT (PK) | รหัสรูปภาพ |

| id | INT (PK) | รหัสผู้ใช้ || solution_id | INT (FK) | รหัสเฉลย |

| username | VARCHAR(50) UNIQUE | ชื่อผู้ใช้ || image_path | VARCHAR(255) | ไฟล์รูปภาพ |

| password_hash | VARCHAR(255) | รหัสผ่านที่เข้ารหัส || image_order | INT | ลำดับการแสดง |

| created_at | TIMESTAMP | วันที่สร้าง || created_at | TIMESTAMP | วันที่อัปโหลด |



#### 📝 `questions` - โจทย์#### `question_solutions` - ตารางเชื่อมโยง (Mapping)

| Column | Type | Description || Column | Type | Description |

|--------|------|-------------||--------|------|-------------|

| id | INT (PK) | รหัสโจทย์ || id | INT (PK) | รหัส |

| book_id | VARCHAR(50) | รหัสหนังสือ || question_id | INT (FK) | รหัสโจทย์ |

| page | INT | หน้าหนังสือ || solution_id | INT (FK) | รหัสเฉลย |

| question_no | INT | ข้อที่ || created_at | TIMESTAMP | วันที่เชื่อม |

| question_text | TEXT | ข้อความโจทย์ |

| question_img | VARCHAR(255) | ไฟล์รูปโจทย์ |---

| created_at | TIMESTAMP | วันที่สร้าง |

## 🚀 การติดตั้ง

#### ✅ `solutions` - เฉลย

| Column | Type | Description |### ✅ ความต้องการของระบบ

|--------|------|-------------|

| id | INT (PK) | รหัสเฉลย |- Python 3.10+

| title | VARCHAR(255) | ชื่อเฉลย |- Node.js 16+

| answer_text | TEXT | ข้อความเฉลย |- MySQL 8.0+

| created_at | TIMESTAMP | วันที่สร้าง |- Git

| updated_at | TIMESTAMP | วันที่แก้ไข |

### 📥 1. Clone Repository

#### 🖼️ `solution_images` - รูปภาพเฉลย

| Column | Type | Description |```bash

|--------|------|-------------|git clone https://github.com/Natthasat/idealguru.git

| id | INT (PK) | รหัสรูปภาพ |cd guru-web

| solution_id | INT (FK) | รหัสเฉลย |```

| image_path | VARCHAR(255) | path ไฟล์รูปภาพ |

| image_order | INT | ลำดับการแสดง |### 🗄️ 2. ตั้งค่าฐานข้อมูล MySQL

| created_at | TIMESTAMP | วันที่อัปโหลด |

```sql

#### 🔗 `question_solutions` - ตารางเชื่อมโยงCREATE DATABASE guru_DB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

| Column | Type | Description |```

|--------|------|-------------|

| id | INT (PK) | รหัส |แก้ไขไฟล์ `backend/database.py`:

| question_id | INT (FK) | รหัสโจทย์ |

| solution_id | INT (FK) | รหัสเฉลย |```python

| created_at | TIMESTAMP | วันที่เชื่อม |DATABASE_URL = "mysql+pymysql://root:yourpassword@localhost:3306/guru_DB"

```

---

### ⚙️ 3. ติดตั้ง Backend

## 🚀 การติดตั้ง

```bash

### ✅ ความต้องการของระบบcd backend



- **Python** 3.10 ขึ้นไป# สร้าง Virtual Environment

- **Node.js** 16.0 ขึ้นไปpython -m venv venv

- **MySQL** 8.0 ขึ้นไป

- **Git**# เปิดใช้งาน venv

# Windows:

### 📥 1. Clone Repositoryvenv\Scripts\activate

# Linux/Mac:

```bashsource venv/bin/activate

git clone https://github.com/Natthasat/idealguru.git

cd guru-web# ติดตั้ง Dependencies

```pip install -r requirements.txt



### 🗄️ 2. ตั้งค่าฐานข้อมูล MySQL# รัน Backend Server

python main.py

เปิด MySQL และสร้าง Database:```



```sqlBackend จะรันที่ `http://localhost:8000`  

CREATE DATABASE guru_DB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;API Docs: `http://localhost:8000/docs`

```

### 🎨 4. ติดตั้ง Frontend

แก้ไขไฟล์ `backend/database.py` ให้ตรงกับ MySQL ของคุณ:

```bash

```pythoncd frontend

DATABASE_URL = "mysql+pymysql://root:yourpassword@localhost:3306/guru_DB"

```# ติดตั้ง Dependencies

npm install

### ⚙️ 3. ติดตั้ง Backend

# รัน Development Server

```bashnpm start

cd backend```



# ติดตั้ง DependenciesFrontend จะรันที่ `http://localhost:3000`

pip install -r requirements.txt

### 🐳 5. (ทางเลือก) ใช้ Docker Compose

# สร้างผู้ใช้ admin (username: admin, password: admin)

python create_admin.py```bash

# รันทั้งระบบด้วยคำสั่งเดียว

# รัน Backend Serverdocker-compose up -d

python main.py

```# ตรวจสอบ logs

docker-compose logs -f

✅ Backend จะรันที่ `http://localhost:8000`  

📖 API Docs: `http://localhost:8000/docs`# หยุดระบบ

docker-compose down

### 🎨 4. ติดตั้ง Frontend```



เปิด Terminal ใหม่:---



```bash## 📘 วิธีใช้งาน

cd frontend

### 👨‍💼 สำหรับผู้ดูแล (Admin)

# ติดตั้ง Dependencies

npm install#### 1. เข้าสู่ระบบ



# รัน Development Server- ไปที่ `http://localhost:3000`

npm start- Login ด้วยบัญชี admin

```- (Default: สร้างผ่าน `backend/create_admin.py`)



✅ Frontend จะรันที่ `http://localhost:3000`#### 2. เพิ่มโจทย์



### 🎉 5. เข้าใช้งาน```

Admin Dashboard → เพิ่มโจทย์

เปิดเบราว์เซอร์ไปที่ `http://localhost:3000`- กรอก Book ID, Page, Question No

- (Optional) เพิ่มข้อความโจทย์

**ข้อมูล Login:**- (Optional) อัปโหลดรูปภาพโจทย์

- Username: `admin`- คลิก "เพิ่มโจทย์"

- Password: `admin````



---#### 3. เพิ่มเฉลย (แบบใหม่ Many-to-Many)



## 📘 วิธีใช้งาน```

Admin Dashboard → เพิ่มเฉลย

### 👨‍💼 สำหรับผู้ดูแลระบบ (Admin)- กรอกชื่อเฉลย (Optional)

- กรอกข้อความเฉลย

#### 1️⃣ เข้าสู่ระบบ- อัปโหลดรูปภาพหลายรูป (สูงสุด 5 รูป)

- คลิก "บันทึกเฉลย"

1. ไปที่ `http://localhost:3000````

2. กรอก Username: `admin`, Password: `admin`

3. คลิก "เข้าสู่ระบบ"#### 4. เชื่อมโยงโจทย์กับเฉลย



#### 2️⃣ เพิ่มโจทย์```

Admin Dashboard → เชื่อมโจทย์-เฉลย

```- เลือกโจทย์จากรายการซ้าย

Dashboard → เพิ่มโจทย์- เลือกเฉลยจากรายการขวา

├─ กรอก Book ID (เช่น IPL25122-0652)- คลิก "เชื่อมโยง"

├─ กรอกหน้า (เช่น 5)```

├─ กรอกข้อที่ (เช่น 2)

├─ (Optional) กรอกข้อความโจทย์#### 5. จัดการโจทย์/เฉลย

├─ (Optional) อัปโหลดรูปโจทย์

└─ คลิก "เพิ่มโจทย์"```

```Admin Dashboard → จัดการโจทย์/จัดการเฉลย

- ดูรายการทั้งหมด

💡 **Tips:** ระบบจะจำ Book ID ล่าสุด เพื่อความสะดวกในการเพิ่มข้อถัดไป- แก้ไข/ลบ ข้อมูล

- ค้นหาด้วย Search Bar

#### 3️⃣ เพิ่มเฉลย (Many-to-Many)```



```### 👨‍🎓 สำหรับนักเรียน (Student)

Dashboard → เพิ่มเฉลย

├─ กรอกชื่อเฉลย (Optional)#### ค้นหาโจทย์และเฉลย

├─ กรอกข้อความเฉลย

├─ อัปโหลดรูปภาพหลายรูป (สูงสุด 5 รูป)```

│  └─ รูปจะถูกเรียงตามลำดับ (1, 2, 3...)1. ไปที่ /student/search หรือใช้ฟอร์มค้นหาในหน้า Admin

└─ คลิก "บันทึกเฉลย"2. กรอก:

```   - Book ID: เช่น IPL25122-0652

   - Page: เช่น 5

💡 **Tips:** ควรอัปโหลดรูปตามขั้นตอนการทำโจทย์ (Step 1, Step 2, ...)   - Question No: เช่น 2

3. คลิก "ค้นหา"

#### 4️⃣ เชื่อมโยงโจทย์กับเฉลย ⭐4. ระบบจะแสดง:

   - โจทย์พร้อมรูปภาพ (ถ้ามี)

```   - เฉลยทุกชุดที่เกี่ยวข้อง

Dashboard → เชื่อมโจทย์กับเฉลย   - รูปภาพเฉลยทุกรูป (เรียงตาม order)

├─ ค้นหาและเลือกโจทย์ (ด้านซ้าย)```

│  └─ ระบบจะแสดงรูปโจทย์ตัวอย่างด้านล่าง

├─ ค้นหาและเลือกเฉลย (ด้านขวา)---

│  └─ ระบบจะแสดงรูปเฉลยตัวอย่างด้านล่าง

├─ ตรวจสอบรูปภาพว่าถูกต้อง## 📡 API Documentation

├─ คลิก "เชื่อมโยงโจทย์กับเฉลย"

└─ ยืนยันใน Modal (แสดงรูปภาพเต็ม)### Authentication

```

#### Login

**🎯 ฟีเจอร์พิเศษ:**```http

- ✅ แสดงสถานะ "✅ มีเฉลยแล้ว (X เฉลย)" สำหรับโจทย์POST /api/auth/login

- ✅ แสดงสถานะ "🔗 เชื่อมกับ X โจทย์" สำหรับเฉลยContent-Type: application/json

- ✅ Modal ยืนยันพร้อมแสดงรูปภาพทั้งหมด

- ✅ ป้องกันการเชื่อมซ้ำ{

  "username": "admin",

#### 5️⃣ จัดการโจทย์/เฉลย  "password": "password"

}

**จัดการโจทย์:**

```Response: { "access_token": "...", "token_type": "bearer" }

Dashboard → จัดการโจทย์```

├─ ค้นหาโจทย์

├─ ดูรายละเอียดพร้อมรูปภาพ### Questions API

├─ แก้ไขข้อมูล

└─ ลบโจทย์ (จะลบการเชื่อมโยงด้วย)#### เพิ่มโจทย์

``````http

POST /api/questions

**จัดการเฉลย:**Content-Type: multipart/form-data

```

Dashboard → จัดการเฉลยbook_id: string

├─ ค้นหาเฉลยpage: integer

├─ ดูรายละเอียดพร้อมรูปภาพทั้งหมดquestion_no: integer

├─ ดูโจทย์ที่เชื่อมโยงquestion_text: string (optional)

├─ แก้ไขข้อมูลquestion_img: file (optional)

└─ ลบเฉลย (จะลบรูปและการเชื่อมโยงด้วย)```

```

#### ดูโจทย์ทั้งหมด

#### 6️⃣ ออกจากระบบ```http

GET /api/questions

``````

คลิกปุ่ม "ออกจากระบบ" (สีแดง) มุมบนขวา

```#### ลบโจทย์

```http

---DELETE /api/questions/{question_id}

```

### 👨‍🎓 สำหรับนักเรียน (Student)

### Solutions API (Many-to-Many)

#### 🔍 ค้นหาโจทย์และเฉลย

#### สร้างเฉลยใหม่

``````http

1. ใช้ฟอร์มค้นหาในหน้า DashboardPOST /api/solutions

2. กรอกข้อมูล:Content-Type: multipart/form-data

   ├─ Book ID: IPL25122-0652

   ├─ Page: 5title: string (optional)

   └─ Question No: 2answer_text: string

3. คลิก "ค้นหา"```

4. ระบบจะแสดง:

   ├─ ข้อมูลโจทย์ + รูปภาพ (ถ้ามี)#### อัปโหลดรูปภาพเฉลย

   └─ เฉลยทุกชุดที่เกี่ยวข้อง (Many-to-Many)```http

       └─ รูปภาพเฉลยทุกรูป (เรียงตามลำดับ)POST /api/solutions/{solution_id}/images

```Content-Type: multipart/form-data



**ตัวอย่างผลลัพธ์:**images: file[] (multiple files)

``````

📝 โจทย์: IPL25122-0652 หน้า 5 ข้อ 2

└─ [รูปโจทย์]#### เชื่อมโยงโจทย์กับเฉลย

```http

✅ เฉลยที่ 1: วิธีที่ 1POST /api/questions/{question_id}/solutions/{solution_id}

├─ รูปที่ 1: [รูปขั้นตอนที่ 1]```

├─ รูปที่ 2: [รูปขั้นตอนที่ 2]

└─ รูปที่ 3: [รูปขั้นตอนที่ 3]#### ยกเลิกการเชื่อมโยง

```http

✅ เฉลยที่ 2: วิธีที่ 2 (ทางลัด)DELETE /api/questions/{question_id}/solutions/{solution_id}

└─ รูปที่ 1: [รูปวิธีลัด]```

```

#### ดูเฉลยทั้งหมด

---```http

GET /api/solutions

## 📡 API Documentation```



### 🔐 Authentication### Combined Query



#### Login#### ค้นหาโจทย์ + เฉลยพร้อมกัน

```http```http

POST /api/auth/loginGET /api/qa/{book_id}/{page}/{question_no}

Content-Type: application/json

Example: GET /api/qa/IPL25122-0652/5/2

{

  "username": "admin",Response:

  "password": "admin"{

}  "id": 1,

  "book_id": "IPL25122-0652",

Response:  "page": 5,

{  "question_no": 2,

  "access_token": "eyJhbGc...",  "question_text": "...",

  "token_type": "bearer"  "question_img": "uploads/xxx.png",

}  "solutions": [

```    {

      "id": 1,

---      "title": "วิธีที่ 1",

      "answer_text": "...",

### 📝 Questions API      "images": [

        {

#### เพิ่มโจทย์          "id": 1,

```http          "image_path": "uploads/yyy.png",

POST /api/questions          "image_order": 0

Content-Type: multipart/form-data        },

Authorization: Bearer {token}        {

          "id": 2,

book_id: string          "image_path": "uploads/zzz.png",

page: integer          "image_order": 1

question_no: integer        }

question_text: string (optional)      ]

question_img: file (optional)    }

```  ]

}

#### ดูโจทย์ทั้งหมดพร้อมเฉลย```

```http

GET /api/questions### ตัวอย่างการเรียกใช้ด้วย JavaScript

Authorization: Bearer {token}

```javascript

Response:// ค้นหาโจทย์และเฉลย

[import axios from 'axios';

  {

    "id": 1,const API_BASE_URL = 'http://localhost:8000/api';

    "book_id": "IPL25122-0652",

    "page": 5,// ค้นหา

    "question_no": 2,async function searchQuestion(bookId, page, questionNo) {

    "question_text": "...",  try {

    "question_img": "uploads/xxx.png",    const response = await axios.get(

    "solutions": [      `${API_BASE_URL}/qa/${bookId}/${page}/${questionNo}`

      {    );

        "id": 1,    console.log('Question:', response.data);

        "title": "วิธีที่ 1"    console.log('Solutions:', response.data.solutions);

      }  } catch (error) {

    ]    console.error('Error:', error.response?.data || error.message);

  }  }

]}

```

// เพิ่มโจทย์

#### ลบโจทย์async function addQuestion(formData) {

```http  const data = new FormData();

DELETE /api/questions/{question_id}  data.append('book_id', formData.book_id);

Authorization: Bearer {token}  data.append('page', formData.page);

```  data.append('question_no', formData.question_no);

  if (formData.question_text) data.append('question_text', formData.question_text);

---  if (formData.question_img) data.append('question_img', formData.question_img);



### ✅ Solutions API (Many-to-Many)  const response = await axios.post(`${API_BASE_URL}/questions`, data);

  return response.data;

#### สร้างเฉลยใหม่}

```http

POST /api/solutions// เพิ่มเฉลยพร้อมรูปหลายรูป

Content-Type: application/jsonasync function addSolutionWithImages(solutionData, images) {

Authorization: Bearer {token}  // 1. สร้างเฉลย

  const solutionResponse = await axios.post(`${API_BASE_URL}/solutions`, solutionData);

{  const solutionId = solutionResponse.data.id;

  "title": "วิธีที่ 1",

  "answer_text": "คำอธิบายวิธีทำ..."  // 2. อัปโหลดรูปภาพ

}  const imageFormData = new FormData();

  images.forEach(image => imageFormData.append('images', image));

Response:  await axios.post(`${API_BASE_URL}/solutions/${solutionId}/images`, imageFormData);

{

  "id": 1,  return solutionId;

  "title": "วิธีที่ 1",}

  "answer_text": "...",

  "images": [],// เชื่อมโยงโจทย์กับเฉลย

  "created_at": "2025-10-06T10:00:00"async function linkQuestionToSolution(questionId, solutionId) {

}  const response = await axios.post(

```    `${API_BASE_URL}/questions/${questionId}/solutions/${solutionId}`

  );

#### อัปโหลดรูปภาพเฉลย (หลายรูป)  return response.data;

```http}

POST /api/solutions/{solution_id}/images

Content-Type: multipart/form-data// ใช้งาน

Authorization: Bearer {token}searchQuestion('IPL25122-0652', 5, 2);

```

images: file[]

---

Response:

[## 📂 โครงสร้างโปรเจค

  {

    "id": 1,```

    "solution_id": 1,guru-web/

    "image_path": "uploads/image1.png",├── 📁 backend/                     # FastAPI Backend

    "order_num": 0│   ├── 📄 main.py                 # Application entry point

  },│   ├── 📄 database.py             # Database connection & session

  {│   ├── 📄 models.py               # SQLAlchemy ORM models (Many-to-Many)

    "id": 2,│   ├── 📄 auth.py                 # JWT Authentication

    "solution_id": 1,│   ├── 📄 create_admin.py         # Script สร้าง admin user

    "image_path": "uploads/image2.png",│   ├── 📄 requirements.txt        # Python dependencies

    "order_num": 1│   ├── 📄 Dockerfile              # Backend container config

  }│   ├── 📄 migrate_to_many_to_many.py    # Migration script

]│   ├── 📄 fix_question_solutions_table.py

```│   ├── 📄 fix_solution_images_table.py

│   ├── 📁 routes/                 # API route modules

#### ดูเฉลยทั้งหมดพร้อมโจทย์ที่เชื่อม│   │   ├── 📄 __init__.py

```http│   │   ├── 📄 auth.py            # Authentication endpoints

GET /api/solutions│   │   ├── 📄 questions.py       # Question CRUD API

Authorization: Bearer {token}│   │   └── 📄 solutions.py       # Solution CRUD API (Many-to-Many)

│   └── 📁 uploads/                # File storage (images)

Response:│

[├── 📁 frontend/                    # React Frontend

  {│   ├── 📄 package.json            # Node.js dependencies

    "id": 1,│   ├── 📄 tailwind.config.js      # TailwindCSS config

    "title": "วิธีที่ 1",│   ├── 📄 postcss.config.js

    "answer_text": "...",│   ├── 📄 Dockerfile              # Frontend container config

    "images": [│   ├── 📁 public/

      {│   │   └── 📄 index.html

        "id": 1,│   └── 📁 src/

        "image_path": "uploads/image1.png",│       ├── 📄 App.js              # Main application & routing

        "order_num": 0│       ├── 📄 index.js            # Entry point

      }│       ├── 📄 index.css           # Global styles

    ],│       ├── 📁 components/

    "linked_questions": [│       │   ├── 📄 Navigation.jsx      # Navigation bar

      {│       │   └── 📄 ProtectedRoute.jsx  # Route protection HOC

        "id": 1,│       └── 📁 pages/

        "book_id": "IPL25122-0652",│           ├── 📄 Login.jsx                    # Admin login page

        "page": 5,│           ├── 📄 AdminDashboard.jsx           # Admin dashboard

        "question_no": 2│           ├── 📄 AdminAddQuestion.jsx         # Add questions

      }│           ├── 📄 AdminManageQuestions.jsx     # Manage questions

    ]│           ├── 📄 AdminAddSolution.jsx         # Add solutions (old)

  }│           ├── 📄 AdminAddSolutionNew.jsx      # Add solutions (new M2M)

]│           ├── 📄 AdminLinkQuestionSolution.jsx # Link Q&S

```│           ├── 📄 AdminManageSolutions.jsx     # Manage solutions

│           ├── 📄 StudentSearch.jsx            # Student search page

#### ลบเฉลย│           └── 📄 SolutionSearch.jsx           # Solution search

```http│

DELETE /api/solutions/{solution_id}├── 📄 docker-compose.yml           # Multi-container orchestration

Authorization: Bearer {token}├── 📄 DEPLOY.md                    # Deployment guide

```├── 📄 MIGRATION_GUIDE.md           # Many-to-Many migration guide

├── 📄 README.md                    # This file

---└── 📄 .gitignore

```

### 🔗 Link Management API

---

#### เชื่อมโยงโจทย์กับเฉลย

```http## 🛠️ เทคโนโลยีที่ใช้

POST /api/questions/{question_id}/solutions/{solution_id}

Authorization: Bearer {token}### Backend

- **[FastAPI](https://fastapi.tiangolo.com/)** `0.115.0` - Modern Python web framework

Response:- **[SQLAlchemy](https://www.sqlalchemy.org/)** `2.0.36` - ORM for database operations

{- **[PyMySQL](https://pymysql.readthedocs.io/)** `1.1.1` - MySQL connector

  "message": "เชื่อมโยงสำเร็จ",- **[PyJWT](https://pyjwt.readthedocs.io/)** - JWT authentication

  "question_id": 1,- **[Passlib](https://passlib.readthedocs.io/)** - Password hashing

  "solution_id": 1- **[Python-Multipart](https://andrew-d.github.io/python-multipart/)** - File upload support

}- **[Uvicorn](https://www.uvicorn.org/)** - ASGI server

```

### Frontend

#### ยกเลิกการเชื่อมโยง- **[React](https://reactjs.org/)** `18.2.0` - UI library

```http- **[React Router](https://reactrouter.com/)** `6.18.0` - Client-side routing

DELETE /api/questions/{question_id}/solutions/{solution_id}- **[Axios](https://axios-http.com/)** `1.6.2` - HTTP client

Authorization: Bearer {token}- **[TailwindCSS](https://tailwindcss.com/)** `3.3.5` - Utility-first CSS framework



Response:### Database

{- **[MySQL](https://www.mysql.com/)** `8.0+` - Relational database

  "message": "ยกเลิกการเชื่อมโยงสำเร็จ"- **Many-to-Many Architecture** - Flexible relationship management

}

```### DevOps

- **[Docker](https://www.docker.com/)** - Containerization

---- **[Docker Compose](https://docs.docker.com/compose/)** - Multi-container orchestration



### 🔍 Search API---



#### ค้นหาโจทย์ + เฉลยพร้อมกัน## 🔧 การพัฒนาเพิ่มเติม

```http

GET /api/qa/{book_id}/{page}/{question_no}### Migration จาก 1:1 เป็น Many-to-Many



Example: GET /api/qa/IPL25122-0652/5/2หากมีข้อมูลเก่าในระบบ สามารถใช้ Migration Script:



Response:```bash

{cd backend

  "question": {python migrate_to_many_to_many.py

    "id": 1,```

    "book_id": "IPL25122-0652",

    "page": 5,Script นี้จะ:

    "question_no": 2,1. สำรองข้อมูลเก่าใน `solutions_backup`

    "question_text": "หาค่า x ที่ทำให้...",2. สร้างตาราง `solutions`, `solution_images`, `question_solutions` ใหม่

    "question_img": "uploads/question.png"3. แปลงข้อมูลเก่าเป็นรูปแบบใหม่

  },4. ลบตารางเก่าและเปลี่ยนชื่อตารางใหม่

  "solutions": [

    {ดูรายละเอียดเพิ่มเติมใน `MIGRATION_GUIDE.md`

      "id": 1,

      "title": "วิธีที่ 1 - แก้ด้วย Factoring",### การแก้ไขปัญหาที่พบบ่อย

      "answer_text": "นำไปแยกตัวประกอบ...",

      "images": [#### ปัญหา: ตาราง question_solutions ไม่มี id

        {```bash

          "id": 1,python backend/fix_question_solutions_table.py

          "image_path": "uploads/solution1_step1.png",```

          "order_num": 0

        },#### ปัญหา: ตาราง solution_images มีโครงสร้างผิด

        {```bash

          "id": 2,python backend/fix_solution_images_table.py

          "image_path": "uploads/solution1_step2.png",```

          "order_num": 1

        }---

      ]

    },## 📄 License

    {

      "id": 2,MIT License

      "title": "วิธีที่ 2 - ใช้สูตร Quadratic",

      "answer_text": "ใช้สูตร ax² + bx + c = 0",Copyright (c) 2025 Guru Web Project

      "images": [

        {Permission is hereby granted, free of charge, to any person obtaining a copy

          "id": 3,of this software and associated documentation files (the "Software"), to deal

          "image_path": "uploads/solution2_formula.png",in the Software without restriction, including without limitation the rights

          "order_num": 0to use, copy, modify, merge, publish, distribute, sublicense, and/or sell

        }copies of the Software, and to permit persons to whom the Software is

      ]furnished to do so, subject to the following conditions:

    }

  ]The above copyright notice and this permission notice shall be included in all

}copies or substantial portions of the Software.

```

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR

---IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,

FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE

## 📂 โครงสร้างโปรเจคAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER

LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,

```OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE

guru-web/SOFTWARE.

├── 📁 backend/                          # FastAPI Backend

│   ├── 📄 main.py                      # Entry point---

│   ├── 📄 database.py                  # Database configuration

│   ├── 📄 models.py                    # SQLAlchemy models (M2M)## 🙏 ขอบคุณ

│   ├── 📄 auth.py                      # JWT authentication

│   ├── 📄 create_admin.py              # สร้าง admin user- [FastAPI](https://fastapi.tiangolo.com/) - Amazing Python web framework

│   ├── 📄 requirements.txt             # Python dependencies- [React](https://reactjs.org/) - Powerful UI library

│   ├── 📄 delete_backup_tables.py      # ลบตาราง backup- [TailwindCSS](https://tailwindcss.com/) - Beautiful utility-first CSS

│   ├── 📁 routes/                      # API endpoints- [SQLAlchemy](https://www.sqlalchemy.org/) - The Python SQL toolkit

│   │   ├── 📄 __init__.py

│   │   ├── 📄 auth.py                 # Login API---

│   │   ├── 📄 questions.py            # Questions CRUD

│   │   └── 📄 solutions.py            # Solutions CRUD (M2M)## 👥 ผู้พัฒนา

│   └── 📁 uploads/                     # Uploaded images

│- **GitHub:** [Natthasat](https://github.com/Natthasat)

├── 📁 frontend/                         # React Frontend- **Repository:** [idealguru](https://github.com/Natthasat/idealguru)

│   ├── 📄 package.json

│   ├── 📄 tailwind.config.js---

│   ├── 📄 postcss.config.js

│   ├── 📁 public/## 📞 ติดต่อ & สนับสนุน

│   │   └── 📄 index.html

│   └── 📁 src/หากพบปัญหาหรือมีข้อเสนอแนะ:

│       ├── 📄 App.js                   # Main app + routing- 🐛 **Bug Reports:** [GitHub Issues](https://github.com/Natthasat/idealguru/issues)

│       ├── 📄 index.js- 💡 **Feature Requests:** [GitHub Discussions](https://github.com/Natthasat/idealguru/discussions)

│       ├── 📄 index.css                # Global styles

│       ├── 📁 components/---

│       │   ├── 📄 Navigation.jsx       # Navbar (empty)

│       │   └── 📄 ProtectedRoute.jsx   # Route guard<div align="center">

│       └── 📁 pages/

│           ├── 📄 Login.jsx                      # หน้า Login### ⭐ ถ้าโปรเจคนี้มีประโยชน์ อย่าลืมกด Star ด้วยนะ! ⭐

│           ├── 📄 AdminDashboard.jsx             # หน้าหลัก Admin

│           ├── 📄 AdminAddQuestion.jsx           # เพิ่มโจทย์**สร้างด้วย ❤️ เพื่อการศึกษา**

│           ├── 📄 AdminManageQuestions.jsx       # จัดการโจทย์

│           ├── 📄 AdminAddSolutionNew.jsx        # เพิ่มเฉลย (M2M)</div>
│           ├── 📄 AdminManageSolutions.jsx       # จัดการเฉลย
│           ├── 📄 AdminLinkQuestionSolution.jsx  # เชื่อมโยง Q-S ⭐
│           └── 📄 SolutionSearch.jsx             # ค้นหา (Student)
│
├── 📄 docker-compose.yml                # Docker orchestration
├── 📄 DEPLOY.md                         # คู่มือ Deployment
└── 📄 README.md                         # เอกสารนี้
```

---

## 🛠️ เทคโนโลยีที่ใช้

### Backend Stack
| เทคโนโลยี | เวอร์ชัน | หน้าที่ |
|-----------|---------|---------|
| **FastAPI** | 0.115.0 | Web framework (async, fast) |
| **SQLAlchemy** | 2.0.36 | ORM สำหรับจัดการ database |
| **PyMySQL** | 1.1.1 | MySQL driver |
| **PyJWT** | 2.9.0 | JWT authentication |
| **Passlib** | 1.7.4 | Password hashing (bcrypt) |
| **Python-Multipart** | 0.0.9 | File upload support |
| **Uvicorn** | 0.30.6 | ASGI server |

### Frontend Stack
| เทคโนโลยี | เวอร์ชัน | หน้าที่ |
|-----------|---------|---------|
| **React** | 18.2.0 | UI library |
| **React Router** | 6.18.0 | Client-side routing |
| **Axios** | 1.6.2 | HTTP client |
| **TailwindCSS** | 3.3.5 | Utility-first CSS |

### Database
- **MySQL** 8.0+ - Relational database
- **Many-to-Many Architecture** - ความสัมพันธ์แบบยืดหยุ่น

---

## 🔧 การแก้ปัญหา

### ❌ ปัญหา: ไม่สามารถ Login ได้

**สาเหตุ:** ยังไม่มีผู้ใช้ในระบบ

**วิธีแก้:**
```bash
cd backend
python create_admin.py
```

---

### ❌ ปัญหา: หน้าจอขาวเปล่า / Infinite Loop

**สาเหตุ:** Token ชื่อไม่ตรงกันระหว่าง Login และ ProtectedRoute

**วิธีแก้:**
1. กด **F12** เปิด Console
2. พิมพ์: `localStorage.clear()`
3. กด **Enter**
4. **Refresh** หน้าเว็บ (F5)
5. Login ใหม่

---

### ❌ ปัญหา: รูปภาพไม่แสดง

**สาเหตุ:** Path ไฟล์ไม่ถูกต้อง

**ตรวจสอบ:**
- Backend: ตรวจสอบว่ามีโฟลเดอร์ `backend/uploads/`
- Frontend: path ต้องเป็น `http://localhost:8000/uploads/filename.png`

---

### ❌ ปัญหา: Cannot connect to MySQL

**วิธีแก้:**
1. ตรวจสอบว่า MySQL เปิดอยู่
2. ตรวจสอบ `backend/database.py`:
   ```python
   DATABASE_URL = "mysql+pymysql://root:รหัสผ่าน@localhost:3306/guru_DB"
   ```
3. สร้าง database:
   ```sql
   CREATE DATABASE guru_DB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

---

### ❌ ปัญหา: Port 8000 หรือ 3000 ถูกใช้แล้ว

**Windows:**
```powershell
# ดู process ที่ใช้ port
netstat -ano | findstr :8000

# Kill process
taskkill /F /PID [PID_NUMBER]
```

**Linux/Mac:**
```bash
# ดู process
lsof -i :8000

# Kill process
kill -9 [PID]
```

---

## 🎓 Best Practices

### 📝 การตั้งชื่อไฟล์
- โจทย์: `book_id_page_question.png` (เช่น `IPL25122-0652_5_2.png`)
- เฉลย: `solution_01_step1.png`, `solution_01_step2.png`

### 🖼️ การอัปโหลดรูป
- ขนาดไฟล์: ไม่เกิน 5MB
- ไฟล์ที่รองรับ: PNG, JPG, JPEG, GIF
- ความละเอียด: แนะนำ 1024x768 ขึ้นไป

### 🔐 Security
- เปลี่ยนรหัสผ่าน admin ใน production
- ใช้ HTTPS ใน production
- ตั้งค่า CORS อย่างเหมาะสม

---

## 📄 License

MIT License

Copyright (c) 2025 Guru Web Project

---

## 👥 ผู้พัฒนา

- **GitHub:** [Natthasat](https://github.com/Natthasat)
- **Repository:** [idealguru](https://github.com/Natthasat/idealguru)

---

## 📞 ติดต่อ & สนับสนุน

- 🐛 **Bug Reports:** [GitHub Issues](https://github.com/Natthasat/idealguru/issues)
- 💡 **Feature Requests:** [GitHub Discussions](https://github.com/Natthasat/idealguru/discussions)

---

<div align="center">

### ⭐ ถ้าโปรเจคนี้มีประโยชน์ อย่าลืมกด Star ด้วยนะครับ! ⭐

**Made with ❤️ for Education**

![Guru Web](https://img.shields.io/badge/Guru%20Web-Many--to--Many-blue?style=for-the-badge)

</div>
