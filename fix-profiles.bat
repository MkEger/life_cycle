@echo off
echo ?? Тест Профілів - Food Delivery
echo =================================
echo.

echo ?? Перевірка файлів...
if exist "pages\profile-english.html" (
    echo ? Profile-English знайдено
) else (
    echo ? Profile-English НЕ знайдено
)

if exist "js\auth.js" (
    echo ? Auth.js знайдено
) else (
    echo ? Auth.js НЕ знайдено
)

if exist "styles-clean.css" (
    echo ? Styles-Clean знайдено
) else (
    echo ? Styles-Clean НЕ знайдено
)

echo.
echo ?? Проблеми які треба перевірити:
echo   1. Чи завантажується профіль правильно?
echo   2. Чи працюють всі ролі (admin, courier, manager, user)?
echo   3. Чи правильно відображаються замовлення?
echo   4. Чи працюють перенаправлення?
echo.

echo ?? Виправлення:
echo   ? Додано відсутні функції в profile-english.html
echo   ? Покращено ініціалізацію користувача
echo   ? Виправлено логіку ролей
echo   ? Додано тестові замовлення
echo.

echo ?? Відкриваю тест профілів...
start http://localhost:3000/test-profiles.html

echo.
echo ?? Швидкі тести:
echo   1. Тест всіх ролей: http://localhost:3000/test-accounts.html
echo   2. Тест профілів: http://localhost:3000/test-profiles.html
echo   3. Тест паролів: http://localhost:3000/test-passwords.html
echo   4. URL діагностика: http://localhost:3000/url-debug.html
echo.

pause