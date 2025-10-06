# 📚 Guru Web - ระบบจัดการคลังโจทย์และเฉลย# 📚 Guru Web - ระบบจัดการคลังโจทย์และเฉลย



> ระบบเว็บแอปพลิเคชันสำหรับจัดการคลังโจทย์และเฉลยแบบครบวงจร รองรับการเชื่อมโยงโจทย์กับเฉลยแบบ Many-to-Many พร้อมระบบค้นหาและจัดการรูปภาพที่ทรงพลัง> ระบบเว็บแอปพลิเคชันสำหรับจัดการคลังโจทย์และเฉลยแบบครบวงจร รองรับการเชื่อมโยงโจทย์กับเฉลยแบบ Many-to-Many พร้อมระบบค้นหาและจัดการรูปภาพที่ทรงพลัง



[![FastAPI](https://img.shields.io/badge/FastAPI-0.115.0-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)[![FastAPI](https://img.shields.io/badge/FastAPI-0.115.0-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)

[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)

[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[![Python](https://img.shields.io/badge/Python-3.13-3776AB?logo=python&logoColor=white)](https://www.python.org/)[![Python](https://img.shields.io/badge/Python-3.13-3776AB?logo=python&logoColor=white)](https://www.python.org/)



------



## 📖 สารบัญ## 📖 สารบัญ



- [ภาพรวมโปรเจค](#-ภาพรวมโปรเจค)- [ภาพรวมโปรเจค](#-ภาพรวมโปรเจค)

- [ฟีเจอร์หลัก](#-ฟีเจอร์หลัก)- [ฟีเจอร์หลัก](#-ฟีเจอร์หลัก)

- [สถาปัตยกรรมระบบ](#️-สถาปัตยกรรมระบบ)- [สถาปัตยกรรมระบบ](#-สถาปัตยกรรมระบบ)

- [เทคโนโลยีที่ใช้](#️-เทคโนโลยีที่ใช้)- [เทคโนโลยีที่ใช้](#-เทคโนโลยีที่ใช้)

- [ข้อกำหนดของระบบ](#-ข้อกำหนดของระบบ)- [ข้อกำหนดของระบบ](#-ข้อกำหนดของระบบ)

- [การติดตั้ง](#-การติดตั้ง)- [การติดตั้ง](#-การติดตั้ง)

- [วิธีใช้งาน](#-วิธีใช้งาน)- [วิธีใช้งาน](#-วิธีใช้งาน)

- [โครงสร้างโปรเจค](#-โครงสร้างโปรเจค)- [โครงสร้างโปรเจค](#-โครงสร้างโปรเจค)

- [โครงสร้างฐานข้อมูล](#️-โครงสร้างฐานข้อมูล)- [โครงสร้างฐานข้อมูล](#-โครงสร้างฐานข้อมูล)

- [API Documentation](#-api-documentation)- [API Documentation](#-api-documentation)

- [การแก้ปัญหา](#-การแก้ปัญหา)- [การแก้ปัญหา](#-การแก้ปัญหา)

- [การ Deploy](#-การ-deploy)- [การ Deploy](#-การ-deploy)

- [License](#-license)- [License](#-license)



---



## 🌟 ภาพรวมโปรเจค------



**Guru Web** เป็นระบบจัดการคลังโจทย์และเฉลยที่ออกแบบมาเพื่อการศึกษา รองรับการเชื่อมโยงโจทย์กับเฉลยแบบ **Many-to-Many** ทำให้โจทย์หนึ่งข้อสามารถมีหลายวิธีแก้ และเฉลยหนึ่งชุดก็สามารถใช้กับหลายโจทย์ได้



### 🎯 จุดเด่นของระบบ## 🎯 ภาพรวมโปรเจค## 🎯 ภาพรวมโปรเจค



1. **ความยืดหยุ่นสูง** - จัดการความสัมพันธ์ระหว่างโจทย์และเฉลยได้อย่างอิสระ

2. **รองรับรูปภาพหลายรูป** - แสดงขั้นตอนการทำโจทย์ได้ชัดเจนทีละขั้น

3. **UI/UX สวยงาม** - ออกแบบด้วย TailwindCSS พร้อม Gradient และ Glass Effect**Guru Web** เป็นระบบจัดการโจทย์และเฉลยที่ออกแบบมาสำหรับสถาบันการศึกษา ด้วยสถาปัตยกรรม **Many-to-Many Relationship** ที่ทำให้:**Guru Web** เป็นระบบจัดการโจทย์และเฉลยที่ออกแบบมาสำหรับสถาบันการศึกษา ด้วยสถาปัตยกรรม **Many-to-Many Relationship** ที่ทำให้:

4. **ระบบค้นหารวดเร็ว** - ค้นหาด้วย Book ID, Page, Question Number

5. **Admin Panel ครบครัน** - จัดการข้อมูลได้ง่ายผ่าน Web Interface

6. **Authentication ปลอดภัย** - ระบบ JWT Authentication

- ✅ **โจทย์ 1 ข้อ สามารถมีหลายเฉลยได้** (เช่น วิธีแก้หลายแบบ)- **โจทย์ 1 ข้อ สามารถมีหลายเฉลยได้** (เช่น วิธีแก้หลายแบบ)

---

- ✅ **เฉลย 1 ชุด สามารถใช้กับหลายโจทย์ได้** (เช่น เฉลยทั่วไปที่ใช้ซ้ำ)- **เฉลย 1 ชุด สามารถใช้กับหลายโจทย์ได้** (เช่น เฉลยทั่วไปที่ใช้ซ้ำ)

## ✨ ฟีเจอร์หลัก

- ✅ **เฉลย 1 ชุด สามารถมีรูปภาพหลายรูปได้** (Step-by-step solutions)- **เฉลย 1 ชุด สามารถมีรูปภาพหลายรูปได้** (Step-by-step solutions)

### 🔐 ระบบ Authentication

- ✅ Login ด้วย JWT (JSON Web Tokens)

- ✅ Protected Routes สำหรับหน้า Admin

- ✅ Session Management### 🌟 จุดเด่นของระบบ### 🌟 จุดเด่นของระบบ

- ✅ ตรวจสอบสิทธิ์อัตโนมัติ



### 📝 จัดการโจทย์ (Questions)

- ✅ เพิ่ม/แก้ไข/ลบโจทย์- 🔐 **ระบบ Authentication** - Login ด้วย JWT, Protected Routes1. **ความยืดหยุ่นสูง** - จัดการความสัมพันธ์ระหว่างโจทย์และเฉลยได้อย่างอิสระ

- ✅ อัปโหลดรูปภาพโจทย์ (PNG, JPG, GIF)

- ✅ ค้นหาโจทย์ด้วย Book ID + Page + Question Number- 🎨 **UI/UX สวยงาม** - TailwindCSS พร้อม Gradient และ Glass Effects2. **รองรับรูปภาพหลายรูป** - แสดงขั้นตอนการทำโจทย์ได้ชัดเจน

- ✅ แสดงรายการโจทย์ทั้งหมดพร้อม Pagination

- ✅ ระบบจำ Book ID ล่าสุดเพื่อความสะดวก- 🔍 **ค้นหารวดเร็ว** - ค้นหาด้วย Book ID + Page + Question Number3. **UI/UX สวยงาม** - ออกแบบด้วย TailwindCSS พร้อม Gradient และ Backdrop Effects



### ✅ จัดการเฉลย (Solutions) - Many-to-Many- 📱 **Responsive Design** - ใช้งานได้ทั้ง Desktop และ Mobile4. **ระบบค้นหารวดเร็ว** - ค้นหาด้วย Book ID, Page, Question Number

- ✅ สร้างเฉลยแยกจากโจทย์ (Independent Solutions)

- ✅ อัปโหลดรูปภาพหลายรูปต่อเฉลย (Multiple Images per Solution)- 🖼️ **รองรับรูปหลายรูป** - แสดงขั้นตอนการทำโจทย์แบบละเอียด5. **Admin Panel ครบครัน** - จัดการข้อมูลได้ง่ายผ่าน Web Interface

- ✅ เชื่อมโยงโจทย์กับเฉลยแบบยืดหยุ่น (Link/Unlink)

- ✅ แสดงเฉลยทั้งหมดที่เชื่อมกับโจทย์

- ✅ เรียงลำดับรูปภาพ (Image Ordering)

- ✅ แก้ไข/ลบเฉลยพร้อมจัดการรูปภาพ------



### 🔍 ระบบค้นหา

- ✅ ค้นหาโจทย์ + เฉลยพร้อมกัน (`/api/qa/{book_id}/{page}/{question_no}`)

- ✅ แสดงผลโจทย์พร้อมเฉลยทุกชุดที่เกี่ยวข้อง## ✨ ฟีเจอร์หลัก## ✨ ฟีเจอร์หลัก

- ✅ รองรับการแสดงผลรูปภาพหลายรูป

- ✅ หน้าค้นหาแยกสำหรับนักเรียนและ Admin



### 🎨 User Interface### 🔐 ระบบ Authentication### 🔐 ระบบ Authentication

- ✅ Admin Dashboard - สถิติและฟอร์มค้นหา

- ✅ Student Search Page - หน้าค้นหาสำหรับนักเรียน- ✅ เข้าสู่ระบบด้วย JWT (JSON Web Tokens)- ✅ Login ด้วย JWT Authentication

- ✅ Responsive Design - ใช้งานได้ทั้ง Mobile และ Desktop

- ✅ Beautiful Gradients - พื้นหลัง Gradient และ Glass Effect- ✅ Protected Routes สำหรับหน้า Admin- ✅ Protected Routes สำหรับ Admin

- ✅ Smooth Animations - การเคลื่อนไหวที่ลื่นไหล

- ✅ ออกจากระบบพร้อมลบ Session- ✅ Session Management

---

- ✅ ตรวจสอบสิทธิ์อัตโนมัติ

## 🏗️ สถาปัตยกรรมระบบ

### 📝 จัดการโจทย์ (Questions)

```

┌─────────────────────────────────────────────────────────────┐### 📝 จัดการโจทย์ (Questions)- ✅ เพิ่ม/แก้ไข/ลบโจทย์

│                      Frontend (React)                        │

│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │- ✅ เพิ่มโจทย์พร้อมรูปภาพ (PNG, JPG, GIF)- ✅ อัปโหลดรูปภาพโจทย์ (PNG, JPG, GIF)

│  │ Admin Pages  │  │ Student Page │  │  Components  │      │

│  │ - Dashboard  │  │ - Search     │  │ - Navigation │      │- ✅ แก้ไขข้อมูลโจทย์- ✅ ค้นหาโจทย์ด้วย Book ID + Page + Question Number

│  │ - Add Q/S    │  │              │  │ - Protected  │      │

│  │ - Manage Q/S │  │              │  │   Route      │      │- ✅ ลบโจทย์ (Cascade delete เฉลยที่เชื่อมโยง)- ✅ แสดงรายการโจทย์ทั้งหมดพร้อม Pagination

│  └──────────────┘  └──────────────┘  └──────────────┘      │

│            │                 │                 │             │- ✅ ค้นหาด้วย Book ID, Page, Question Number

│            └─────────────────┴─────────────────┘             │

│                           │ Axios                            │- ✅ แสดงรายการโจทย์พร้อมสถานะ (มีเฉลยหรือยัง)### ✅ จัดการเฉลย (Solutions) - Many-to-Many

└───────────────────────────┼──────────────────────────────────┘

                            │- ✅ สร้างเฉลยแยกจากโจทย์ (Independent Solutions)

┌───────────────────────────┼──────────────────────────────────┐

│                    Backend (FastAPI)                         │### ✅ จัดการเฉลย (Solutions) - Many-to-Many- ✅ อัปโหลดรูปภาพหลายรูปต่อเฉลย (Multiple Images per Solution)

│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │

│  │  Auth API    │  │ Questions API│  │ Solutions API│      │- ✅ สร้างเฉลยแยกจากโจทย์ (Independent)- ✅ เชื่อมโยงโจทย์กับเฉลยแบบยืดหยุ่น (Link/Unlink)

│  │ - Login      │  │ - CRUD       │  │ - CRUD       │      │

│  │ - JWT        │  │ - Upload     │  │ - Upload     │      │- ✅ อัปโหลดรูปภาพหลายรูปต่อเฉลย (สูงสุด 5 รูป)- ✅ แสดงเฉลยทั้งหมดที่เชื่อมกับโจทย์

│  └──────────────┘  └──────────────┘  └──────────────┘      │

│            │                 │                 │             │- ✅ เรียงลำดับรูปภาพ (Order numbering)- ✅ เรียงลำดับรูปภาพ (Image Ordering)

│            └─────────────────┴─────────────────┘             │

│                           │ SQLAlchemy ORM                   │- ✅ เชื่อมโยงโจทย์กับเฉลยแบบยืดหยุ่น

└───────────────────────────┼──────────────────────────────────┘

                            │- ✅ ยกเลิกการเชื่อมโยง (Unlink)### 🔍 ระบบค้นหา

┌───────────────────────────┼──────────────────────────────────┐

│                    Database (MySQL)                          │- ✅ แสดงโจทย์ที่เชื่อมกับเฉลยแต่ละชุด- ✅ ค้นหาโจทย์ + เฉลยพร้อมกัน (`/api/qa/{book_id}/{page}/{question_no}`)

│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │

│  │  questions   │←─┤question_     │─→│  solutions   │      │- ✅ แสดงผลโจทย์พร้อมเฉลยทุกชุดที่เกี่ยวข้อง

│  │              │  │ solutions    │  │              │      │

│  └──────────────┘  └──────────────┘  └──────────────┘      │### 🔗 ระบบเชื่อมโยง (Link Management)- ✅ รองรับการแสดงผลรูปภาพหลายรูป

│                                             ↓                │

│                                      ┌──────────────┐        │- ✅ หน้าเชื่อมโยงโจทย์-เฉลยแบบ Visual

│                                      │solution_     │        │

│                                      │ images       │        │- ✅ แสดงรูปตัวอย่างขณะเลือก (Live Preview)### 🎨 User Interface

│                                      └──────────────┘        │

└──────────────────────────────────────────────────────────────┘- ✅ Modal ยืนยันพร้อมแสดงรูปภาพเต็ม- ✅ Admin Dashboard - สถิติและฟอร์มค้นหา

```

- ✅ แสดงสถานะการเชื่อมโยง (จำนวนโจทย์/เฉลยที่เชื่อม)- ✅ Student Search Page - หน้าค้นหาสำหรับนักเรียน

---

- ✅ ค้นหาโจทย์และเฉลยได้ทั้งสองฝั่ง- ✅ Responsive Design - ใช้งานได้ทั้ง Mobile และ Desktop

## 🗄️ โครงสร้างฐานข้อมูล

- ✅ Beautiful Gradients - พื้นหลัง Gradient และ Glass Effect

### Entity Relationship Diagram

### 🎨 User Interface

```

┌─────────────────┐- ✅ **Admin Dashboard** - หน้าหลักพร้อมฟอร์มค้นหา---

│   questions     │

├─────────────────┤- ✅ **Student Search** - หน้าค้นหาสำหรับนักเรียน

│ id (PK)         │

│ book_id         │- ✅ **Responsive Design** - ใช้งานได้ทุกอุปกรณ์## 🏗️ สถาปัตยกรรมระบบ

│ page            │

│ question_no     │- ✅ **Glass Morphism** - พื้นหลัง Gradient พร้อม Backdrop Blur

│ question_text   │

│ question_img    │- ✅ **Smooth Animations** - Transitions และ Hover Effects```

│ created_at      │

└────────┬────────┘┌─────────────────────────────────────────────────────────────┐

         │ 1

         │---│                      Frontend (React)                        │

         │ N

┌────────┴────────────┐│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │

│ question_solutions  │ (Mapping Table)

├─────────────────────┤## 🏗️ สถาปัตยกรรมระบบ│  │ Admin Pages  │  │ Student Page │  │  Components  │      │

│ id (PK)             │

│ question_id (FK)    ││  │ - Dashboard  │  │ - Search     │  │ - Navigation │      │

│ solution_id (FK)    │

│ created_at          │```│  │ - Add Q/S    │  │              │  │ - Protected  │      │

└────────┬────────────┘

         │ N┌─────────────────────────────────────────────────────────────┐│  │ - Manage Q/S │  │              │  │   Route      │      │

         │

         │ 1│                    Frontend (React + TailwindCSS)            ││  └──────────────┘  └──────────────┘  └──────────────┘      │

┌────────┴────────┐         ┌─────────────────┐

│   solutions     │────────→│ solution_images ││  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      ││            │                 │                 │             │

├─────────────────┤    1:N  ├─────────────────┤

│ id (PK)         │         │ id (PK)         ││  │ Admin Pages  │  │ Student Page │  │  Components  │      ││            └─────────────────┴─────────────────┘             │

│ title           │         │ solution_id (FK)│

│ answer_text     │         │ image_path      ││  │ - Dashboard  │  │ - Search     │  │ - Navigation │      ││                           │ Axios                            │

│ created_at      │         │ image_order     │

│ updated_at      │         │ created_at      ││  │ - Add Q/S    │  │              │  │ - Protected  │      │└───────────────────────────┼──────────────────────────────────┘

└─────────────────┘         └─────────────────┘

```│  │ - Manage Q/S │  │              │  │   Route      │      │                            │



### ตารางข้อมูลหลัก│  │ - Link Q-S   │  │              │  │              │      │┌───────────────────────────┼──────────────────────────────────┐



#### `questions` - ตารางโจทย์│  └──────────────┘  └──────────────┘  └──────────────┘      ││                    Backend (FastAPI)                         │

| Column | Type | Description |

|--------|------|-------------|│            │                 │                 │             ││  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │

| id | INT (PK) | รหัสโจทย์ |

| book_id | VARCHAR(50) | รหัสหนังสือ |│            └─────────────────┴─────────────────┘             ││  │  Auth API    │  │ Questions API│  │ Solutions API│      │

| page | INT | หน้าหนังสือ |

| question_no | INT | ข้อที่ |│                       │ HTTP (Axios)                         ││  │ - Login      │  │ - CRUD       │  │ - CRUD       │      │

| question_text | TEXT | ข้อความโจทย์ |

| question_img | VARCHAR(255) | ไฟล์รูปโจทย์ |└───────────────────────┼──────────────────────────────────────┘│  │ - JWT        │  │ - Upload     │  │ - Upload     │      │

| created_at | TIMESTAMP | วันที่สร้าง |

                        ││  └──────────────┘  └──────────────┘  └──────────────┘      │

#### `solutions` - ตารางเฉลย

| Column | Type | Description |┌───────────────────────┼──────────────────────────────────────┐│            │                 │                 │             │

|--------|------|-------------|

| id | INT (PK) | รหัสเฉลย |│                Backend (FastAPI + SQLAlchemy)                ││            └─────────────────┴─────────────────┘             │

| title | VARCHAR(255) | ชื่อเฉลย |

| answer_text | TEXT | ข้อความเฉลย |│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      ││                           │ SQLAlchemy ORM                   │

| created_at | TIMESTAMP | วันที่สร้าง |

| updated_at | TIMESTAMP | วันที่แก้ไข |│  │  Auth API    │  │ Questions API│  │ Solutions API│      │└───────────────────────────┼──────────────────────────────────┘



#### `solution_images` - ตารางรูปภาพเฉลย│  │ - Login      │  │ - CRUD       │  │ - CRUD       │      │                            │

| Column | Type | Description |

|--------|------|-------------|│  │ - JWT        │  │ - Upload Img │  │ - Upload Imgs│      │┌───────────────────────────┼──────────────────────────────────┐

| id | INT (PK) | รหัสรูปภาพ |

| solution_id | INT (FK) | รหัสเฉลย |│  │              │  │ - Search     │  │ - Link/Unlink│      ││                    Database (MySQL)                          │

| image_path | VARCHAR(255) | ไฟล์รูปภาพ |

| image_order | INT | ลำดับการแสดง |│  └──────────────┘  └──────────────┘  └──────────────┘      ││  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │

| created_at | TIMESTAMP | วันที่อัปโหลด |

│            │                 │                 │             ││  │  questions   │←─┤question_     │─→│  solutions   │      │

#### `question_solutions` - ตารางเชื่อมโยง (Mapping)

| Column | Type | Description |│            └─────────────────┴─────────────────┘             ││  │              │  │ solutions    │  │              │      │

|--------|------|-------------|

| id | INT (PK) | รหัส |│                    │ SQLAlchemy ORM                          ││  └──────────────┘  └──────────────┘  └──────────────┘      │

| question_id | INT (FK) | รหัสโจทย์ |

| solution_id | INT (FK) | รหัสเฉลย |└────────────────────┼─────────────────────────────────────────┘│                                             ↓                │

| created_at | TIMESTAMP | วันที่เชื่อม |

                     ││                                      ┌──────────────┐        │

---

┌────────────────────┼─────────────────────────────────────────┐│                                      │solution_     │        │

## 📋 ข้อกำหนดของระบบ

│                Database (MySQL 8.0)                          ││                                      │ images       │        │

### ✅ Software Requirements

│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      ││                                      └──────────────┘        │

- **Python** 3.10 หรือสูงกว่า

- **Node.js** 16.0 หรือสูงกว่า│  │  users       │  │  questions   │  │  solutions   │      │└──────────────────────────────────────────────────────────────┘

- **MySQL** 8.0 หรือสูงกว่า

- **Git** (สำหรับ Clone repository)│  │              │  │              │  │              │      │```



### 💻 Hardware Requirements (แนะนำ)│  └──────────────┘  └──────┬───────┘  └──────┬───────┘      │



- **RAM**: 4GB ขึ้นไป│                           │                  │               │---

- **Storage**: 2GB+ สำหรับ dependencies และรูปภาพ

- **CPU**: 2 cores ขึ้นไป│                    ┌──────┴──────────────────┴───────┐      │



---│                    │   question_solutions (M2M)      │      │## 🗄️ โครงสร้างฐานข้อมูล



## 🚀 การติดตั้ง│                    └─────────────────────────────────┘      │



### 📥 1. Clone Repository│                                    │                         │### Entity Relationship Diagram



```bash│                             ┌──────┴───────┐                │

git clone https://github.com/Natthasat/idealguru.git

cd guru-web│                             │solution_images│                │```

```

│                             └───────────────┘                │┌─────────────────┐

### 🗄️ 2. ตั้งค่าฐานข้อมูล MySQL

└──────────────────────────────────────────────────────────────┘│   questions     │

เปิด MySQL และสร้าง Database:

```├─────────────────┤

```sql

CREATE DATABASE guru_DB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;│ id (PK)         │

```

---│ book_id         │

แก้ไขไฟล์ `backend/database.py`:

│ page            │

```python

DATABASE_URL = "mysql+pymysql://root:yourpassword@localhost:3306/guru_DB"## 🗄️ โครงสร้างฐานข้อมูล│ question_no     │

```

│ question_text   │

### ⚙️ 3. ติดตั้ง Backend

### Entity Relationship Diagram│ question_img    │

```bash

cd backend│ created_at      │



# สร้าง Virtual Environment (แนะนำ)```└────────┬────────┘

python -m venv venv

┌─────────────────┐         │ 1

# เปิดใช้งาน venv

# Windows PowerShell:│     users       │         │

venv\Scripts\activate

# Linux/Mac:├─────────────────┤         │ N

source venv/bin/activate

│ id (PK)         │┌────────┴────────────┐

# ติดตั้ง Dependencies

pip install -r requirements.txt│ username (UQ)   ││ question_solutions  │ (Mapping Table)



# สร้างผู้ใช้ Admin (username: admin, password: Hippo@2017)│ password_hash   │├─────────────────────┤

python scripts/create_admin.py

│ created_at      ││ id (PK)             │

# รัน Backend Server

python main.py└─────────────────┘│ question_id (FK)    │

```

│ solution_id (FK)    │

✅ Backend จะรันที่ `http://localhost:8000`  

📖 API Docs: `http://localhost:8000/docs`│ created_at          │



### 🎨 4. ติดตั้ง Frontend┌─────────────────┐└────────┬────────────┘



เปิด Terminal ใหม่:│   questions     │         │ N



```bash├─────────────────┤         │

cd frontend

│ id (PK)         │         │ 1

# ติดตั้ง Dependencies

npm install│ book_id         │┌────────┴────────┐         ┌─────────────────┐



# รัน Development Server│ page            ││   solutions     │────────→│ solution_images │

npm start

```│ question_no     │├─────────────────┤    1:N  ├─────────────────┤



✅ Frontend จะรันที่ `http://localhost:3000`│ question_text   ││ id (PK)         │         │ id (PK)         │



### 🐳 5. (ทางเลือก) ใช้ Docker Compose│ question_img    ││ title           │         │ solution_id (FK)│



```bash│ created_at      ││ answer_text     │         │ image_path      │

# รันทั้งระบบด้วยคำสั่งเดียว

docker-compose up -d└────────┬────────┘│ created_at      │         │ image_order     │



# ตรวจสอบ logs         │ 1│ updated_at      │         │ created_at      │

docker-compose logs -f

         │└─────────────────┘         └─────────────────┘

# หยุดระบบ

docker-compose down         │ N```

```

┌────────┴────────────┐

### 🎉 6. เข้าใช้งาน

│ question_solutions  │ (Mapping Table - Many to Many)### ตารางข้อมูลหลัก

เปิดเบราว์เซอร์ไปที่ `http://localhost:3000`

├─────────────────────┤

**ข้อมูล Login (Default):**

- Username: `admin`│ id (PK)             │#### `questions` - ตารางโจทย์

- Password: `Hippo@2017`

│ question_id (FK)    │| Column | Type | Description |

---

│ solution_id (FK)    │|--------|------|-------------|

## 📘 วิธีใช้งาน

│ created_at          │| id | INT (PK) | รหัสโจทย์ |

### 👨‍💼 สำหรับผู้ดูแลระบบ (Admin)

└────────┬────────────┘| book_id | VARCHAR(50) | รหัสหนังสือ |

#### 1️⃣ เข้าสู่ระบบ

         │ N| page | INT | หน้าหนังสือ |

1. ไปที่ `http://localhost:3000`

2. กรอก Username และ Password         │| question_no | INT | ข้อที่ |

3. คลิก "เข้าสู่ระบบ"

         │ 1| question_text | TEXT | ข้อความโจทย์ |

#### 2️⃣ เพิ่มโจทย์

┌────────┴────────┐         ┌─────────────────┐| question_img | VARCHAR(255) | ไฟล์รูปโจทย์ |

```

Dashboard → เพิ่มโจทย์│   solutions     │────────→│ solution_images │| created_at | TIMESTAMP | วันที่สร้าง |

├─ กรอก Book ID (เช่น IPL25122-0652)

├─ กรอกหน้า (เช่น 5)├─────────────────┤    1:N  ├─────────────────┤

├─ กรอกข้อที่ (เช่น 2)

├─ (Optional) กรอกข้อความโจทย์│ id (PK)         │         │ id (PK)         │#### `solutions` - ตารางเฉลย

├─ (Optional) อัปโหลดรูปโจทย์

└─ คลิก "เพิ่มโจทย์"│ title           │         │ solution_id (FK)│| Column | Type | Description |

```

│ answer_text     │         │ image_path      │|--------|------|-------------|

💡 **Tips:** ระบบจะจำ Book ID ล่าสุด เพื่อความสะดวกในการเพิ่มข้อถัดไป

│ created_at      │         │ image_order     │| id | INT (PK) | รหัสเฉลย |

#### 3️⃣ เพิ่มเฉลย (Many-to-Many)

│ updated_at      │         │ created_at      │| title | VARCHAR(255) | ชื่อเฉลย |

```

Dashboard → เพิ่มเฉลย└─────────────────┘         └─────────────────┘| answer_text | TEXT | ข้อความเฉลย |

├─ กรอกชื่อเฉลย (Optional)

├─ กรอกข้อความเฉลย```| created_at | TIMESTAMP | วันที่สร้าง |

├─ อัปโหลดรูปภาพหลายรูป (สูงสุด 5 รูป)

│  └─ รูปจะถูกเรียงตามลำดับ (1, 2, 3...)| updated_at | TIMESTAMP | วันที่แก้ไข |

└─ คลิก "บันทึกเฉลย"

```### ตารางข้อมูลหลัก



💡 **Tips:** ควรอัปโหลดรูปตามขั้นตอนการทำโจทย์ (Step 1, Step 2, ...)#### `solution_images` - ตารางรูปภาพเฉลย



#### 4️⃣ เชื่อมโยงโจทย์กับเฉลย ⭐#### 📋 `users` - ผู้ใช้งาน| Column | Type | Description |



```| Column | Type | Description ||--------|------|-------------|

Dashboard → เชื่อมโจทย์กับเฉลย

├─ ค้นหาและเลือกโจทย์ (ด้านซ้าย)|--------|------|-------------|| id | INT (PK) | รหัสรูปภาพ |

│  └─ ระบบจะแสดงรูปโจทย์ตัวอย่างด้านล่าง

├─ ค้นหาและเลือกเฉลย (ด้านขวา)| id | INT (PK) | รหัสผู้ใช้ || solution_id | INT (FK) | รหัสเฉลย |

│  └─ ระบบจะแสดงรูปเฉลยตัวอย่างด้านล่าง

├─ ตรวจสอบรูปภาพว่าถูกต้อง| username | VARCHAR(50) UNIQUE | ชื่อผู้ใช้ || image_path | VARCHAR(255) | ไฟล์รูปภาพ |

├─ คลิก "เชื่อมโยงโจทย์กับเฉลย"

└─ ยืนยันใน Modal (แสดงรูปภาพเต็ม)| password_hash | VARCHAR(255) | รหัสผ่านที่เข้ารหัส || image_order | INT | ลำดับการแสดง |

```

| created_at | TIMESTAMP | วันที่สร้าง || created_at | TIMESTAMP | วันที่อัปโหลด |

**🎯 ฟีเจอร์พิเศษ:**

- ✅ แสดงสถานะ "✅ มีเฉลยแล้ว (X เฉลย)" สำหรับโจทย์

- ✅ แสดงสถานะ "🔗 เชื่อมกับ X โจทย์" สำหรับเฉลย

- ✅ Modal ยืนยันพร้อมแสดงรูปภาพทั้งหมด#### 📝 `questions` - โจทย์#### `question_solutions` - ตารางเชื่อมโยง (Mapping)

- ✅ ป้องกันการเชื่อมซ้ำ

| Column | Type | Description || Column | Type | Description |

#### 5️⃣ จัดการโจทย์/เฉลย

|--------|------|-------------||--------|------|-------------|

**จัดการโจทย์:**

```| id | INT (PK) | รหัสโจทย์ || id | INT (PK) | รหัส |

Dashboard → จัดการโจทย์

├─ ค้นหาโจทย์| book_id | VARCHAR(50) | รหัสหนังสือ || question_id | INT (FK) | รหัสโจทย์ |

├─ ดูรายละเอียดพร้อมรูปภาพ

├─ แก้ไขข้อมูล| page | INT | หน้าหนังสือ || solution_id | INT (FK) | รหัสเฉลย |

└─ ลบโจทย์ (จะลบการเชื่อมโยงด้วย)

```| question_no | INT | ข้อที่ || created_at | TIMESTAMP | วันที่เชื่อม |



**จัดการเฉลย:**| question_text | TEXT | ข้อความโจทย์ |

```

Dashboard → จัดการเฉลย| question_img | VARCHAR(255) | ไฟล์รูปโจทย์ |---

├─ ค้นหาเฉลย

├─ ดูรายละเอียดพร้อมรูปภาพทั้งหมด| created_at | TIMESTAMP | วันที่สร้าง |

├─ ดูโจทย์ที่เชื่อมโยง

├─ แก้ไขข้อมูล## 🚀 การติดตั้ง

└─ ลบเฉลย (จะลบรูปและการเชื่อมโยงด้วย)

```#### ✅ `solutions` - เฉลย



#### 6️⃣ ออกจากระบบ| Column | Type | Description |### ✅ ความต้องการของระบบ



คลิกปุ่ม "ออกจากระบบ" (สีแดง) มุมบนขวา|--------|------|-------------|



---| id | INT (PK) | รหัสเฉลย |- Python 3.10+



### 👨‍🎓 สำหรับนักเรียน (Student)| title | VARCHAR(255) | ชื่อเฉลย |- Node.js 16+



#### 🔍 ค้นหาโจทย์และเฉลย| answer_text | TEXT | ข้อความเฉลย |- MySQL 8.0+



```| created_at | TIMESTAMP | วันที่สร้าง |- Git

1. ใช้ฟอร์มค้นหาในหน้า Dashboard

2. กรอกข้อมูล:| updated_at | TIMESTAMP | วันที่แก้ไข |

   ├─ Book ID: IPL25122-0652

   ├─ Page: 5### 📥 1. Clone Repository

   └─ Question No: 2

3. คลิก "ค้นหา"#### 🖼️ `solution_images` - รูปภาพเฉลย

4. ระบบจะแสดง:

   ├─ ข้อมูลโจทย์ + รูปภาพ (ถ้ามี)| Column | Type | Description |```bash

   └─ เฉลยทุกชุดที่เกี่ยวข้อง (Many-to-Many)

       └─ รูปภาพเฉลยทุกรูป (เรียงตามลำดับ)|--------|------|-------------|git clone https://github.com/Natthasat/idealguru.git

```

| id | INT (PK) | รหัสรูปภาพ |cd guru-web

**ตัวอย่างผลลัพธ์:**

```| solution_id | INT (FK) | รหัสเฉลย |```

📝 โจทย์: IPL25122-0652 หน้า 5 ข้อ 2

└─ [รูปโจทย์]| image_path | VARCHAR(255) | path ไฟล์รูปภาพ |



✅ เฉลยที่ 1: วิธีที่ 1| image_order | INT | ลำดับการแสดง |### 🗄️ 2. ตั้งค่าฐานข้อมูล MySQL

├─ รูปที่ 1: [รูปขั้นตอนที่ 1]

├─ รูปที่ 2: [รูปขั้นตอนที่ 2]| created_at | TIMESTAMP | วันที่อัปโหลด |

└─ รูปที่ 3: [รูปขั้นตอนที่ 3]

```sql

✅ เฉลยที่ 2: วิธีที่ 2 (ทางลัด)

└─ รูปที่ 1: [รูปวิธีลัด]#### 🔗 `question_solutions` - ตารางเชื่อมโยงCREATE DATABASE guru_DB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

```

| Column | Type | Description |```

---

|--------|------|-------------|

## 📡 API Documentation

| id | INT (PK) | รหัส |แก้ไขไฟล์ `backend/database.py`:

### 🔐 Authentication

| question_id | INT (FK) | รหัสโจทย์ |

#### Login

```http| solution_id | INT (FK) | รหัสเฉลย |```python

POST /api/auth/login

Content-Type: application/json| created_at | TIMESTAMP | วันที่เชื่อม |DATABASE_URL = "mysql+pymysql://root:yourpassword@localhost:3306/guru_DB"



{```

  "username": "admin",

  "password": "Hippo@2017"---

}

### ⚙️ 3. ติดตั้ง Backend

Response: 

{## 🚀 การติดตั้ง

  "access_token": "eyJhbGc...",

  "token_type": "bearer"```bash

}

```### ✅ ความต้องการของระบบcd backend



---



### 📝 Questions API- **Python** 3.10 ขึ้นไป# สร้าง Virtual Environment



#### เพิ่มโจทย์- **Node.js** 16.0 ขึ้นไปpython -m venv venv

```http

POST /api/questions- **MySQL** 8.0 ขึ้นไป

Content-Type: multipart/form-data

Authorization: Bearer {token}- **Git**# เปิดใช้งาน venv



book_id: string# Windows:

page: integer

question_no: integer### 📥 1. Clone Repositoryvenv\Scripts\activate

question_text: string (optional)

question_img: file (optional)# Linux/Mac:

```

```bashsource venv/bin/activate

#### ดูโจทย์ทั้งหมดพร้อมเฉลย

```httpgit clone https://github.com/Natthasat/idealguru.git

GET /api/questions

Authorization: Bearer {token}cd guru-web# ติดตั้ง Dependencies



Response:```pip install -r requirements.txt

[

  {

    "id": 1,

    "book_id": "IPL25122-0652",### 🗄️ 2. ตั้งค่าฐานข้อมูล MySQL# รัน Backend Server

    "page": 5,

    "question_no": 2,python main.py

    "question_text": "...",

    "question_img": "uploads/xxx.png",เปิด MySQL และสร้าง Database:```

    "solutions": [

      {

        "id": 1,

        "title": "วิธีที่ 1"```sqlBackend จะรันที่ `http://localhost:8000`  

      }

    ]CREATE DATABASE guru_DB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;API Docs: `http://localhost:8000/docs`

  }

]```

```

### 🎨 4. ติดตั้ง Frontend

#### ลบโจทย์

```httpแก้ไขไฟล์ `backend/database.py` ให้ตรงกับ MySQL ของคุณ:

DELETE /api/questions/{question_id}

Authorization: Bearer {token}```bash

```

```pythoncd frontend

---

DATABASE_URL = "mysql+pymysql://root:yourpassword@localhost:3306/guru_DB"

### ✅ Solutions API (Many-to-Many)

```# ติดตั้ง Dependencies

#### สร้างเฉลยใหม่

```httpnpm install

POST /api/solutions

Content-Type: application/json### ⚙️ 3. ติดตั้ง Backend

Authorization: Bearer {token}

# รัน Development Server

{

  "title": "วิธีที่ 1",```bashnpm start

  "answer_text": "คำอธิบายวิธีทำ..."

}cd backend```



Response:

{

  "id": 1,# ติดตั้ง DependenciesFrontend จะรันที่ `http://localhost:3000`

  "title": "วิธีที่ 1",

  "answer_text": "...",pip install -r requirements.txt

  "images": [],

  "created_at": "2025-10-06T10:00:00"### 🐳 5. (ทางเลือก) ใช้ Docker Compose

}

```# สร้างผู้ใช้ admin (username: admin, password: admin)



#### อัปโหลดรูปภาพเฉลย (หลายรูป)python create_admin.py```bash

```http

POST /api/solutions/{solution_id}/images# รันทั้งระบบด้วยคำสั่งเดียว

Content-Type: multipart/form-data

Authorization: Bearer {token}# รัน Backend Serverdocker-compose up -d



images: file[]python main.py



Response:```# ตรวจสอบ logs

[

  {docker-compose logs -f

    "id": 1,

    "solution_id": 1,✅ Backend จะรันที่ `http://localhost:8000`  

    "image_path": "uploads/image1.png",

    "image_order": 0📖 API Docs: `http://localhost:8000/docs`# หยุดระบบ

  },

  {docker-compose down

    "id": 2,

    "solution_id": 1,### 🎨 4. ติดตั้ง Frontend```

    "image_path": "uploads/image2.png",

    "image_order": 1

  }

]เปิด Terminal ใหม่:---

```



#### ดูเฉลยทั้งหมดพร้อมโจทย์ที่เชื่อม

```http```bash## 📘 วิธีใช้งาน

GET /api/solutions

Authorization: Bearer {token}cd frontend



Response:### 👨‍💼 สำหรับผู้ดูแล (Admin)

[

  {# ติดตั้ง Dependencies

    "id": 1,

    "title": "วิธีที่ 1",npm install#### 1. เข้าสู่ระบบ

    "answer_text": "...",

    "images": [

      {

        "id": 1,# รัน Development Server- ไปที่ `http://localhost:3000`

        "image_path": "uploads/image1.png",

        "image_order": 0npm start- Login ด้วยบัญชี admin

      }

    ],```- (Default: สร้างผ่าน `backend/create_admin.py`)

    "linked_questions": [

      {

        "id": 1,

        "book_id": "IPL25122-0652",✅ Frontend จะรันที่ `http://localhost:3000`#### 2. เพิ่มโจทย์

        "page": 5,

        "question_no": 2

      }

    ]### 🎉 5. เข้าใช้งาน```

  }

]Admin Dashboard → เพิ่มโจทย์

```

เปิดเบราว์เซอร์ไปที่ `http://localhost:3000`- กรอก Book ID, Page, Question No

#### ลบเฉลย

```http- (Optional) เพิ่มข้อความโจทย์

DELETE /api/solutions/{solution_id}

Authorization: Bearer {token}**ข้อมูล Login:**- (Optional) อัปโหลดรูปภาพโจทย์

```

- Username: `admin`- คลิก "เพิ่มโจทย์"

---

- Password: `admin````

### 🔗 Link Management API



#### เชื่อมโยงโจทย์กับเฉลย

```http---#### 3. เพิ่มเฉลย (แบบใหม่ Many-to-Many)

POST /api/questions/{question_id}/solutions/{solution_id}

Authorization: Bearer {token}



Response:## 📘 วิธีใช้งาน```

{

  "message": "เชื่อมโยงสำเร็จ",Admin Dashboard → เพิ่มเฉลย

  "question_id": 1,

  "solution_id": 1### 👨‍💼 สำหรับผู้ดูแลระบบ (Admin)- กรอกชื่อเฉลย (Optional)

}

```- กรอกข้อความเฉลย



#### ยกเลิกการเชื่อมโยง#### 1️⃣ เข้าสู่ระบบ- อัปโหลดรูปภาพหลายรูป (สูงสุด 5 รูป)

```http

DELETE /api/questions/{question_id}/solutions/{solution_id}- คลิก "บันทึกเฉลย"

Authorization: Bearer {token}

1. ไปที่ `http://localhost:3000````

Response:

{2. กรอก Username: `admin`, Password: `admin`

  "message": "ยกเลิกการเชื่อมโยงสำเร็จ"

}3. คลิก "เข้าสู่ระบบ"#### 4. เชื่อมโยงโจทย์กับเฉลย

```



---

#### 2️⃣ เพิ่มโจทย์```

### 🔍 Search API

Admin Dashboard → เชื่อมโจทย์-เฉลย

#### ค้นหาโจทย์ + เฉลยพร้อมกัน

```http```- เลือกโจทย์จากรายการซ้าย

GET /api/qa/{book_id}/{page}/{question_no}

Dashboard → เพิ่มโจทย์- เลือกเฉลยจากรายการขวา

Example: GET /api/qa/IPL25122-0652/5/2

├─ กรอก Book ID (เช่น IPL25122-0652)- คลิก "เชื่อมโยง"

Response:

{├─ กรอกหน้า (เช่น 5)```

  "id": 1,

  "book_id": "IPL25122-0652",├─ กรอกข้อที่ (เช่น 2)

  "page": 5,

  "question_no": 2,├─ (Optional) กรอกข้อความโจทย์#### 5. จัดการโจทย์/เฉลย

  "question_text": "...",

  "question_img": "uploads/xxx.png",├─ (Optional) อัปโหลดรูปโจทย์

  "solutions": [

    {└─ คลิก "เพิ่มโจทย์"```

      "id": 1,

      "title": "วิธีที่ 1",```Admin Dashboard → จัดการโจทย์/จัดการเฉลย

      "answer_text": "...",

      "images": [- ดูรายการทั้งหมด

        {

          "id": 1,💡 **Tips:** ระบบจะจำ Book ID ล่าสุด เพื่อความสะดวกในการเพิ่มข้อถัดไป- แก้ไข/ลบ ข้อมูล

          "image_path": "uploads/yyy.png",

          "image_order": 0- ค้นหาด้วย Search Bar

        },

        {#### 3️⃣ เพิ่มเฉลย (Many-to-Many)```

          "id": 2,

          "image_path": "uploads/zzz.png",

          "image_order": 1

        }```### 👨‍🎓 สำหรับนักเรียน (Student)

      ]

    }Dashboard → เพิ่มเฉลย

  ]

}├─ กรอกชื่อเฉลย (Optional)#### ค้นหาโจทย์และเฉลย

```

├─ กรอกข้อความเฉลย

### ตัวอย่างการเรียกใช้ด้วย JavaScript

├─ อัปโหลดรูปภาพหลายรูป (สูงสุด 5 รูป)```

```javascript

// ค้นหาโจทย์และเฉลย│  └─ รูปจะถูกเรียงตามลำดับ (1, 2, 3...)1. ไปที่ /student/search หรือใช้ฟอร์มค้นหาในหน้า Admin

import axios from 'axios';

└─ คลิก "บันทึกเฉลย"2. กรอก:

const API_BASE_URL = 'http://localhost:8000/api';

```   - Book ID: เช่น IPL25122-0652

// ค้นหา

async function searchQuestion(bookId, page, questionNo) {   - Page: เช่น 5

  try {

    const response = await axios.get(💡 **Tips:** ควรอัปโหลดรูปตามขั้นตอนการทำโจทย์ (Step 1, Step 2, ...)   - Question No: เช่น 2

      `${API_BASE_URL}/qa/${bookId}/${page}/${questionNo}`

    );3. คลิก "ค้นหา"

    console.log('Question:', response.data);

    console.log('Solutions:', response.data.solutions);#### 4️⃣ เชื่อมโยงโจทย์กับเฉลย ⭐4. ระบบจะแสดง:

  } catch (error) {

    console.error('Error:', error.response?.data || error.message);   - โจทย์พร้อมรูปภาพ (ถ้ามี)

  }

}```   - เฉลยทุกชุดที่เกี่ยวข้อง



// เพิ่มโจทย์Dashboard → เชื่อมโจทย์กับเฉลย   - รูปภาพเฉลยทุกรูป (เรียงตาม order)

async function addQuestion(formData) {

  const data = new FormData();├─ ค้นหาและเลือกโจทย์ (ด้านซ้าย)```

  data.append('book_id', formData.book_id);

  data.append('page', formData.page);│  └─ ระบบจะแสดงรูปโจทย์ตัวอย่างด้านล่าง

  data.append('question_no', formData.question_no);

  if (formData.question_text) data.append('question_text', formData.question_text);├─ ค้นหาและเลือกเฉลย (ด้านขวา)---

  if (formData.question_img) data.append('question_img', formData.question_img);

│  └─ ระบบจะแสดงรูปเฉลยตัวอย่างด้านล่าง

  const response = await axios.post(`${API_BASE_URL}/questions`, data);

  return response.data;├─ ตรวจสอบรูปภาพว่าถูกต้อง## 📡 API Documentation

}

├─ คลิก "เชื่อมโยงโจทย์กับเฉลย"

// เพิ่มเฉลยพร้อมรูปหลายรูป

async function addSolutionWithImages(solutionData, images) {└─ ยืนยันใน Modal (แสดงรูปภาพเต็ม)### Authentication

  // 1. สร้างเฉลย

  const solutionResponse = await axios.post(`${API_BASE_URL}/solutions`, solutionData);```

  const solutionId = solutionResponse.data.id;

#### Login

  // 2. อัปโหลดรูปภาพ

  const imageFormData = new FormData();**🎯 ฟีเจอร์พิเศษ:**```http

  images.forEach(image => imageFormData.append('images', image));

  await axios.post(`${API_BASE_URL}/solutions/${solutionId}/images`, imageFormData);- ✅ แสดงสถานะ "✅ มีเฉลยแล้ว (X เฉลย)" สำหรับโจทย์POST /api/auth/login



  return solutionId;- ✅ แสดงสถานะ "🔗 เชื่อมกับ X โจทย์" สำหรับเฉลยContent-Type: application/json

}

- ✅ Modal ยืนยันพร้อมแสดงรูปภาพทั้งหมด

// เชื่อมโยงโจทย์กับเฉลย

async function linkQuestionToSolution(questionId, solutionId) {- ✅ ป้องกันการเชื่อมซ้ำ{

  const response = await axios.post(

    `${API_BASE_URL}/questions/${questionId}/solutions/${solutionId}`  "username": "admin",

  );

  return response.data;#### 5️⃣ จัดการโจทย์/เฉลย  "password": "password"

}

}

// ใช้งาน

searchQuestion('IPL25122-0652', 5, 2);**จัดการโจทย์:**

```

```Response: { "access_token": "...", "token_type": "bearer" }

---

Dashboard → จัดการโจทย์```

## 📂 โครงสร้างโปรเจค

├─ ค้นหาโจทย์

```

guru-web/├─ ดูรายละเอียดพร้อมรูปภาพ### Questions API

├── 📁 backend/                     # FastAPI Backend

│   ├── 📄 main.py                 # Application entry point├─ แก้ไขข้อมูล

│   ├── 📄 database.py             # Database connection & session

│   ├── 📄 models.py               # SQLAlchemy ORM models (Many-to-Many)└─ ลบโจทย์ (จะลบการเชื่อมโยงด้วย)#### เพิ่มโจทย์

│   ├── 📄 auth.py                 # JWT Authentication

│   ├── 📄 requirements.txt        # Python dependencies``````http

│   ├── 📄 Dockerfile              # Backend container config

│   ├── 📁 routes/                 # API route modulesPOST /api/questions

│   │   ├── 📄 __init__.py

│   │   ├── 📄 auth.py            # Authentication endpoints**จัดการเฉลย:**Content-Type: multipart/form-data

│   │   ├── 📄 questions.py       # Question CRUD API

│   │   └── 📄 solutions.py       # Solution CRUD API (Many-to-Many)```

│   ├── 📁 scripts/                # Utility scripts

│   │   └── 📄 create_admin.py    # Script สร้าง admin userDashboard → จัดการเฉลยbook_id: string

│   └── 📁 uploads/                # File storage (images)

│├─ ค้นหาเฉลยpage: integer

├── 📁 frontend/                    # React Frontend

│   ├── 📄 package.json            # Node.js dependencies├─ ดูรายละเอียดพร้อมรูปภาพทั้งหมดquestion_no: integer

│   ├── 📄 tailwind.config.js      # TailwindCSS config

│   ├── 📄 postcss.config.js├─ ดูโจทย์ที่เชื่อมโยงquestion_text: string (optional)

│   ├── 📄 Dockerfile              # Frontend container config

│   ├── 📁 public/├─ แก้ไขข้อมูลquestion_img: file (optional)

│   │   └── 📄 index.html

│   └── 📁 src/└─ ลบเฉลย (จะลบรูปและการเชื่อมโยงด้วย)```

│       ├── 📄 App.js              # Main application & routing

│       ├── 📄 index.js            # Entry point```

│       ├── 📄 index.css           # Global styles

│       ├── 📁 components/#### ดูโจทย์ทั้งหมด

│       │   ├── 📄 Navigation.jsx      # Navigation bar

│       │   └── 📄 ProtectedRoute.jsx  # Route protection HOC#### 6️⃣ ออกจากระบบ```http

│       └── 📁 pages/

│           ├── 📄 Login.jsx                    # Admin login pageGET /api/questions

│           ├── 📄 AdminAddQuestion.jsx         # Add questions

│           ├── 📄 AdminManageQuestions.jsx     # Manage questions``````

│           ├── 📄 AdminAddSolution.jsx         # Add solutions (Many-to-Many)

│           ├── 📄 AdminManageSolutions.jsx     # Manage solutionsคลิกปุ่ม "ออกจากระบบ" (สีแดง) มุมบนขวา

│           └── 📄 SolutionSearch.jsx           # Solution search

│```#### ลบโจทย์

├── 📄 docker-compose.yml           # Multi-container orchestration

├── 📄 DEPLOY.md                    # Deployment guide```http

├── 📄 MIGRATION_GUIDE.md           # Many-to-Many migration guide

├── 📄 README.md                    # This file---DELETE /api/questions/{question_id}

└── 📄 .gitignore

``````



---### 👨‍🎓 สำหรับนักเรียน (Student)



## 🛠️ เทคโนโลยีที่ใช้### Solutions API (Many-to-Many)



### Backend Stack#### 🔍 ค้นหาโจทย์และเฉลย

| เทคโนโลยี | เวอร์ชัน | หน้าที่ |

|-----------|---------|---------|#### สร้างเฉลยใหม่

| **FastAPI** | 0.115.0 | Web framework (async, fast) |

| **SQLAlchemy** | 2.0.36 | ORM สำหรับจัดการ database |``````http

| **PyMySQL** | 1.1.1 | MySQL driver |

| **PyJWT** | 2.9.0 | JWT authentication |1. ใช้ฟอร์มค้นหาในหน้า DashboardPOST /api/solutions

| **Passlib** | 1.7.4 | Password hashing (bcrypt) |

| **bcrypt** | 4.0.1 | Cryptographic library |2. กรอกข้อมูล:Content-Type: multipart/form-data

| **Python-Multipart** | 0.0.12 | File upload support |

| **Uvicorn** | 0.32.0 | ASGI server |   ├─ Book ID: IPL25122-0652



### Frontend Stack   ├─ Page: 5title: string (optional)

| เทคโนโลยี | เวอร์ชัน | หน้าที่ |

|-----------|---------|---------|   └─ Question No: 2answer_text: string

| **React** | 18.2.0 | UI library |

| **React Router** | 6.18.0 | Client-side routing |3. คลิก "ค้นหา"```

| **Axios** | 1.6.0 | HTTP client |

| **TailwindCSS** | 3.3.0 | Utility-first CSS |4. ระบบจะแสดง:



### Database   ├─ ข้อมูลโจทย์ + รูปภาพ (ถ้ามี)#### อัปโหลดรูปภาพเฉลย

- **MySQL** 8.0+ - Relational database

- **Many-to-Many Architecture** - ความสัมพันธ์แบบยืดหยุ่น   └─ เฉลยทุกชุดที่เกี่ยวข้อง (Many-to-Many)```http



### DevOps       └─ รูปภาพเฉลยทุกรูป (เรียงตามลำดับ)POST /api/solutions/{solution_id}/images

- **Docker** - Containerization

- **Docker Compose** - Multi-container orchestration```Content-Type: multipart/form-data



---



## 🔧 การแก้ปัญหา**ตัวอย่างผลลัพธ์:**images: file[] (multiple files)



### ❌ ปัญหา: ไม่สามารถ Login ได้``````



**สาเหตุ:** ยังไม่มีผู้ใช้ในระบบ📝 โจทย์: IPL25122-0652 หน้า 5 ข้อ 2



**วิธีแก้:**└─ [รูปโจทย์]#### เชื่อมโยงโจทย์กับเฉลย

```bash

cd backend```http

python scripts/create_admin.py

```✅ เฉลยที่ 1: วิธีที่ 1POST /api/questions/{question_id}/solutions/{solution_id}



---├─ รูปที่ 1: [รูปขั้นตอนที่ 1]```



### ❌ ปัญหา: หน้าจอขาวเปล่า / Infinite Loop├─ รูปที่ 2: [รูปขั้นตอนที่ 2]



**สาเหตุ:** Token ชื่อไม่ตรงกันระหว่าง Login และ ProtectedRoute└─ รูปที่ 3: [รูปขั้นตอนที่ 3]#### ยกเลิกการเชื่อมโยง



**วิธีแก้:**```http

1. กด **F12** เปิด Console

2. พิมพ์: `localStorage.clear()`✅ เฉลยที่ 2: วิธีที่ 2 (ทางลัด)DELETE /api/questions/{question_id}/solutions/{solution_id}

3. กด **Enter**

4. **Refresh** หน้าเว็บ (F5)└─ รูปที่ 1: [รูปวิธีลัด]```

5. Login ใหม่

```

---

#### ดูเฉลยทั้งหมด

### ❌ ปัญหา: รูปภาพไม่แสดง

---```http

**สาเหตุ:** Path ไฟล์ไม่ถูกต้องหรือไฟล์ถูกลบ

GET /api/solutions

**ตรวจสอบ:**

- Backend: ตรวจสอบว่ามีโฟลเดอร์ `backend/uploads/`## 📡 API Documentation```

- Frontend: path ต้องเป็น `http://localhost:8000/uploads/filename.png`

- ตรวจสอบว่าไฟล์มีอยู่จริงใน `backend/uploads/`



**วิธีแก้:**### 🔐 Authentication### Combined Query

```bash

# ตรวจสอบว่ามีโฟลเดอร์ uploads

cd backend

mkdir -p uploads#### Login#### ค้นหาโจทย์ + เฉลยพร้อมกัน

```

```http```http

---

POST /api/auth/loginGET /api/qa/{book_id}/{page}/{question_no}

### ❌ ปัญหา: Cannot connect to MySQL

Content-Type: application/json

**วิธีแก้:**

1. ตรวจสอบว่า MySQL เปิดอยู่Example: GET /api/qa/IPL25122-0652/5/2

2. ตรวจสอบ `backend/database.py`:

   ```python{

   DATABASE_URL = "mysql+pymysql://root:รหัสผ่าน@localhost:3306/guru_DB"

   ```  "username": "admin",Response:

3. สร้าง database:

   ```sql  "password": "admin"{

   CREATE DATABASE guru_DB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

   ```}  "id": 1,



---  "book_id": "IPL25122-0652",



### ❌ ปัญหา: Port 8000 หรือ 3000 ถูกใช้แล้วResponse:  "page": 5,



**Windows PowerShell:**{  "question_no": 2,

```powershell

# ดู process ที่ใช้ port  "access_token": "eyJhbGc...",  "question_text": "...",

netstat -ano | findstr :8000

  "token_type": "bearer"  "question_img": "uploads/xxx.png",

# Kill process

taskkill /F /PID [PID_NUMBER]}  "solutions": [

```

```    {

**Linux/Mac:**

```bash      "id": 1,

# ดู process

lsof -i :8000---      "title": "วิธีที่ 1",



# Kill process      "answer_text": "...",

kill -9 [PID]

```### 📝 Questions API      "images": [



---        {



### ❌ ปัญหา: ModuleNotFoundError#### เพิ่มโจทย์          "id": 1,



**วิธีแก้:**```http          "image_path": "uploads/yyy.png",

```bash

# BackendPOST /api/questions          "image_order": 0

cd backend

pip install -r requirements.txtContent-Type: multipart/form-data        },



# FrontendAuthorization: Bearer {token}        {

cd frontend

npm install          "id": 2,

```

book_id: string          "image_path": "uploads/zzz.png",

---

page: integer          "image_order": 1

### ❌ ปัญหา: CORS Error

question_no: integer        }

**สาเหตุ:** Frontend URL ไม่ตรงกับที่กำหนดใน Backend

question_text: string (optional)      ]

**วิธีแก้:**

แก้ไข `backend/main.py`:question_img: file (optional)    }

```python

app.add_middleware(```  ]

    CORSMiddleware,

    allow_origins=[}

        "http://localhost:3000",

        "http://127.0.0.1:3000",#### ดูโจทย์ทั้งหมดพร้อมเฉลย```

        # เพิ่ม URL ของคุณที่นี่

    ],```http

    allow_credentials=True,

    allow_methods=["*"],GET /api/questions### ตัวอย่างการเรียกใช้ด้วย JavaScript

    allow_headers=["*"],

)Authorization: Bearer {token}

```

```javascript

---

Response:// ค้นหาโจทย์และเฉลย

## 🚢 การ Deploy

[import axios from 'axios';

### 📘 ดูคู่มือ Deploy แบบละเอียด

  {

สำหรับคำแนะนำการ Deploy แบบครบถ้วน โปรดอ่าน [DEPLOY.md](DEPLOY.md)

    "id": 1,const API_BASE_URL = 'http://localhost:8000/api';

### 🐳 Docker Deployment (แนะนำ)

    "book_id": "IPL25122-0652",

```bash

# Build และรันด้วย Docker Compose    "page": 5,// ค้นหา

docker-compose up -d

    "question_no": 2,async function searchQuestion(bookId, page, questionNo) {

# ตรวจสอบสถานะ

docker-compose ps    "question_text": "...",  try {



# ดู logs    "question_img": "uploads/xxx.png",    const response = await axios.get(

docker-compose logs -f

    "solutions": [      `${API_BASE_URL}/qa/${bookId}/${page}/${questionNo}`

# หยุดระบบ

docker-compose down      {    );

```

        "id": 1,    console.log('Question:', response.data);

### 🌐 Production Checklist

        "title": "วิธีที่ 1"    console.log('Solutions:', response.data.solutions);

- [ ] เปลี่ยนรหัสผ่าน admin

- [ ] ตั้งค่า Environment Variables      }  } catch (error) {

- [ ] ใช้ HTTPS (SSL Certificate)

- [ ] ตั้งค่า CORS อย่างเหมาะสม    ]    console.error('Error:', error.response?.data || error.message);

- [ ] Backup ฐานข้อมูลสม่ำเสมอ

- [ ] เปิด Firewall เฉพาะ port ที่จำเป็น  }  }

- [ ] ตั้งค่า Rate Limiting

- [ ] Monitor logs และ performance]}



---```



## 🎓 Best Practices// เพิ่มโจทย์



### 📝 การตั้งชื่อไฟล์#### ลบโจทย์async function addQuestion(formData) {

- โจทย์: `book_id_page_question.png` (เช่น `IPL25122-0652_5_2.png`)

- เฉลย: `solution_01_step1.png`, `solution_01_step2.png````http  const data = new FormData();



### 🖼️ การอัปโหลดรูปDELETE /api/questions/{question_id}  data.append('book_id', formData.book_id);

- ขนาดไฟล์: ไม่เกิน 5MB

- ไฟล์ที่รองรับ: PNG, JPG, JPEG, GIFAuthorization: Bearer {token}  data.append('page', formData.page);

- ความละเอียด: แนะนำ 1024x768 ขึ้นไป

- ตั้งชื่อไฟล์ที่มีความหมาย```  data.append('question_no', formData.question_no);



### 🔐 Security  if (formData.question_text) data.append('question_text', formData.question_text);

- เปลี่ยนรหัสผ่าน admin ใน production

- ใช้ HTTPS ใน production---  if (formData.question_img) data.append('question_img', formData.question_img);

- ตั้งค่า CORS อย่างเหมาะสม

- Backup ฐานข้อมูลสม่ำเสมอ

- อัปเดต dependencies เป็นประจำ

### ✅ Solutions API (Many-to-Many)  const response = await axios.post(`${API_BASE_URL}/questions`, data);

### 📊 Database Maintenance

- สำรองข้อมูลก่อนทำการ Migration  return response.data;

- ใช้ Index สำหรับ column ที่ค้นหาบ่อย

- ลบไฟล์รูปที่ไม่ได้ใช้งาน#### สร้างเฉลยใหม่}

- ตรวจสอบ orphan records เป็นประจำ

```http

---

POST /api/solutions// เพิ่มเฉลยพร้อมรูปหลายรูป

## 📄 License

Content-Type: application/jsonasync function addSolutionWithImages(solutionData, images) {

MIT License

Authorization: Bearer {token}  // 1. สร้างเฉลย

Copyright (c) 2025 Guru Web Project

  const solutionResponse = await axios.post(`${API_BASE_URL}/solutions`, solutionData);

Permission is hereby granted, free of charge, to any person obtaining a copy

of this software and associated documentation files (the "Software"), to deal{  const solutionId = solutionResponse.data.id;

in the Software without restriction, including without limitation the rights

to use, copy, modify, merge, publish, distribute, sublicense, and/or sell  "title": "วิธีที่ 1",

copies of the Software, and to permit persons to whom the Software is

furnished to do so, subject to the following conditions:  "answer_text": "คำอธิบายวิธีทำ..."  // 2. อัปโหลดรูปภาพ



The above copyright notice and this permission notice shall be included in all}  const imageFormData = new FormData();

copies or substantial portions of the Software.

  images.forEach(image => imageFormData.append('images', image));

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR

IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,Response:  await axios.post(`${API_BASE_URL}/solutions/${solutionId}/images`, imageFormData);

FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE

AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER{

LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,

OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE  "id": 1,  return solutionId;

SOFTWARE.

  "title": "วิธีที่ 1",}

---

  "answer_text": "...",

## 🙏 ขอบคุณ

  "images": [],// เชื่อมโยงโจทย์กับเฉลย

- [FastAPI](https://fastapi.tiangolo.com/) - Amazing Python web framework

- [React](https://reactjs.org/) - Powerful UI library  "created_at": "2025-10-06T10:00:00"async function linkQuestionToSolution(questionId, solutionId) {

- [TailwindCSS](https://tailwindcss.com/) - Beautiful utility-first CSS

- [SQLAlchemy](https://www.sqlalchemy.org/) - The Python SQL toolkit}  const response = await axios.post(

- [MySQL](https://www.mysql.com/) - Reliable database system

```    `${API_BASE_URL}/questions/${questionId}/solutions/${solutionId}`

---

  );

## 👥 ผู้พัฒนา

#### อัปโหลดรูปภาพเฉลย (หลายรูป)  return response.data;

- **GitHub:** [Natthasat](https://github.com/Natthasat)

- **Repository:** [idealguru](https://github.com/Natthasat/idealguru)```http}



---POST /api/solutions/{solution_id}/images



## 📞 ติดต่อ & สนับสนุนContent-Type: multipart/form-data// ใช้งาน



หากพบปัญหาหรือมีข้อเสนอแนะ:Authorization: Bearer {token}searchQuestion('IPL25122-0652', 5, 2);

- 🐛 **Bug Reports:** [GitHub Issues](https://github.com/Natthasat/idealguru/issues)

- 💡 **Feature Requests:** [GitHub Discussions](https://github.com/Natthasat/idealguru/discussions)```



---images: file[]



<div align="center">---



### ⭐ ถ้าโปรเจคนี้มีประโยชน์ อย่าลืมกด Star ด้วยนะครับ! ⭐Response:



**Made with ❤️ for Education**[## 📂 โครงสร้างโปรเจค



![Guru Web](https://img.shields.io/badge/Guru%20Web-Many--to--Many-blue?style=for-the-badge)  {



**Version 2.0** | **Last Updated:** October 6, 2025    "id": 1,```



</div>    "solution_id": 1,guru-web/


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
