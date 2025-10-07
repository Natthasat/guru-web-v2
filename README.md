# 📚 Guru Web - ระบบจัดการโจทย์และเฉลย

ระบบจัดการโจทย์และเฉลยออนไลน์แบบครบวงจร สำหรับการจัดเก็บ ค้นหา และจัดการโจทย์พร้อมเฉลยอย่างมีประสิทธิภาพ

## 🌟 ภาพรวมโปรเจค

Guru Web เป็นระบบที่พัฒนาขึ้นเพื่อช่วยให้ผู้สอนและผู้เรียนสามารถจัดการโจทย์และเฉลยได้อย่างมีระบบ รองรับการอัปโหลดรูปภาพ การค้นหาที่รวดเร็ว และการจัดเก็บข้อมูลแบบ One-to-Many (โจทย์หนึ่งข้อสามารถมีได้หลายเฉลย)

### เทคโนโลยีที่ใช้

**Backend:**
- FastAPI (Python 3.13)
- SQLAlchemy ORM
- MySQL Database
- JWT Authentication
- Uvicorn Server

**Frontend:**
- React 18
- React Router v6
- Axios
- Tailwind CSS
- Modern UI/UX Design

## ✨ ฟีเจอร์หลัก

### 🔐 ระบบผู้ใช้
- ✅ ระบบ Login/Logout ด้วย JWT Token
- ✅ การจัดการผู้ใช้ (เฉพาะ Admin)
- ✅ ป้องกันการลบ Admin
- ✅ Role-based Access Control

### 📝 การจัดการโจทย์และเฉลย
- ✅ **เพิ่มโจทย์พร้อมเฉลย** - ครบจบในหน้าเดียว
- ✅ **รองรับหลายเฉลย** - โจทย์หนึ่งข้อมีเฉลยได้หลายวิธี
- ✅ **อัปโหลดรูปภาพ** - รองรับหลายรูปต่อเฉลย (สูงสุด 5 รูป)
- ✅ **ตรวจสอบความซ้ำ** - แจ้งเตือนเมื่อ Book ID + Page + Question No. ซ้ำกัน
- ✅ **จำค่า Book ID** - จดจำรหัสหนังสือล่าสุดอัตโนมัติ
- ✅ **แก้ไข/ลบโจทย์และเฉลย** - จัดการข้อมูลได้สะดวก
- ✅ **คลิกดูรูปภาพขยาย** - ดูรูปภาพแบบเต็มหน้าจอ

### 🔍 การค้นหา
- ✅ ค้นหาด้วย Book ID + หน้า + ข้อที่
- ✅ แสดงผลรวดเร็วพร้อมรูปภาพ
- ✅ แสดงวันเวลาที่สร้าง (รูปแบบไทย)

### 🎨 UI/UX
- ✅ ธีมสีม่วง-น้ำเงิน-ฟ้า แบบ Gradient
- ✅ Glass Morphism Effect
- ✅ Responsive Design
- ✅ Auto Scroll เมื่อมีข้อความแจ้งเตือน
- ✅ Loading States และ Error Handling

## 📦 การติดตั้ง

### ความต้องการของระบบ

- Python 3.13+
- Node.js 18+
- MySQL 8.0+
- Git

### 1. Clone โปรเจค

```bash
git clone https://github.com/Natthasat/idealguru.git
cd idealguru
```

### 2. ติดตั้ง Backend

```bash
cd backend

# สร้าง Virtual Environment (แนะนำ)
python -m venv venv
source venv/bin/activate  # บน Windows: venv\Scripts\activate

# ติดตั้ง Dependencies
pip install -r requirements.txt
```

### 3. ตั้งค่า Database

สร้างไฟล์ `backend/.env`:

```env
DATABASE_URL=mysql+pymysql://username:password@localhost/guru_DB
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

สร้าง Database:

```sql
CREATE DATABASE guru_DB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. ติดตั้ง Frontend

```bash
cd frontend
npm install
```

## 🚀 การใช้งาน

### เริ่มต้น Backend Server

```bash
cd backend
python main.py
```

Backend จะรันที่: `http://localhost:8000`

API Docs: `http://localhost:8000/docs`

### เริ่มต้น Frontend Server

```bash
cd frontend
npm start
```

Frontend จะรันที่: `http://localhost:3000`

### สร้าง Admin User

```bash
cd backend/scripts
python create_admin.py
```

ข้อมูล Admin เริ่มต้น:
- **Username:** admin
- **Password:** admin123

## 📂 โครงสร้างโฟลเดอร์

```
guru-web/
├── backend/
│   ├── main.py                 # Entry point
│   ├── config.py              # การตั้งค่า
│   ├── database.py            # Database connection
│   ├── models.py              # SQLAlchemy models
│   ├── auth.py                # JWT authentication
│   ├── logger.py              # Logging
│   ├── routes/                # API routes
│   │   ├── questions.py       # โจทย์
│   │   ├── solutions.py       # เฉลย
│   │   ├── users.py           # ผู้ใช้
│   │   └── auth.py            # Authentication
│   ├── scripts/               # Utility scripts
│   │   └── create_admin.py    # สร้าง admin
│   ├── uploads/               # ไฟล์รูปภาพ
│   └── requirements.txt       # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── App.js             # Main app
│   │   ├── pages/             # หน้าต่างๆ
│   │   │   ├── Login.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminAddQuestionWithSolution.jsx
│   │   │   ├── AdminManageQuestionAndSolutions.jsx
│   │   │   ├── AdminManageUsers.jsx
│   │   │   └── SolutionSearch.jsx
│   │   └── components/        # Components
│   │       ├── ProtectedRoute.jsx
│   │       └── Notification.jsx
│   ├── public/
│   ├── package.json
│   └── tailwind.config.js
│
└── README.md
```

