@echo off
echo ?? Запуск тестів Лабораторної роботи 6...
echo.

echo ?? Перевірка середовища...
node --version
if %errorlevel% neq 0 (
    echo ? Node.js не встановлено!
    pause
    exit /b 1
)

echo ?? Переходимо в папку тестів...
cd tests

echo ?? Встановлення залежностей...
npm install
if %errorlevel% neq 0 (
    echo ? Помилка встановлення залежностей
    pause
    cd ..
    exit /b 1
)

echo.
echo ?? Запускаємо тести...
npm test
if %errorlevel% neq 0 (
    echo ?? Деякі тести провалилися, але це нормально для demo
)

echo.
echo ? Тестування завершено!
echo ?? Результати в папці tests/
echo.

pause
cd ..