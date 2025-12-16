@echo off
chcp 65001 >nul
title ?? Виправлення кодування - Food Delivery

echo.
echo ????????????????????????????????????????????????????????????
echo ?              ?? ВИПРАВЛЕННЯ КОДУВАННЯ                   ?
echo ?                Food Delivery App                         ?
echo ????????????????????????????????????????????????????????????
echo.

echo [1/4] ?? Перевірка файлів...
if exist "pages\profile.html" (echo ? Profile HTML знайдено) else (echo ? profile.html не знайдено!)
if exist "payment.html" (echo ? Payment HTML знайдено) else (echo ? payment.html не знайдено!)
if exist "server.js" (echo ? Server JS знайдено) else (echo ? server.js не знайдено!)

echo.
echo [2/4] ?? Перевірка кодування UTF-8...
findstr /C:"charset=UTF-8" pages\profile.html >nul && echo ? Profile: UTF-8 налаштовано || echo ?? Profile: потрібно налаштувати UTF-8
findstr /C:"charset=UTF-8" payment.html >nul && echo ? Payment: UTF-8 налаштовано || echo ?? Payment: потрібно налаштувати UTF-8

echo.
echo [3/4] ??? Тестові дані...
findstr /C:"Смачна Піцерія" server.js >nul && echo ? Українські назви ресторанів || echo ? Проблема з українським текстом
findstr /C:"loadUserOrders" pages\profile.html >nul && echo ? Функція завантаження замовлень || echo ? Функція відсутня

echo.
echo [4/4] ?? Запуск сервера...
echo ?? Перевіримо чи працює сервер...

curl -s http://localhost:3000/api/orders/user >nul 2>&1
if errorlevel 1 (
    echo ? Сервер не запущений або API не працює
    echo.
    echo ?? ВИПРАВЛЕННЯ:
    echo 1. Запустіть сервер: npm start
    echo 2. Перейдіть до: http://localhost:3000/pages/profile.html
    echo 3. Увійдіть з test@example.com / test123
    echo 4. Перевірте розділ "Мої Замовлення"
) else (
    echo ? API замовлень працює!
    
    echo.
    echo ?? Тестові замовлення:
    curl -s http://localhost:3000/api/orders/user | findstr "restaurant_name" | head -n 3
)

echo.
echo ????????????????????????????????????????????????????????????
echo ?                ? ВИПРАВЛЕННЯ ГОТОВІ                     ?
echo ????????????????????????????????????????????????????????????
echo.

echo ?? ТЕСТУВАННЯ ОСОБИСТОГО КАБІНЕТУ:
echo.
echo 1?? Відкрийте: http://localhost:3000/pages/profile.html
echo 2?? Увійдіть з тестовим акаунтом:
echo    ?? Email: test@example.com
echo    ?? Пароль: test123
echo.
echo 3?? Перевірте вкладки:
echo    • ?? Мої Замовлення (тепер з правильними назвами)
echo    • ?? Адреси Доставки  
echo    • ?? Налаштування
echo    • ?? Улюблене
echo.
echo 4?? У розділі "Мої Замовлення" повинні бути:
echo    • ?? Смачна Піцерія - Маргарита, Пепероні, Кока-Кола
echo    • ?? Суші Майстер - Філадельфія x2, Каліфорнія  
echo    • ?? Burger House - Класік Бургер, Картопля фрі, Мілкшейк
echo    • ?? Італійський дворик - Паста Карбонара, Салат Капрезе

set /p open_profile="?? Відкрити особистий кабінет? (y/n): "
if /i "%open_profile%"=="y" (
    echo ?? Відкриваємо особистий кабінет...
    start http://localhost:3000/pages/profile.html
    echo.
    echo ?? ШВИДКИЙ ТЕСТ:
    echo • Увійдіть з test@example.com / test123
    echo • Перевірте чи відображається українським текстом
    echo • Натисніть різні кнопки в замовленнях
) else (
    echo ?? Відкрийте браузер: http://localhost:3000/pages/profile.html
)

echo.
pause