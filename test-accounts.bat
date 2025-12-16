@echo off
echo ?? Testing Food Delivery User Accounts
echo ======================================
echo.

echo ?? Available Test Accounts:
echo.

echo ????? ADMINISTRATORS:
echo   Email: admin@fooddelivery.com.ua
echo   Password: admin2024
echo   Features: Full system access, user management, reports
echo.

echo ?? COURIERS:
echo   Email: courier.alex@delivery.com.ua
echo   Password: courier123
echo   Features: Delivery management, order status updates
echo.
echo   Email: maria.courier@delivery.com.ua
echo   Password: maria2024
echo   Features: Delivery management, GPS tracking
echo.

echo ????? RESTAURANT MANAGERS:
echo   Email: manager.pizza@restaurant.com.ua
echo   Password: pizza2024
echo   Features: Menu management, order processing
echo.

echo ?? CUSTOMERS:
echo   Email: test@example.com
echo   Password: test123
echo   Features: Basic ordering, order history
echo.

echo ? VIP CUSTOMERS:
echo   Email: vip.client@foodlover.com.ua
echo   Password: vip2024
echo   Features: Priority delivery, special discounts
echo.

echo ?? Quick Access URLs:
echo   Login Page: http://localhost:3000/pages/login.html
echo   Accounts Demo: http://localhost:3000/test-accounts.html
echo   Profile Page: http://localhost:3000/pages/profile-english.html
echo.

echo ?? Usage Instructions:
echo 1. Open the login page
echo 2. Use any of the accounts above
echo 3. Each role has different interface and permissions
echo 4. Test ordering, delivery, and management features
echo.

pause

REM Open the test accounts page
start http://localhost:3000/test-accounts.html