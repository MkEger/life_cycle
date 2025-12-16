@echo off
echo ?? Налаштування Food Delivery Application...

REM Перевіряємо чи встановлений Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ? Node.js не встановлений. Будь ласка, встановіть Node.js спочатку.
    pause
    exit /b 1
)

echo ?? Встановлюємо залежності...
npm install

echo.
echo ??? Налаштування бази даних...
echo Будь ласка, переконайтеся що MySQL запущений і виконайте наступні команди:
echo.
echo 1. Створення бази даних:
echo    mysql -u root -p ^< database/create_db.sql
echo.
echo 2. Створення таблиць:
echo    mysql -u root -p ^< database/schema.sql
echo.
echo 3. Додавання тестових даних:
echo    mysql -u root -p ^< database/sample_data.sql
echo.

set /p create_db="Хочете автоматично створити базу даних? (y/n): "
if /i "%create_db%"=="y" (
    echo Створення бази даних...
    mysql -u root -p < database/create_db.sql
    if errorlevel 1 (
        echo ? Помилка створення бази даних
    ) else (
        echo ? База даних створена
        
        echo Створення таблиць...
        mysql -u root -p < database/schema.sql
        if errorlevel 1 (
            echo ? Помилка створення таблиць
        ) else (
            echo ? Таблиці створені
            
            echo Додавання тестових даних...
            mysql -u root -p < database/sample_data.sql
            if errorlevel 1 (
                echo ? Помилка додавання даних
            ) else (
                echo ? Тестові дані додані
            )
        )
    )
)

echo.
echo ?? Конфігурація:
echo 1. Переконайтеся що файл .env містить правильні налаштування БД
echo 2. Переконайтеся що MySQL сервіс запущений

echo.
echo ?? Для запуску застосунку:
echo npm start

echo.
echo ?? Застосунок буде доступний за адресою: http://localhost:3000

echo.
echo ?? Тестові акаунти:
echo Адмін: admin@fooddelivery.com / admin123
echo Користувач: test@example.com / test123

pause