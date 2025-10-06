# 🧹 Cleanup Script - Guru Web Project
# วิธีใช้: .\cleanup.ps1

Write-Host "🧹 เริ่มทำความสะอาดโปรเจกต์..." -ForegroundColor Cyan
Write-Host ""

# ตรวจสอบว่าอยู่ใน directory ที่ถูกต้อง
if (-not (Test-Path "backend") -or -not (Test-Path "frontend")) {
    Write-Host "❌ Error: ไม่พบโฟลเดอร์ backend หรือ frontend" -ForegroundColor Red
    Write-Host "กรุณารันสคริปต์นี้จาก root directory ของโปรเจกต์" -ForegroundColor Yellow
    exit 1
}

$cleaned = 0
$skipped = 0

# ==================== 1. ลบไฟล์ backup ====================
Write-Host "1️⃣  ตรวจสอบไฟล์ backup..." -ForegroundColor Yellow
$backupFile = "frontend\src\pages\StudentSearch.jsx.backup"
if (Test-Path $backupFile) {
    Remove-Item $backupFile -Force
    Write-Host "   ✅ ลบ $backupFile" -ForegroundColor Green
    $cleaned++
} else {
    Write-Host "   ⏭️  ไม่พบ $backupFile (ข้าม)" -ForegroundColor Gray
    $skipped++
}

# ==================== 2. ลบไฟล์ auth.py เก่า ====================
Write-Host ""
Write-Host "2️⃣  ตรวจสอบไฟล์ duplicate..." -ForegroundColor Yellow
$oldAuthFile = "backend\auth.py"
if (Test-Path $oldAuthFile) {
    # ตรวจสอบว่ามี routes/auth.py อยู่จริง
    if (Test-Path "backend\routes\auth.py") {
        Remove-Item $oldAuthFile -Force
        Write-Host "   ✅ ลบ $oldAuthFile (ใช้ routes/auth.py แทน)" -ForegroundColor Green
        $cleaned++
    } else {
        Write-Host "   ⚠️  พบ $oldAuthFile แต่ไม่ลบเพราะไม่มี routes/auth.py" -ForegroundColor Red
        $skipped++
    }
} else {
    Write-Host "   ⏭️  ไม่พบ $oldAuthFile (ข้าม)" -ForegroundColor Gray
    $skipped++
}

# ==================== 3. สร้างโฟลเดอร์จัดเก็บ ====================
Write-Host ""
Write-Host "3️⃣  สร้างโฟลเดอร์จัดเก็บ..." -ForegroundColor Yellow

$folders = @("backend\migrations", "backend\scripts", "backend\docs")
foreach ($folder in $folders) {
    if (-not (Test-Path $folder)) {
        New-Item -ItemType Directory -Path $folder -Force | Out-Null
        Write-Host "   ✅ สร้างโฟลเดอร์ $folder" -ForegroundColor Green
        $cleaned++
    } else {
        Write-Host "   ⏭️  โฟลเดอร์ $folder มีอยู่แล้ว" -ForegroundColor Gray
        $skipped++
    }
}

# ==================== 4. ย้ายไฟล์ migration ====================
Write-Host ""
Write-Host "4️⃣  ย้ายไฟล์ migration scripts..." -ForegroundColor Yellow

$migrationFiles = @(
    "add_old_book_id_column.py",
    "migrate_to_many_to_many.py",
    "fix_question_solutions_table.py",
    "fix_solution_images_table.py",
    "delete_backup_tables.py"
)

foreach ($file in $migrationFiles) {
    $sourcePath = "backend\$file"
    $destPath = "backend\migrations\$file"
    
    if (Test-Path $sourcePath) {
        if (-not (Test-Path $destPath)) {
            Move-Item $sourcePath $destPath -Force
            Write-Host "   ✅ ย้าย $file -> migrations/" -ForegroundColor Green
            $cleaned++
        } else {
            Write-Host "   ⚠️  $file มีอยู่ใน migrations/ แล้ว (ลบไฟล์ต้นทาง)" -ForegroundColor Yellow
            Remove-Item $sourcePath -Force
            $cleaned++
        }
    } else {
        Write-Host "   ⏭️  ไม่พบ $file (อาจย้ายแล้ว)" -ForegroundColor Gray
        $skipped++
    }
}

