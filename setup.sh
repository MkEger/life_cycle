#!/bin/bash

# Food Delivery Setup Script

echo "?? Setting up Food Delivery Application..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "? Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "? npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies
echo "?? Installing dependencies..."
npm install

# Check if MySQL is running (this is basic, might need adjustment based on OS)
echo "??? Setting up database..."
echo "Please make sure MySQL is running and create the database using:"
echo "mysql -u root -p < database/schema.sql"
echo "mysql -u root -p < database/sample_data.sql"

echo ""
echo "?? Configuration:"
echo "1. Copy .env.example to .env if not already done"
echo "2. Update database credentials in .env file"
echo "3. Make sure MySQL service is running"

echo ""
echo "?? To start the application:"
echo "npm start"

echo ""
echo "?? Available scripts:"
echo "npm start       - Start production server"
echo "npm run dev     - Start development server with nodemon"

echo ""
echo "?? Application will be available at: http://localhost:3000"