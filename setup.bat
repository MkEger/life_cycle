@echo off
echo ?? Setting up Food Delivery Application...

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ? Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ? npm is not installed. Please install npm first.
    pause
    exit /b 1
)

REM Install dependencies
echo ?? Installing dependencies...
npm install

echo.
echo ??? Setting up database...
echo Please make sure MySQL is running and create the database using:
echo mysql -u root -p < database/schema.sql
echo mysql -u root -p < database/sample_data.sql

echo.
echo ?? Configuration:
echo 1. Copy .env.example to .env if not already done
echo 2. Update database credentials in .env file
echo 3. Make sure MySQL service is running

echo.
echo ?? To start the application:
echo npm start

echo.
echo ?? Available scripts:
echo npm start       - Start production server
echo npm run dev     - Start development server with nodemon

echo.
echo ?? Application will be available at: http://localhost:3000
pause