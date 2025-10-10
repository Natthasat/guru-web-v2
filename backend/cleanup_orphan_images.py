"""
สคริปต์ลบรูปภาพที่ไม่มีการอ้างอิงในฐานข้อมูล (orphan images)
"""
import os
from pathlib import Path
from database import SessionLocal
from models import Question, SolutionImage

def cleanup_orphan_images():
    """ลบไฟล์รูปภาพที่ไม่มีในฐานข้อมูลแล้ว"""
    
    db = SessionLocal()
    
    try:
        # ตำแหน่งโฟลเดอร์ uploads
        uploads_dir = Path(__file__).parent / "uploads"
        
        if not uploads_dir.exists():
            print("❌ ไม่พบโฟลเดอร์ uploads")
            return
        
        # รวบรวมชื่อไฟล์ที่ยังใช้งานในฐานข้อมูล
        active_files = set()
        
        # 1. รูปโจทย์ที่ยังใช้งาน
        questions = db.query(Question).filter(Question.question_img != None).all()
        for q in questions:
            filename = q.question_img.split('/')[-1]  # เอาเฉพาะชื่อไฟล์
            active_files.add(filename)
        
        # 2. รูปเฉลยที่ยังใช้งาน
        solution_images = db.query(SolutionImage).all()
        for img in solution_images:
            filename = img.image_path.split('/')[-1]  # เอาเฉพาะชื่อไฟล์
            active_files.add(filename)
        
        print(f"📊 สรุปข้อมูล:")
        print(f"   - รูปโจทย์ในฐานข้อมูล: {len(questions)} ไฟล์")
        print(f"   - รูปเฉลยในฐานข้อมูล: {len(solution_images)} ไฟล์")
        print(f"   - ไฟล์ที่ยังใช้งานทั้งหมด: {len(active_files)} ไฟล์")
        print()
        
        # หาไฟล์ทั้งหมดในโฟลเดอร์ uploads
        all_files = [f for f in uploads_dir.iterdir() if f.is_file() and f.name != '.gitkeep']
        
        print(f"📁 ไฟล์ในโฟลเดอร์ uploads: {len(all_files)} ไฟล์")
        print()
        
        # หาไฟล์ที่เป็น orphan (ไม่มีในฐานข้อมูล)
        orphan_files = [f for f in all_files if f.name not in active_files]
        
        if not orphan_files:
            print("✅ ไม่มีไฟล์ orphan ทั้งหมดสะอาดแล้ว!")
            return
        
        print(f"🗑️  พบไฟล์ orphan: {len(orphan_files)} ไฟล์")
        print()
        
        # แสดงรายการไฟล์ที่จะลบ
        print("📋 รายการไฟล์ที่จะลบ:")
        for f in orphan_files:
            size_kb = f.stat().st_size / 1024
            print(f"   - {f.name} ({size_kb:.1f} KB)")
        print()
        
        # ถามยืนยัน
        response = input(f"❓ คุณต้องการลบไฟล์ทั้งหมด {len(orphan_files)} ไฟล์ใช่หรือไม่? (yes/no): ")
        
        if response.lower() not in ['yes', 'y']:
            print("❌ ยกเลิกการลบ")
            return
        
        # ลบไฟล์
        deleted_count = 0
        total_size = 0
        
        for f in orphan_files:
            try:
                size = f.stat().st_size
                f.unlink()
                deleted_count += 1
                total_size += size
                print(f"   ✅ ลบ: {f.name}")
            except Exception as e:
                print(f"   ❌ ไม่สามารถลบ {f.name}: {e}")
        
        print()
        print(f"🎉 สำเร็จ!")
        print(f"   - ลบไฟล์: {deleted_count}/{len(orphan_files)} ไฟล์")
        print(f"   - ประหยัดพื้นที่: {total_size / 1024:.2f} KB ({total_size / (1024*1024):.2f} MB)")
        
    finally:
        db.close()

if __name__ == "__main__":
    print("=" * 60)
    print("🧹 สคริปต์ลบรูปภาพ Orphan (ไฟล์ที่ไม่มีในฐานข้อมูล)")
    print("=" * 60)
    print()
    
    cleanup_orphan_images()
