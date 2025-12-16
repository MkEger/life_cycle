@echo off
echo ?? URL Debug - Food Delivery
echo ===========================
echo.

echo ?? Відкриваю діагностику URL...
start http://localhost:3000/url-debug.html

echo.
echo ?? Проблемні URL для перевірки:
echo   ? Неправильно: localhost:3000/pages/pages/profile-english.html
echo   ? Правильно:   localhost:3000/pages/profile-english.html
echo.

echo ?? Тестові URL:
echo   ?? Головна:     http://localhost:3000/index.html
echo   ?? Логін:       http://localhost:3000/pages/login.html  
echo   ?? Профіль:     http://localhost:3000/pages/profile-english.html
echo   ?? Акаунти:     http://localhost:3000/test-accounts.html
echo.

pause