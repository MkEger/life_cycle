@echo off
chcp 65001 >nul
title ?? Food Delivery - ПОВНЕ ТЕСТУВАННЯ

echo.
echo ????????????????????????????????????????????????????????????
echo ?                ?? ПОВНЕ ТЕСТУВАННЯ                      ?
echo ?                 Food Delivery App                        ?
echo ????????????????????????????????????????????????????????????
echo.

echo [1/6] ?? Перевірка файлів...
if exist "index.html" (echo ? Головна сторінка) else (echo ? index.html не знайдено!)
if exist "dishes.html" (echo ? Сторінка страв) else (echo ? dishes.html не знайдено!)
if exist "payment.html" (echo ? Сторінка оплати) else (echo ? payment.html не знайдено!)
if exist "confirmation.html" (echo ? Підтвердження) else (echo ? confirmation.html не знайдено!)
if exist "pages\profile.html" (echo ? Особистий кабінет) else (echo ? profile.html не знайдено!)
if exist "styles.css" (echo ? Стилі CSS) else (echo ? styles.css не знайдено!)
if exist "js\script.js" (echo ? JavaScript) else (echo ? script.js не знайдено!)

echo.
echo [2/6] ?? CSS перевірки...
findstr /C:"profile-header" styles.css >nul && echo ? Стилі кабінету || echo ? Стилі кабінету відсутні
findstr /C:"checkout-progress" styles.css >nul && echo ? Стилі оплати || echo ? Стилі оплати відсутні
findstr /C:"confirmation-success" styles.css >nul && echo ? Стилі підтвердження || echo ? Стилі підтвердження відсутні
findstr /C:"highlighted-dish" styles.css >nul && echo ? Анімації страв || echo ? Анімації відсутні

echo.
echo [3/6] ?? JavaScript функції...
findstr /C:"orderNow" js\script.js >nul && echo ? Швидкі замовлення || echo ? orderNow відсутня
findstr /C:"addToCart" js\script.js >nul && echo ? Додавання до кошика || echo ? addToCart відсутня
findstr /C:"proceedToCheckout" js\script.js >nul && echo ? Оформлення замовлення || echo ? proceedToCheckout відсутня

echo.
echo [4/6] ?? Авторизація...
if exist "js\auth.js" (echo ? Система авторизації) else (echo ? auth.js не знайдено!)
if exist "pages\login.html" (echo ? Сторінка входу) else (echo ? login.html не знайдено!)
if exist "pages\register.html" (echo ? Сторінка реєстрації) else (echo ? register.html не знайдено!)

echo.
echo [5/6] ??? База даних...
if exist "database\quick_setup.sql" (echo ? Структура БД) else (echo ? quick_setup.sql не знайдено!)
if exist "database\test_data.sql" (echo ? Тестові дані) else (echo ? test_data.sql не знайдено!)

echo.
echo [6/6] ?? Сервер...
curl -s http://localhost:3000/api/health >nul 2>&1
if errorlevel 1 (
    echo ? Сервер не запущений
    echo ?? Запустіть: npm start
) else (
    echo ? Сервер працює
    
    echo.
    echo ?? API перевірки...
    curl -s http://localhost:3000/api/restaurants >nul 2>&1 && echo ? API ресторанів || echo ? API ресторанів не працює
    curl -s http://localhost:3000/api/menu-items >nul 2>&1 && echo ? API страв || echo ? API страв не працює
    curl -s http://localhost:3000/api/categories >nul 2>&1 && echo ? API категорій || echo ? API категорій не працює
)

echo.
echo ????????????????????????????????????????????????????????????
echo ?                ? НОВІ МОЖЛИВОСТІ ?                    ?
echo ????????????????????????????????????????????????????????????
echo.

echo ?? ОСНОВНІ ФУНКЦІЇ:
echo ?? ? Швидкі замовлення з головної сторінки
echo ?? ?? Покращений кошик з групуванням по ресторанах
echo ?? ?? Особистий кабінет з історією замовлень
echo ?? ?? Повний процес оплати з вибором способу
echo ?? ? Сторінка підтвердження з трекінгом статусу
echo ?? ?? Пошук і фільтрація страв
echo ?? ?? Повністю адаптивний дизайн
echo ?? ???? Українська локалізація

echo.
echo ?? ЯК ТЕСТУВАТИ:
echo.
echo 1?? ГОЛОВНА СТОРІНКА (http://localhost:3000):
echo    • Натисніть кнопки "Замовити" на рекомендованих стравах
echo    • Перевірте чи додаються страви до кошика
echo    • Перевірте чи працює перехід до меню
echo.
echo 2?? СТОРІНКА СТРАВ (http://localhost:3000/dishes.html):
echo    • Спробуйте фільтри (ресторан, категорія, пошук)
echo    • Додайте кілька страв до кошика
echo    • Відкрийте кошик (?? в правому верхньому куті)
echo    • Змініть кількість товарів у кошику
echo.
echo 3?? АВТОРИЗАЦІЯ:
echo    • Увійдіть з тестовим акаунтом: test@example.com / test123
echo    • Перевірте чи з'явилося ім'я користувача в навігації
echo    • Натисніть на ім'я для переходу до особистого кабінету
echo.
echo 4?? ОФОРМЛЕННЯ ЗАМОВЛЕННЯ:
echo    • Додайте товари до кошика (мін. $15)
echo    • Натисніть "Оформити замовлення"
echo    • Заповніть адресу доставки
echo    • Оберіть спосіб оплати
echo    • Підтвердіть замовлення
echo.
echo 5?? ОСОБИСТИЙ КАБІНЕТ (http://localhost:3000/pages/profile.html):
echo    • Переглядайте історію замовлень
echo    • Керуйте адресами доставки
echo    • Змінюйте налаштування акаунту
echo.

echo ????????????????????????????????????????????????????????????
echo ?              ?? ГОТОВО ДО ЗАПУСКУ!                      ?
echo ????????????????????????????????????????????????????????????
echo.

set /p open_site="?? Відкрити сайт у браузері? (y/n): "
if /i "%open_site%"=="y" (
    echo ?? Відкриваємо Food Delivery...
    start http://localhost:3000
    timeout /t 2 >nul
    echo.
    echo ?? ШВИДКІ ТЕСТИ:
    echo • Натисніть "?? Замовити" під будь-якою стравою на головній
    echo • Увійдіть з акаунтом: test@example.com / test123
    echo • Додайте страви до кошика і оформіть замовлення
    echo • Перевірте особистий кабінет
) else (
    echo ?? Відкрийте браузер та перейдіть: http://localhost:3000
)

echo.
pause