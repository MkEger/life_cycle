# ?? ЛАБОРАТОРНА РОБОТА №6: ТЕСТУВАННЯ ТА ВАЛІДАЦІЯ
# PowerShell версія

Write-Host "?? ЛАБОРАТОРНА РОБОТА №6: ТЕСТУВАННЯ ТА ВАЛІДАЦІЯ" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "?? МЕТА: Провести комплексне тестування системи Food Delivery" -ForegroundColor Yellow
Write-Host "   Включає: Unit Tests + Component Tests + System Tests + API Tests" -ForegroundColor Yellow
Write-Host ""

Write-Host "?? ПІДГОТОВКА ТЕСТОВОГО СЕРЕДОВИЩА..." -ForegroundColor Green

# Перевірити наявність Node.js
try {
    $nodeVersion = node --version
    Write-Host "? Node.js знайдений: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "? Node.js не встановлено! Встановіть з https://nodejs.org" -ForegroundColor Red
    Read-Host "Натисніть Enter для завершення"
    exit 1
}

# Перевірити наявність npm
try {
    $npmVersion = npm --version
    Write-Host "? npm знайдений: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "? npm не знайдено!" -ForegroundColor Red
    Read-Host "Натисніть Enter для завершення"
    exit 1
}

# Перейти в папку тестів
if (Test-Path "tests") {
    Set-Location tests
    Write-Host "? Перейшли в папку tests" -ForegroundColor Green
} else {
    Write-Host "? Папка tests не знайдена!" -ForegroundColor Red
    Write-Host "Переконайтесь, що ви запускаєте скрипт з корневої папки проекту" -ForegroundColor Yellow
    Read-Host "Натисніть Enter для завершення"
    exit 1
}

# Встановити залежності якщо потрібно
if (!(Test-Path "node_modules")) {
    Write-Host "?? Встановлення залежностей для тестування..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "? Помилка встановлення залежностей" -ForegroundColor Red
        Read-Host "Натисніть Enter для завершення"
        exit 1
    }
} else {
    Write-Host "? Залежності вже встановлені" -ForegroundColor Green
}

Write-Host ""
Write-Host "? Тестове середовище готове!" -ForegroundColor Green
Write-Host ""

