@echo off
echo ?? СУПЕР ПРОСТИЙ ЗАПУСК ТЕСТІВ
echo ===========================
echo.

cd tests

echo ?? Швидка установка...
npm install --silent

echo.
echo ?? Запуск демо тесту...
npx jest demo.test.js --verbose

echo.
echo ? Демо тест завершено!
echo.
echo ?? Тепер спробуйте інші тести:
echo    npm run test:unit
echo    npm run test:component  
echo    npm run test:api
echo    npm run test:system
echo.
echo ?? Або запустіть всі тести одразу:
echo    npm test
echo.

pause
cd ..