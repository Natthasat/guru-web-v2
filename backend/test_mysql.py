#!/usr/bin/env python3
"""
สคริปต์ทดสอบการเชื่อมต่อ MySQL สำหรับ guru_DB
"""
import pymysql
from sqlalchemy import create_engine, text

def test_mysql_connection():
    """ทดสอบการเชื่อมต่อ MySQL"""
    
    # การตั้งค่าที่แตกต่างกันที่จะทดสอบ
    connection_configs = [
        {
            "url": "mysql+pymysql://root:@localhost:3306/guru_DB",
            "description": "Root ไม่มีรหัสผ่าน"
        },
        {
            "url": "mysql+pymysql://root:root@localhost:3306/guru_DB", 
            "description": "Root รหัสผ่าน 'root'"
        },
        {
            "url": "mysql+pymysql://root:password@localhost:3306/guru_DB",
            "description": "Root รหัสผ่าน 'password'"
        },
        {
            "url": "mysql+pymysql://root:123456@localhost:3306/guru_DB",
            "description": "Root รหัสผ่าน '123456'"
        }
    ]
    
    print("🔍 กำลังทดสอบการเชื่อมต่อ MySQL...")
    print("-" * 50)
    
    # ทดสอบการเชื่อมต่อพื้นฐานก่อน (ไม่ระบุ database)
    print("1️⃣ ทดสอบการเชื่อมต่อ MySQL Server...")
    
    basic_configs = [
        ("localhost", 3306, "root", ""),
        ("localhost", 3306, "root", "root"),
        ("localhost", 3306, "root", "password"),
        ("localhost", 3306, "root", "123456")
    ]
    
    working_config = None
    
    for host, port, user, password in basic_configs:
        try:
            connection = pymysql.connect(
                host=host,
                port=port,
                user=user,
                password=password
            )
            print(f"✅ เชื่อมต่อสำเร็จ: {user}@{host}:{port}")
            print(f"   รหัสผ่าน: {'(ว่าง)' if not password else password}")
            working_config = (host, port, user, password)
            connection.close()
            break
        except Exception as e:
            print(f"❌ ไม่สำเร็จ: {user}@{host}:{port} - {str(e)[:50]}...")
    
    if not working_config:
        print("\n💥 ไม่สามารถเชื่อมต่อ MySQL Server ได้!")
        print("🔧 แนะนำการแก้ไข:")
        print("   - ตรวจสอบว่า MySQL Server ทำงานอยู่หรือไม่")
        print("   - ตรวจสอบ username/password")
        print("   - ลองใช้คำสั่ง: mysql -u root -p")
        return None
    
    # ทดสอบการสร้าง Database guru_DB
    print(f"\n2️⃣ ทดสอบการสร้าง Database 'guru_DB'...")
    
    try:
        host, port, user, password = working_config
        connection = pymysql.connect(
            host=host,
            port=port,
            user=user,
            password=password
        )
        
        with connection.cursor() as cursor:
            # สร้าง database ถ้ายังไม่มี
            cursor.execute("CREATE DATABASE IF NOT EXISTS guru_DB")
            cursor.execute("SHOW DATABASES LIKE 'guru_DB'")
            result = cursor.fetchone()
            
            if result:
                print("✅ Database 'guru_DB' พร้อมใช้งาน")
            else:
                print("❌ ไม่สามารถสร้าง Database 'guru_DB' ได้")
                
        connection.close()
        
    except Exception as e:
        print(f"❌ เกิดข้อผิดพลาดในการสร้าง Database: {e}")
        return None
    
    # ทดสอบการเชื่อมต่อกับ SQLAlchemy
    print(f"\n3️⃣ ทดสอบการเชื่อมต่อด้วย SQLAlchemy...")
    
    for config in connection_configs:
        try:
            engine = create_engine(config["url"])
            
            # ทดสอบการเชื่อมต่อ
            with engine.connect() as conn:
                result = conn.execute(text("SELECT 1"))
                row = result.fetchone()
                
            print(f"✅ SQLAlchemy เชื่อมต่อสำเร็จ: {config['description']}")
            print(f"   URL: {config['url']}")
            
            # ทดสอบการสร้างตาราง
            try:
                from models import Base
                Base.metadata.create_all(bind=engine)
                print("✅ สร้างตารางสำเร็จ")
                
                # ตรวจสอบตารางที่สร้าง
                with engine.connect() as conn:
                    result = conn.execute(text("SHOW TABLES"))
                    tables = [row[0] for row in result.fetchall()]
                    print(f"📋 ตารางที่สร้าง: {', '.join(tables)}")
                
            except Exception as e:
                print(f"⚠️ ไม่สามารถสร้างตารางได้: {e}")
            
            return config["url"]
            
        except Exception as e:
            print(f"❌ SQLAlchemy ไม่สำเร็จ: {config['description']}")
            print(f"   ข้อผิดพลาด: {str(e)[:80]}...")
    
    return None

def show_mysql_info():
    """แสดงข้อมูล MySQL และคำแนะนำ"""
    print("\n" + "="*60)
    print("📚 ข้อมูล MySQL และคำแนะนำการแก้ไข")
    print("="*60)
    
    print("\n🔧 วิธีตรวจสอบและแก้ไข MySQL:")
    print("1. ตรวจสอบว่า MySQL ทำงานอยู่:")
    print("   - Windows: เปิด Services.msc หา MySQL")
    print("   - หรือใช้คำสั่ง: net start mysql")
    
    print("\n2. ทดสอบเข้าสู่ระบบ MySQL:")
    print("   mysql -u root -p")
    
    print("\n3. สร้าง Database guru_DB:")
    print("   CREATE DATABASE guru_DB;")
    print("   USE guru_DB;")
    
    print("\n4. ตรวจสอบสิทธิ์ผู้ใช้:")
    print("   SHOW GRANTS FOR 'root'@'localhost';")
    
    print("\n5. รีเซ็ตรหัsผ่าน root (ถ้าจำเป็น):")
    print("   ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';")
    
    print("\n🎯 URL ที่ใช้ใน database.py:")
    print("   mysql+pymysql://username:password@localhost:3306/guru_DB")

if __name__ == "__main__":
    print("🚀 เริ่มทดสอบการเชื่อมต่อ MySQL guru_DB")
    
    working_url = test_mysql_connection()
    
    if working_url:
        print(f"\n🎉 การเชื่อมต่อสำเร็จ!")
        print(f"📝 ใช้ URL นี้ใน database.py:")
        print(f"   DATABASE_URL = \"{working_url}\"")
    else:
        print(f"\n💔 การเชื่อมต่อไม่สำเร็จ")
        print("🔄 ระบบจะใช้ SQLite แทน")
    
    show_mysql_info()