# ==================== 5. ย้ายไฟล์ scripts ====================
Write-Host ""
Write-Host "5️⃣  ย้ายไฟล์ utility scripts..." -ForegroundColor Yellow

$scriptFiles = @(
    "create_admin.py",
    "test_mysql.py"
)

foreach ($file in $scriptFiles) {
    $sourcePath = "backend\$file"
    $destPath = "backend\scripts\$file"
    
    if (Test-Path $sourcePath) {
        if (-not (Test-Path $destPath)) {
            Move-Item $sourcePath $destPath -Force
            Write-Host "   ✅ ย้าย $file -> scripts/" -ForegroundColor Green
            $cleaned++
        } else {
            Write-Host "   ⚠️  $file มีอยู่ใน scripts/ แล้ว (ลบไฟล์ต้นทาง)" -ForegroundColor Yellow
            Remove-Item $sourcePath -Force
            $cleaned++
        }
    } else {
        Write-Host "   ⏭️  ไม่พบ $file (อาจย้ายแล้ว)" -ForegroundColor Gray
        $skipped++
    }
}

# ==================== 6. ย้ายไฟล์ documentation ====================
Write-Host ""
Write-Host "6️⃣  ย้ายไฟล์ documentation..." -ForegroundColor Yellow

$docFile = "example_find_question_usage.py"
$sourcePath = "backend\$docFile"
$destPath = "backend\docs\$docFile"

if (Test-Path $sourcePath) {
    if (-not (Test-Path $destPath)) {
        Move-Item $sourcePath $destPath -Force
        Write-Host "   ✅ ย้าย $docFile -> docs/" -ForegroundColor Green
        $cleaned++
    } else {
        Write-Host "   ⚠️  $docFile มีอยู่ใน docs/ แล้ว (ลบไฟล์ต้นทาง)" -ForegroundColor Yellow
        Remove-Item $sourcePath -Force
        $cleaned++
    }
} else {
    Write-Host "   ⏭️  ไม่พบ $docFile (อาจย้ายแล้ว)" -ForegroundColor Gray
    $skipped++
}

# ==================== 7. แก้ไขปัญหา backend/backend/uploads ====================
Write-Host ""
Write-Host "7️⃣  ตรวจสอบ backend/backend/uploads..." -ForegroundColor Yellow

if (Test-Path "backend\backend\uploads") {
    $files = Get-ChildItem "backend\backend\uploads" -File
    if ($files.Count -gt 0) {
        Write-Host "   🔍 พบ $($files.Count) ไฟล์ใน backend/backend/uploads" -ForegroundColor Cyan
        
        # ย้ายไฟล์ไป backend/uploads
        foreach ($file in $files) {
            $destPath = "backend\uploads\$($file.Name)"
            if (-not (Test-Path $destPath)) {
                Move-Item $file.FullName $destPath -Force
                Write-Host "   ✅ ย้าย $($file.Name) -> backend/uploads/" -ForegroundColor Green
                $cleaned++
            } else {
                Write-Host "   ⚠️  $($file.Name) มีอยู่ใน backend/uploads/ แล้ว" -ForegroundColor Yellow
                $skipped++
            }
        }
    }
    
    # ลบโฟลเดอร์ว่าง
    Remove-Item -Recurse -Force "backend\backend"
    Write-Host "   ✅ ลบโฟลเดอร์ backend/backend/" -ForegroundColor Green
    $cleaned++
} else {
    Write-Host "   ⏭️  ไม่พบ backend/backend/uploads (ดี!)" -ForegroundColor Gray
    $skipped++
}

# ==================== 8. ลบ SQLite database ====================
Write-Host ""
Write-Host "8️⃣  ตรวจสอบไฟล์ SQLite..." -ForegroundColor Yellow

