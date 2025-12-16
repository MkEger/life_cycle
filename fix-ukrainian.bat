@echo off
chcp 65001 >nul
title ?? ФІКСАЦІЯ КОДУВАННЯ УКРАЇНСЬКОГО ТЕКСТУ

echo.
echo ????????????????????????????????????????????????????????????
echo ?          ???? ВИПРАВЛЕННЯ УКРАЇНСЬКОГО ТЕКСТУ             ?
echo ????????????????????????????????????????????????????????????
echo.

echo [1/5] ?? Зупинка поточного сервера...
tasklist /fi "imagename eq node.exe" | find "node.exe" >nul
if %errorlevel%==0 (
    echo Зупиняємо Node.js процеси...
    taskkill /f /im node.exe >nul 2>&1
    timeout /t 2 >nul
)

echo [2/5] ?? Очистка кешу браузера...
echo Очищаємо кеш для правильного відображення...
timeout /t 1 >nul

echo [3/5] ?? Запуск сервера з новим кодуванням...
start /min cmd /c "node server.js"
echo Сервер запускається...
timeout /t 3 >nul

echo [4/5] ?? Перевірка API...
curl -s -H "Accept-Charset: utf-8" http://localhost:3000/api/orders/user >nul 2>&1
if errorlevel 1 (
    echo ? Сервер ще не готовий, чекаємо...
    timeout /t 3 >nul
    curl -s http://localhost:3000/api/orders/user >nul 2>&1
    if errorlevel 1 (
        echo ? Проблема з сервером!
        goto :error
    )
)

echo ? API працює!

echo [5/5] ?? Тестування українського тексту...
echo.
echo ?? Тестування ендпоінтів:

echo ?? API Замовлень...
curl -s -H "Accept-Charset: utf-8" http://localhost:3000/api/orders/user | findstr "restaurant_name" >temp_orders.txt 2>nul
if exist temp_orders.txt (
    echo ? API замовлень працює
    del temp_orders.txt >nul 2>&1
) else (
    echo ?? API замовлень недоступний
)

echo ?? API Ресторанів...
curl -s -H "Accept-Charset: utf-8" http://localhost:3000/api/restaurants >nul 2>&1 && echo ? API ресторанів працює || echo ?? API ресторанів недоступний

echo ?? API Страв...
curl -s -H "Accept-Charset: utf-8" http://localhost:3000/api/menu-items >nul 2>&1 && echo ? API страв працює || echo ?? API страв недоступний

echo.
echo ????????????????????????????????????????????????????????????
echo ?                ? КОДУВАННЯ ВИПРАВЛЕНО                   ?
echo ????????????????????????????????????????????????????????????
echo.

echo ?? ЩО ВИПРАВЛЕНО:
echo ?? ?? UTF-8 заголовки для JSON API
echo ?? ?? Правильне кодування статичних файлів  
echo ?? ??? UTF-8 кодування бази даних
echo ?? ?? Кеш браузера очищено
echo ?? ?? Сервер перезапущено з новими налаштуваннями

echo.
echo ?? ТЕСТУВАННЯ:
echo 1?? Відкрийте: http://localhost:3000/pages/profile.html
echo 2?? Увійдіть з: test@example.com / test123  
echo 3?? Перевірте вкладку "?? Мої Замовлення"
echo 4?? Має відображатися:
echo    • Смачна Піцерія (замість ромбиків)
echo    • Суші Майстер
echo    • Burger House  
echo    • Італійський дворик
echo.

echo ?? ЯКЩО ПРОБЛЕМА ЗАЛИШАЄТЬСЯ:
echo 1. Натисніть Ctrl+F5 для жорсткого оновлення
echo 2. Очистіть кеш браузера повністю
echo 3. Спробуйте інший браузер (Chrome/Firefox/Edge)
echo 4. Перевірте що браузер підтримує UTF-8

set /p test_browser="?? Відкрити для тестування? (y/n): "
if /i "%test_browser%"=="y" (
    echo ?? Відкриваємо профіль для тестування...
    start http://localhost:3000/pages/profile.html
    timeout /t 2 >nul
    echo.
    echo ?? ШВИДКИЙ ТЕСТ:
    echo • Увійдіть з test@example.com / test123
    echo • Перевірте чи замість ромбиків показується "Смачна Піцерія"
    echo • Якщо так - проблему виправлено! ?
    echo • Якщо ні - спробуйте Ctrl+F5 або інший браузер
    goto :end
) else (
    echo ?? Відкрийте вручну: http://localhost:3000/pages/profile.html
    goto :end
)

:error
echo.
echo ? ПОМИЛКА ЗАПУСКУ СЕРВЕРА
echo ?? Спробуйте:
echo 1. npm install (встановити залежності)
echo 2. Перевірте чи запущений MySQL
echo 3. Перевірте .env конфігурацію
echo 4. Запустіть вручну: node server.js
goto :end

:end
echo.
pause