@echo off
chcp 65001 >nul
title ?? COMPREHENSIVE DIAGNOSTIC - Food Delivery

echo.
echo ????????????????????????????????????????????????????????????
echo ?            ?? COMPREHENSIVE DIAGNOSTIC                   ?
echo ?              Food Delivery Debug                         ?
echo ????????????????????????????????????????????????????????????
echo.

echo [1/6] ?? Stopping any running servers...
taskkill /f /im node.exe >nul 2>&1
timeout /t 2 >nul
echo ? Servers stopped

echo.
echo [2/6] ?? Starting fresh server...
start /min cmd /c "node server.js"
echo Server starting...
timeout /t 4 >nul

echo.
echo [3/6] ?? Health check...
curl -s http://localhost:3000/api/health >health.json 2>nul
if exist health.json (
    echo ? Server responding
    type health.json | findstr "status" >nul && echo ? Health endpoint works || echo ? Health endpoint error
    del health.json >nul 2>&1
) else (
    echo ? Server not responding
)

echo.
echo [4/6] ?? Testing API endpoints...

echo ?? Test endpoint...
curl -s http://localhost:3000/api/test >test.json 2>nul
if exist test.json (
    echo ? Test API works
    del test.json >nul 2>&1
) else (
    echo ? Test API failed
)

echo ?? Orders endpoint...
curl -s http://localhost:3000/api/orders/user >orders.json 2>nul
if exist orders.json (
    findstr "restaurant_name" orders.json >nul && (
        echo ? Orders API works
        echo ?? Sample data:
        type orders.json | findstr "restaurant_name" | head -n 2
    ) || (
        echo ? Orders API returns invalid data
        echo Content:
        type orders.json
    )
    del orders.json >nul 2>&1
) else (
    echo ? Orders API failed
)

echo.
echo [5/6] ?? Testing frontend...
echo ?? Checking files...
if exist "pages\profile.html" (echo ? Profile HTML found) else (echo ? Profile HTML missing!)
if exist "index.html" (echo ? Index HTML found) else (echo ? Index HTML missing!)
if exist "styles.css" (echo ? Styles CSS found) else (echo ? Styles CSS missing!)

echo.
echo [6/6] ?? Frontend test...
echo Opening profile for manual testing...

echo.
echo ????????????????????????????????????????????????????????????
echo ?                  ?? TEST RESULTS                        ?
echo ????????????????????????????????????????????????????????????

echo.
echo ?? DIAGNOSTIC STEPS:
echo.
echo 1?? BROWSER TEST:
echo    Х Open: http://localhost:3000/pages/profile.html
echo    Х Login: test@example.com / test123
echo    Х Check "My Orders" tab
echo    Х Open Developer Tools (F12) ? Console
echo.
echo 2?? LOOK FOR IN CONSOLE:
echo    Х "?? —проба завантаженн€ замовлень з API..."
echo    Х "?? API Response: {...}"
echo    Х "? «амовленн€ завантажен≥: [...]"
echo    Х Any RED error messages
echo.
echo 3?? EXPECTED RESULTS:
echo    Х Should show: "Tasty Pizzeria", "Sushi Master", etc.
echo    Х Should NOT show: diamond symbols (???)
echo    Х Should have 4 test orders
echo.
echo 4?? IF STILL SHOWING DIAMONDS:
echo    Х Check browser console for errors
echo    Х Try different browser (Chrome/Firefox/Edge)
echo    Х Try private/incognito mode
echo    Х Clear browser cache completely
echo.

set /p run_test="?? Open browser for testing? (y/n): "
if /i "%run_test%"=="y" (
    echo.
    echo ?? Opening test environment...
    start http://localhost:3000/pages/profile.html
    
    echo.
    echo ?? MANUAL TEST CHECKLIST:
    echo ? Page loads without errors
    echo ? Login works (test@example.com / test123)
    echo ? "My Orders" tab exists and is clickable
    echo ? Orders display with readable text (not diamonds)
    echo ? 4 orders are shown
    echo ? Restaurant names are in English
    echo ? No console errors (check F12)
    
    echo.
    echo ??  IF PROBLEMS PERSIST:
    echo 1. Check console output above for errors
    echo 2. Try: Ctrl+Shift+R (hard refresh)
    echo 3. Try different browser
    echo 4. Report exact error messages from console
    
) else (
    echo ?? Manual test: http://localhost:3000/pages/profile.html
)

echo.
echo ?? Server logs are in the background window
echo ?? Keep this window open to see diagnostics
echo.

pause