if (Test-Path "guru_web.db") {
    $response = Read-Host "   ❓ พบ guru_web.db - ต้องการลบหรือไม่? (ตอนนี้ใช้ MySQL แล้ว) [Y/n]"
    if ($response -eq "" -or $response -eq "Y" -or $response -eq "y") {
        Remove-Item "guru_web.db" -Force
        Write-Host "   ✅ ลบ guru_web.db" -ForegroundColor Green
        $cleaned++
    } else {
        Write-Host "   ⏭️  เก็บ guru_web.db ไว้" -ForegroundColor Yellow
        $skipped++
    }
} else {
    Write-Host "   ⏭️  ไม่พบ guru_web.db (ข้าม)" -ForegroundColor Gray
    $skipped++
}

# ==================== 9. ตรวจสอบ uploads/ ใน root ====================
Write-Host ""
Write-Host "9️⃣  ตรวจสอบโฟลเดอร์ uploads/ ใน root..." -ForegroundColor Yellow

if (Test-Path "uploads") {
    $files = Get-ChildItem "uploads" -File -Recurse
    if ($files.Count -eq 0) {
        Write-Host "   🔍 โฟลเดอร์ uploads/ ว่าง" -ForegroundColor Cyan
        $response = Read-Host "   ❓ ต้องการลบโฟลเดอร์ uploads/ ใน root หรือไม่? [Y/n]"
        if ($response -eq "" -or $response -eq "Y" -or $response -eq "y") {
            Remove-Item -Recurse -Force "uploads"
            Write-Host "   ✅ ลบโฟลเดอร์ uploads/" -ForegroundColor Green
            $cleaned++
        } else {
            Write-Host "   ⏭️  เก็บโฟลเดอร์ uploads/ ไว้" -ForegroundColor Yellow
            $skipped++
        }
    } else {
        Write-Host "   ⚠️  โฟลเดอร์ uploads/ มี $($files.Count) ไฟล์" -ForegroundColor Yellow
        Write-Host "   💡 พิจารณาย้ายไปที่ backend/uploads/ ด้วยตนเอง" -ForegroundColor Cyan
        $skipped++
    }
} else {
    Write-Host "   ⏭️  ไม่พบโฟลเดอร์ uploads/ ใน root (ดี!)" -ForegroundColor Gray
    $skipped++
}

# ==================== 10. ลบ __pycache__ ====================
Write-Host ""
Write-Host "🔟 ลบ Python cache files..." -ForegroundColor Yellow

$pycacheDirs = Get-ChildItem -Path "backend" -Directory -Recurse -Filter "__pycache__"
if ($pycacheDirs.Count -gt 0) {
    foreach ($dir in $pycacheDirs) {
        Remove-Item -Recurse -Force $dir.FullName
        Write-Host "   ✅ ลบ $($dir.FullName)" -ForegroundColor Green
        $cleaned++
    }
} else {
    Write-Host "   ⏭️  ไม่พบ __pycache__ directories" -ForegroundColor Gray
    $skipped++
}

# ==================== สรุปผล ====================
Write-Host ""
Write-Host "=" -NoNewline -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host "📊 สรุปผลการทำความสะอาด" -ForegroundColor Cyan
Write-Host "=" -NoNewline -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host "   ✅ ดำเนินการสำเร็จ: $cleaned รายการ" -ForegroundColor Green
Write-Host "   ⏭️  ข้าม/มีอยู่แล้ว: $skipped รายการ" -ForegroundColor Yellow
Write-Host ""

if ($cleaned -gt 0) {
    Write-Host "✅ ทำความสะอาดเสร็จสิ้น! โครงสร้างโปรเจกต์เป็นระเบียบแล้ว" -ForegroundColor Green
} else {
    Write-Host "✨ โปรเจกต์สะอาดอยู่แล้ว ไม่มีอะไรต้องทำความสะอาด" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "💡 แนะนำ: commit การเปลี่ยนแปลงนี้" -ForegroundColor Cyan
Write-Host "   git add ." -ForegroundColor Gray
Write-Host "   git commit -m 'chore: cleanup project structure'" -ForegroundColor Gray
Write-Host ""
