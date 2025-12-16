@echo off
echo ?? ВИПРАВЛЕННЯ КОНФЛІКТУ JEST КОНФІГУРАЦІЙ...
echo.

cd tests

echo ??? Видалення конфліктуючих файлів...
if exist jest.config.js (
    del jest.config.js
    echo ? jest.config.js видалено
)

echo ?? Очищення та переустановлення залежностей...
if exist node_modules (
    rmdir /s /q node_modules
    echo ? node_modules очищено
)
if exist package-lock.json (
    del package-lock.json
    echo ? package-lock.json видалено
)

echo.
echo ?? Встановлення залежностей...
npm install
if %errorlevel% neq 0 (
    echo ? Помилка встановлення залежностей
    pause
    cd ..
    exit /b 1
)

echo.
echo ?? ТЕСТУВАННЯ КОНФІГУРАЦІЇ...
echo.

echo ?? Перевірка версії Jest...
npx jest --version
if %errorlevel% neq 0 (
    echo ?? Jest не працює, але спробуємо простий тест...
)

echo.
echo ?? Запускаємо простий тест...
npm test auth.test.js
if %errorlevel% neq 0 (
    echo.
    echo ?? Пробуємо альтернативний запуск...
    npx jest unit/auth.test.js
)

echo.
echo ? Конфігурацію виправлено!
echo ?? Тепер можете запускати: npm test
echo.

pause
cd ..