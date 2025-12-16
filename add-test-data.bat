@echo off
chcp 65001 >nul
echo ?? Додавання тестових даних...

echo Введіть пароль для MySQL користувача root:
mysql -u root -p food_delivery < database/test_data.sql

if errorlevel 1 (
    echo ? Помилка додавання тестових даних
    pause
    exit /b 1
)

echo ? Тестові дані додані успішно!
echo.
echo ?? Тестові акаунти (пароль: test123):
echo    ?? admin@fooddelivery.com - Адміністратор
echo    ?? test@example.com - Звичайний користувач  
echo    ?? john.doe@email.com - Джон Доу
echo    ?? jane.smith@email.com - Джейн Сміт
echo    ?? courier1@delivery.com - Кур'єр Олексій
echo.
echo ?? Ресторани:
echo    ?? Смачна Піцерія
echo    ?? Суші Майстер  
echo    ?? Burger House
echo    ?? Італійський дворик
echo.
echo ?? Відкрийте http://localhost:3000/dishes.html щоб побачити страви!
pause