## 🔑 API Endpoints สำคัญ

### Authentication
- `POST /api/auth/login` - เข้าสู่ระบบ
- `POST /api/auth/register` - สมัครสมาชิก

### Questions (โจทย์)
- `GET /api/questions` - ดึงโจทย์ทั้งหมด
- `POST /api/questions` - เพิ่มโจทย์
- `GET /api/qa/{book_id}/{page}/{question_no}` - ค้นหาโจทย์
- `PUT /api/questions/{id}` - แก้ไขโจทย์
- `DELETE /api/questions/{id}` - ลบโจทย์

### Solutions (เฉลย)
- `GET /api/questions/{question_id}/solutions` - ดึงเฉลยทั้งหมด
- `POST /api/questions/{question_id}/solutions` - เพิ่มเฉลย
- `PUT /api/solutions/{id}` - แก้ไขเฉลย
- `DELETE /api/solutions/{id}` - ลบเฉลย
- `POST /api/solutions/{solution_id}/images` - อัปโหลดรูปภาพเฉลย

### Users (ผู้ใช้)
- `GET /api/users` - ดึงผู้ใช้ทั้งหมด
- `DELETE /api/users/{id}` - ลบผู้ใช้

## 💡 วิธีใช้งาน

### 1. เข้าสู่ระบบ
เข้าไปที่ `http://localhost:3000` และ login ด้วย admin account

### 2. เพิ่มโจทย์พร้อมเฉลย
1. คลิกที่ **"เพิ่มโจทย์+เฉลย"**
2. กรอกข้อมูลโจทย์:
   - รหัสหนังสือ (Book ID) *
   - หน้า (Page) *
   - ข้อที่ (Question No.) *
   - โจทย์ (ข้อความหรือรูปภาพ)
3. กรอกเฉลย:
   - ชื่อเฉลย (เช่น "วิธีที่ 1")
   - คำอธิบาย
   - รูปภาพเฉลย (สูงสุด 5 รูป)
4. สามารถเพิ่มหลายเฉลยได้โดยคลิก **"เพิ่มเฉลย"**
5. คลิก **"บันทึกโจทย์และเฉลย"**

### 3. จัดการโจทย์และเฉลย
1. คลิกที่ **"จัดการโจทย์และเฉลย"**
2. ดูรายการโจทย์ทั้งหมด
3. คลิก **"แก้ไข"** เพื่อแก้ไขโจทย์หรือเฉลย
4. คลิก **"ลบ"** เพื่อลบโจทย์ (เฉลยจะถูกลบตามไปด้วย)

### 4. ค้นหาโจทย์
1. กรอก Book ID, Page, Question No. ในช่องค้นหา
2. คลิก **"ค้นหาโจทย์"**
3. ดูผลลัพธ์พร้อมรูปภาพ
4. คลิกที่รูปภาพเพื่อดูแบบขยาย

## 🔒 Security Features

- ✅ JWT Token Authentication
- ✅ Password Hashing (bcrypt)
- ✅ Protected Routes
- ✅ Role-based Authorization
- ✅ SQL Injection Prevention (SQLAlchemy ORM)
- ✅ File Upload Validation
- ✅ Admin Protection

## 🐛 การแก้ไขปัญหา

### Backend ไม่สามารถเชื่อมต่อ Database
```bash
# ตรวจสอบ MySQL service
# ตรวจสอบ .env file
# ตรวจสอบ Database credentials
```

### Frontend ไม่สามารถเชื่อมต่อ Backend
```bash
# ตรวจสอบว่า Backend รันอยู่ที่ port 8000
# ตรวจสอบ CORS settings
```

### รูปภาพไม่แสดง
```bash
# ตรวจสอบ folder uploads/ ใน backend
# ตรวจสอบ permissions
```

## 📝 การพัฒนาต่อ

### ฟีเจอร์ที่วางแผนไว้
- [ ] Export ข้อมูลเป็น PDF
- [ ] Import ข้อมูลจาก Excel
- [ ] ระบบ Tag และ Category
- [ ] การค้นหาแบบ Advanced
- [ ] Dashboard Analytics
- [ ] Notification System

## 🤝 การมีส่วนร่วม

หากต้องการมีส่วนร่วมในการพัฒนา:

1. Fork โปรเจค
2. สร้าง Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit การเปลี่ยนแปลง (`git commit -m 'Add some AmazingFeature'`)
4. Push ไปยัง Branch (`git push origin feature/AmazingFeature`)
5. เปิด Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 ผู้พัฒนา

**Natthasat**
- GitHub: [@Natthasat](https://github.com/Natthasat)
- Repository: [idealguru](https://github.com/Natthasat/idealguru)

## 📞 ติดต่อ

หากมีคำถามหรือข้อเสนอแนะ สามารถติดต่อได้ผ่าน GitHub Issues

---

**Version:** 2.0  
**Last Updated:** October 2025

⭐ ถ้าโปรเจคนี้มีประโยชน์ กรุณา Star ให้กับ Repository นี้ด้วยนะครับ! ⭐