Write-Host "?? ВИБІР ТИПУ ТЕСТУВАННЯ:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. ?? Юніт-тести (Unit Tests)" -ForegroundColor White
Write-Host "2. ?? Компонентні тести (Component Tests)" -ForegroundColor White
Write-Host "3. ?? Системні тести (System Tests)" -ForegroundColor White
Write-Host "4. ?? API тести (потребує запущений сервер)" -ForegroundColor White
Write-Host "5. ?? Всі тести + покриття (Full Test Suite)" -ForegroundColor Yellow
Write-Host "6. ?? Швидкий тест (основні функції)" -ForegroundColor White
Write-Host "7. ?? Генерувати звіт" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Виберіть опцію (1-7)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "?? ЗАПУСК ЮНІТ-ТЕСТІВ..." -ForegroundColor Cyan
        Write-Host "========================" -ForegroundColor Cyan
        npm run test:unit
    }
    "2" {
        Write-Host ""
        Write-Host "?? ЗАПУСК КОМПОНЕНТНИХ ТЕСТІВ..." -ForegroundColor Cyan
        Write-Host "===============================" -ForegroundColor Cyan
        npm run test:component
    }
    "3" {
        Write-Host ""
        Write-Host "?? ЗАПУСК СИСТЕМНИХ ТЕСТІВ..." -ForegroundColor Cyan
        Write-Host "=============================" -ForegroundColor Cyan
        npm run test:system
    }
    "4" {
        Write-Host ""
        Write-Host "?? ЗАПУСК API ТЕСТІВ..." -ForegroundColor Cyan
        Write-Host "======================" -ForegroundColor Cyan
        Write-Host "??  Переконайтесь що сервер запущений (node server.js)" -ForegroundColor Yellow
        Write-Host ""
        Read-Host "Натисніть Enter для продовження"
        Write-Host "Тестування API..." -ForegroundColor Green
        npm run test tests/api/api.test.js
    }
    "5" {
        Write-Host ""
        Write-Host "?? ПОВНЕ ТЕСТУВАННЯ З ПОКРИТТЯМ..." -ForegroundColor Cyan
        Write-Host "=================================" -ForegroundColor Cyan
        Write-Host "Це займе кілька хвилин..." -ForegroundColor Yellow
        Write-Host ""
        npm run test:coverage
        Write-Host ""
        Write-Host "?? Генерування детального звіту..." -ForegroundColor Green
        npm run test:all
    }
    "6" {
        Write-Host ""
        Write-Host "?? ШВИДКЕ ТЕСТУВАННЯ..." -ForegroundColor Cyan
        Write-Host "======================" -ForegroundColor Cyan
        Write-Host "Тестуємо основні функції..." -ForegroundColor Green
        npm test -- --testNamePattern="should" --verbose
    }
    "7" {
        Write-Host ""
        Write-Host "?? ГЕНЕРУВАННЯ ЗВІТУ..." -ForegroundColor Cyan
        Write-Host "======================" -ForegroundColor Cyan
        Write-Host "Створюємо детальний звіт про тестування..." -ForegroundColor Green
        
        # Створити HTML звіт
        $htmlContent = @"
<!DOCTYPE html>
<html><head><title>Звіт про тестування</title></head>
<body><h1>?? Результати тестування Food Delivery</h1>
<p>Дата: $(Get-Date)</p>
<h2>Результати тестів:</h2><pre>
"@
        
        $htmlContent | Out-File -FilePath "test-results.html" -Encoding UTF8
        npm run test:coverage > test-output.log 2>&1
        Get-Content "test-output.log" | Add-Content "test-results.html"
        "</pre></body></html>" | Add-Content "test-results.html"
        
        Write-Host "? Звіт створено: tests\test-results.html" -ForegroundColor Green
        Start-Process "test-results.html"
    }
    default {
        Write-Host "? Невірний вибір" -ForegroundColor Red
        Read-Host "Натисніть Enter для завершення"
        exit 1
    }
}

Write-Host ""
Write-Host "?? ТЕСТУВАННЯ ЗАВЕРШЕНО!" -ForegroundColor Green
Write-Host ""
Write-Host "?? РЕЗУЛЬТАТИ:" -ForegroundColor Cyan
Write-Host "   ?? Файли тестів: tests\**\*.test.js" -ForegroundColor White
Write-Host "   ?? Звіт покриття: tests\coverage\" -ForegroundColor White
Write-Host "   ?? Детальний звіт: tests\TEST_REPORT.md" -ForegroundColor White
Write-Host ""
Write-Host "?? ДЛЯ ЛАБОРАТОРНОЇ РОБОТИ:" -ForegroundColor Yellow
Write-Host "   1. Результати тестування: tests\test-results.html" -ForegroundColor White
Write-Host "   2. Покриття коду: tests\coverage\lcov-report\index.html" -ForegroundColor White
Write-Host "   3. Повний звіт: tests\TEST_REPORT.md" -ForegroundColor White
Write-Host ""

Write-Host "?? РЕКОМЕНДАЦІЇ:" -ForegroundColor Green
if ($choice -eq "5") {
    Write-Host "   ? Відкрийте coverage\lcov-report\index.html для детального покриття" -ForegroundColor Green
    Write-Host "   ? Перевірте TEST_REPORT.md для висновків" -ForegroundColor Green
}
if ($choice -eq "4") {
    Write-Host "   ??  Якщо API тести провалились - запустіть сервер: node server.js" -ForegroundColor Yellow
}

Write-Host ""
Read-Host "Натисніть Enter для завершення"

# Повернутися в корневу папку
Set-Location ..