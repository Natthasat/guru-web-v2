from database import SessionLocal
from models import Question, Solution, SolutionImage

db = SessionLocal()

questions = db.query(Question).all()
print(f'มีโจทย์ทั้งหมด: {len(questions)} ข้อ')
print()

for q in questions:
    sols = db.query(Solution).filter(Solution.question_id == q.id).all()
    total_imgs = 0
    for s in sols:
        imgs_count = db.query(SolutionImage).filter(SolutionImage.solution_id == s.id).count()
        total_imgs += imgs_count
    
    print(f'ID: {q.id} | {q.book_id} หน้า {q.page} ข้อ {q.question_no}')
    print(f'  - เฉลย: {len(sols)} วิธี')
    print(f'  - รูปเฉลย: {total_imgs} รูป')
    print(f'  - รูปโจทย์: {q.question_img if q.question_img else "ไม่มี"}')
    print()

db.close()
