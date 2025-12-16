@echo off
chcp 65001 >nul
echo ?? Швидке налаштування Food Delivery...
echo.

echo ?? Крок 1: Перевіряємо MySQL...
mysql --version >nul 2>&1
if errorlevel 1 (
    echo ? MySQL не знайдено! 
    echo ?? Встановіть XAMPP, WAMP або MySQL окремо
    echo ?? XAMPP: https://www.apachefriends.org/
    pause
    exit /b 1
)
echo ? MySQL знайдено

echo.
echo ?? Крок 2: Створюємо базу даних...
mysql -u root -p --execute="source database/quick_setup.sql"
if errorlevel 1 (
    echo ? Помилка створення бази даних
    echo ?? Переконайтеся що MySQL запущений і пароль правильний
    pause
    exit /b 1
)
echo ? База даних створена

echo.
echo ?? Крок 3: Встановлюємо залежності...
npm install
if errorlevel 1 (
    echo ? Помилка встановлення залежностей
    pause
    exit /b 1
)
echo ? Залежності встановлені

echo.
echo ?? Налаштування завершено!
echo.
echo ?? Для запуску використовуйте:
echo    npm start
echo.
echo ?? Додаток буде доступний: http://localhost:3000
echo.
echo ?? Тестові акаунти:
echo    Адмін: admin@fooddelivery.com / admin123
echo    Користувач: test@example.com / test123
echo.

set /p start_now="Запустити зараз? (y/n): "
if /i "%start_now%"=="y" (
    echo ?? Запускаємо сервер...
    npm start
)

pause