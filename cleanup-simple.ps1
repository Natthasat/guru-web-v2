# Cleanup Script - Guru Web Project
# Clean up unused files and organize project structure

Write-Host ""
Write-Host "=== Starting Cleanup Process ===" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the correct directory
if (-not (Test-Path "backend") -or -not (Test-Path "frontend")) {
    Write-Host "ERROR: Cannot find backend or frontend folders" -ForegroundColor Red
    Write-Host "Please run this script from the project root directory" -ForegroundColor Yellow
    exit 1
}

$cleaned = 0
$skipped = 0

# 1. Remove backup files
Write-Host "[1/10] Checking backup files..." -ForegroundColor Yellow
$backupFile = "frontend\src\pages\StudentSearch.jsx.backup"
if (Test-Path $backupFile) {
    Remove-Item $backupFile -Force
    Write-Host "  -> Removed: $backupFile" -ForegroundColor Green
    $cleaned++
} else {
    Write-Host "  -> Not found: $backupFile (skip)" -ForegroundColor Gray
    $skipped++
}

# 2. Remove duplicate auth.py
Write-Host ""
Write-Host "[2/10] Checking duplicate files..." -ForegroundColor Yellow
$oldAuthFile = "backend\auth.py"
if (Test-Path $oldAuthFile) {
    if (Test-Path "backend\routes\auth.py") {
        Remove-Item $oldAuthFile -Force
        Write-Host "  -> Removed: $oldAuthFile (using routes/auth.py)" -ForegroundColor Green
        $cleaned++
    } else {
        Write-Host "  -> WARNING: Found $oldAuthFile but no routes/auth.py exists" -ForegroundColor Red
        $skipped++
    }
} else {
    Write-Host "  -> Not found: $oldAuthFile (skip)" -ForegroundColor Gray
    $skipped++
}

# 3. Create organization folders
Write-Host ""
Write-Host "[3/10] Creating organization folders..." -ForegroundColor Yellow

$folders = @("backend\migrations", "backend\scripts", "backend\docs")
foreach ($folder in $folders) {
    if (-not (Test-Path $folder)) {
        New-Item -ItemType Directory -Path $folder -Force | Out-Null
        Write-Host "  -> Created: $folder" -ForegroundColor Green
        $cleaned++
    } else {
        Write-Host "  -> Already exists: $folder" -ForegroundColor Gray
        $skipped++
    }
}

# 4. Move migration files
Write-Host ""
Write-Host "[4/10] Moving migration scripts..." -ForegroundColor Yellow

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
            Write-Host "  -> Moved: $file -> migrations/" -ForegroundColor Green
            $cleaned++
        } else {
            Write-Host "  -> Already in migrations/, removing source" -ForegroundColor Yellow
            Remove-Item $sourcePath -Force
            $cleaned++
        }
    } else {
        Write-Host "  -> Not found: $file (already moved)" -ForegroundColor Gray
        $skipped++
    }
}

# 5. Move script files
Write-Host ""
Write-Host "[5/10] Moving utility scripts..." -ForegroundColor Yellow

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
            Write-Host "  -> Moved: $file -> scripts/" -ForegroundColor Green
            $cleaned++
        } else {
            Write-Host "  -> Already in scripts/, removing source" -ForegroundColor Yellow
            Remove-Item $sourcePath -Force
            $cleaned++
        }
    } else {
        Write-Host "  -> Not found: $file (already moved)" -ForegroundColor Gray
        $skipped++
    }
}

# 6. Move documentation files
Write-Host ""
Write-Host "[6/10] Moving documentation..." -ForegroundColor Yellow

$docFile = "example_find_question_usage.py"
$sourcePath = "backend\$docFile"
$destPath = "backend\docs\$docFile"

if (Test-Path $sourcePath) {
    if (-not (Test-Path $destPath)) {
        Move-Item $sourcePath $destPath -Force
        Write-Host "  -> Moved: $docFile -> docs/" -ForegroundColor Green
        $cleaned++
    } else {
        Write-Host "  -> Already in docs/, removing source" -ForegroundColor Yellow
        Remove-Item $sourcePath -Force
        $cleaned++
    }
} else {
    Write-Host "  -> Not found: $docFile (already moved)" -ForegroundColor Gray
    $skipped++
}

# 7. Fix backend/backend/uploads issue
Write-Host ""
Write-Host "[7/10] Checking backend/backend/uploads..." -ForegroundColor Yellow

