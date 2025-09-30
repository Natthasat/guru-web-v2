# วิธี Deploy ระบบ Guru Web ด้วย Docker Compose

## 1. เตรียมไฟล์และแก้ไขค่าต่าง ๆ
- ตรวจสอบให้แน่ใจว่าไฟล์ `docker-compose.yml`, `Dockerfile` (backend/frontend), `.dockerignore` อยู่ครบ
- แก้ไขรหัสผ่าน MySQL และ DATABASE_URL ใน docker-compose ให้ปลอดภัย

## 2. สั่ง build และ run
```bash
docker-compose up --build
```

## 3. การเข้าถึงระบบ
- Frontend: http://localhost:3000
- Backend (API): http://localhost:8000
- MySQL: localhost:3306

## 4. การหยุดระบบ
```bash
docker-compose down
```

## 5. การปรับแต่งเพิ่มเติม
- ใช้ Nginx Proxy/SSL สำหรับ production
- เปลี่ยนรหัสผ่านและตั้งค่า environment ให้ปลอดภัย
- สำรองข้อมูล MySQL ด้วย volume
- สามารถ deploy บน Cloud ได้ทันที (เช่น AWS EC2, GCP VM, Azure VM)

## ระบบ Auth คืออะไร?
"Auth" (Authentication) คือระบบยืนยันตัวตนผู้ใช้งาน เช่น Admin ต้อง login ก่อนใช้งานฟีเจอร์จัดการข้อมูล
ระบบ Auth จะตรวจสอบ username/password หรือ token ก่อนอนุญาตให้เข้าถึงข้อมูลสำคัญ
ตัวอย่าง Auth ที่นิยมใช้:
- JWT (JSON Web Token): ผู้ใช้ login แล้วจะได้รับ token สำหรับยืนยันตัวตนในแต่ละ request
- OAuth: ใช้สำหรับเชื่อมต่อกับระบบภายนอก เช่น Google, Facebook
- Session-based: เก็บ session ใน server เพื่อยืนยันตัวตน
การเพิ่ม Auth จะช่วยป้องกันการเข้าถึงข้อมูลโดยไม่ได้รับอนุญาต และเพิ่มความปลอดภัยให้ระบบ
