@echo off
chcp 65001 >nul 2>&1
setlocal EnableDelayedExpansion

echo ?? ЛАБОРАТОРНА РОБОТА №6: ТЕСТУВАННЯ ТА ВАЛІДАЦІЯ
echo ===============================================
echo.

echo ?? МЕТА: Провести комплексне тестування системи Food Delivery
echo    Включає: Unit Tests + Component Tests + System Tests + API Tests
echo.

echo ?? ПІДГОТОВКА ТЕСТОВОГО СЕРЕДОВИЩА...

:: Перевірити наявність Node.js
node --version >nul 2>&1
if !errorlevel! neq 0 (
    echo ? Node.js не встановлено! Встановіть з https://nodejs.org
    pause
    exit /b 1
) else (
    echo ? Node.js знайдений
)

:: Перевірити наявність npm
npm --version >nul 2>&1
if !errorlevel! neq 0 (
    echo ? npm не знайдено!
    pause
    exit /b 1
) else (
    echo ? npm знайдений
)

:: Перейти в папку тестів
if exist "tests" (
    cd tests
    echo ? Перейшли в папку tests
) else (
    echo ? Папка tests не знайдена!
    echo Переконайтесь, що ви запускаєте скрипт з корневої папки проекту
    pause
    exit /b 1
)

:: Встановити залежності якщо потрібно
if not exist "node_modules" (
    echo ?? Встановлення залежностей для тестування...
    npm install
    if !errorlevel! neq 0 (
        echo ? Помилка встановлення залежностей
        pause
        exit /b 1
    )
) else (
    echo ? Залежності вже встановлені
)

echo.
echo ? Тестове середовище готове!
echo.

echo ?? ВИБІР ТИПУ ТЕСТУВАННЯ:
echo.
echo 1. ?? Юніт-тести (Unit Tests)
echo 2. ?? Компонентні тести (Component Tests)  
echo 3. ?? Системні тести (System Tests)
echo 4. ?? API тести (потребує запущений сервер)
echo 5. ?? Всі тести + покриття (Full Test Suite)
echo 6. ?? Швидкий тест (основні функції)
echo 7. ?? Генерувати звіт
echo.

set /p choice="Виберіть опцію (1-7): "

if "%choice%"=="1" goto unit_tests
if "%choice%"=="2" goto component_tests
if "%choice%"=="3" goto system_tests
if "%choice%"=="4" goto api_tests
if "%choice%"=="5" goto full_tests
if "%choice%"=="6" goto quick_tests
if "%choice%"=="7" goto generate_report

echo ? Невірний вибір
pause
exit /b 1

:unit_tests
echo.
echo ?? ЗАПУСК ЮНІТ-ТЕСТІВ...
echo ========================
npm run test:unit
goto end

:component_tests
echo.
echo ?? ЗАПУСК КОМПОНЕНТНИХ ТЕСТІВ...
echo ===============================
npm run test:component
goto end

:system_tests
echo.
echo ?? ЗАПУСК СИСТЕМНИХ ТЕСТІВ...
echo ============================
npm run test:system
goto end

:api_tests
echo.
echo ?? ЗАПУСК API ТЕСТІВ...
echo ======================
echo ??  Переконайтесь що сервер запущений (node server.js)
echo.
pause
echo Тестування API...
npm run test tests/api/api.test.js
goto end

:full_tests
echo.
echo ?? ПОВНЕ ТЕСТУВАННЯ З ПОКРИТТЯМ...
echo =================================
echo Це займе кілька хвилин...
echo.
npm run test:coverage
echo.
echo ?? Генерування детального звіту...
npm run test:all
goto end

:quick_tests
echo.
echo ?? ШВИДКЕ ТЕСТУВАННЯ...
echo ======================
echo Тестуємо основні функції...
npm test
goto end

:generate_report
echo.
echo ?? ГЕНЕРУВАННЯ ЗВІТУ...
echo ======================
echo Створюємо детальний звіт про тестування...

:: Створити HTML звіт
echo ^<!DOCTYPE html^> > test-results.html
echo ^<html^>^<head^>^<title^>Звіт про тестування^</title^>^</head^> >> test-results.html
echo ^<body^>^<h1^>?? Результати тестування Food Delivery^</h1^> >> test-results.html
echo ^<p^>Дата: %date% %time%^</p^> >> test-results.html

npm run test:coverage > test-output.log 2>&1
echo ^<h2^>Результати тестів:^</h2^>^<pre^> >> test-results.html
type test-output.log >> test-results.html
echo ^</pre^>^</body^>^</html^> >> test-results.html

echo ? Звіт створено: tests\test-results.html
start test-results.html
goto end

:end
echo.
echo ?? ТЕСТУВАННЯ ЗАВЕРШЕНО!
echo.
echo ?? РЕЗУЛЬТАТИ:
echo    ?? Файли тестів: tests\**\*.test.js
echo    ?? Звіт покриття: tests\coverage\
echo    ?? Детальний звіт: tests\TEST_REPORT.md
echo.
echo ?? ДЛЯ ЛАБОРАТОРНОЇ РОБОТИ:
echo    1. Результати тестування: tests\test-results.html
echo    2. Покриття коду: tests\coverage\lcov-report\index.html  
echo    3. Повний звіт: tests\TEST_REPORT.md
echo.

echo ?? РЕКОМЕНДАЦІЇ:
if "%choice%"=="5" (
    echo    ? Відкрийте coverage\lcov-report\index.html для детального покриття
    echo    ? Перевірте TEST_REPORT.md для висновків
)
if "%choice%"=="4" (
    echo    ??  Якщо API тести провалились - запустіть сервер: node server.js
)

echo.
pause

cd ..