if (Test-Path "backend\backend\uploads") {
    $files = Get-ChildItem "backend\backend\uploads" -File
    if ($files.Count -gt 0) {
        Write-Host "  -> Found $($files.Count) file(s) in wrong location" -ForegroundColor Cyan
        
        foreach ($file in $files) {
            $destPath = "backend\uploads\$($file.Name)"
            if (-not (Test-Path $destPath)) {
                Move-Item $file.FullName $destPath -Force
                Write-Host "  -> Moved: $($file.Name) -> backend/uploads/" -ForegroundColor Green
                $cleaned++
            } else {
                Write-Host "  -> Already exists in backend/uploads/: $($file.Name)" -ForegroundColor Yellow
                $skipped++
            }
        }
    }
    
    Remove-Item -Recurse -Force "backend\backend"
    Write-Host "  -> Removed: backend/backend/ folder" -ForegroundColor Green
    $cleaned++
} else {
    Write-Host "  -> Not found: backend/backend/uploads (good!)" -ForegroundColor Gray
    $skipped++
}

# 8. Remove SQLite database
Write-Host ""
Write-Host "[8/10] Checking SQLite database..." -ForegroundColor Yellow

if (Test-Path "guru_web.db") {
    Write-Host "  -> Found: guru_web.db" -ForegroundColor Cyan
    $response = Read-Host "     Remove guru_web.db? (Now using MySQL) [Y/n]"
    if ($response -eq "" -or $response -eq "Y" -or $response -eq "y") {
        Remove-Item "guru_web.db" -Force
        Write-Host "  -> Removed: guru_web.db" -ForegroundColor Green
        $cleaned++
    } else {
        Write-Host "  -> Kept: guru_web.db" -ForegroundColor Yellow
        $skipped++
    }
} else {
    Write-Host "  -> Not found: guru_web.db (skip)" -ForegroundColor Gray
    $skipped++
}

# 9. Check uploads/ folder in root
Write-Host ""
Write-Host "[9/10] Checking uploads/ folder in root..." -ForegroundColor Yellow

if (Test-Path "uploads") {
    $files = Get-ChildItem "uploads" -File -Recurse
    if ($files.Count -eq 0) {
        Write-Host "  -> Found: empty uploads/ folder" -ForegroundColor Cyan
        $response = Read-Host "     Remove empty uploads/ folder? [Y/n]"
        if ($response -eq "" -or $response -eq "Y" -or $response -eq "y") {
            Remove-Item -Recurse -Force "uploads"
            Write-Host "  -> Removed: uploads/ folder" -ForegroundColor Green
            $cleaned++
        } else {
            Write-Host "  -> Kept: uploads/ folder" -ForegroundColor Yellow
            $skipped++
        }
    } else {
        Write-Host "  -> WARNING: uploads/ folder has $($files.Count) file(s)" -ForegroundColor Yellow
        Write-Host "     Consider moving them to backend/uploads/ manually" -ForegroundColor Cyan
        $skipped++
    }
} else {
    Write-Host "  -> Not found: uploads/ in root (good!)" -ForegroundColor Gray
    $skipped++
}

# 10. Remove __pycache__ directories
Write-Host ""
Write-Host "[10/10] Removing Python cache..." -ForegroundColor Yellow

$pycacheDirs = Get-ChildItem -Path "backend" -Directory -Recurse -Filter "__pycache__"
if ($pycacheDirs.Count -gt 0) {
    foreach ($dir in $pycacheDirs) {
        Remove-Item -Recurse -Force $dir.FullName
        Write-Host "  -> Removed: $($dir.FullName)" -ForegroundColor Green
        $cleaned++
    }
} else {
    Write-Host "  -> Not found: __pycache__ directories" -ForegroundColor Gray
    $skipped++
}

# Summary
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "         CLEANUP SUMMARY" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Cleaned:  $cleaned item(s)" -ForegroundColor Green
Write-Host "  Skipped:  $skipped item(s)" -ForegroundColor Yellow
Write-Host ""

if ($cleaned -gt 0) {
    Write-Host "SUCCESS: Project cleaned successfully!" -ForegroundColor Green
} else {
    Write-Host "INFO: Project is already clean" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "NEXT STEPS:" -ForegroundColor Cyan
Write-Host "  1. Review changes: git status" -ForegroundColor Gray
Write-Host "  2. Commit changes: git add . && git commit -m 'chore: cleanup project'" -ForegroundColor Gray
Write-Host ""
