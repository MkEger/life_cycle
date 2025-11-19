#!/bin/bash

# Manual API Test Script for Food Delivery Backend
# This script tests basic API endpoints to ensure they are working

BASE_URL="http://localhost:3000/api"
TOKEN=""

echo "==================================="
echo "Food Delivery API Test Suite"
echo "==================================="
echo ""
echo "Make sure the server is running on port 3000"
echo "Press Enter to continue..."
read

echo ""
echo "Test 1: Check server is running"
echo "--------------------------------"
curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/../" || echo "Server not responding"
echo ""

echo ""
echo "Test 2: Get Categories"
echo "----------------------"
curl -s "$BASE_URL/categories" | json_pp || curl -s "$BASE_URL/categories"
echo ""

echo ""
echo "Test 3: Get Restaurants"
echo "-----------------------"
curl -s "$BASE_URL/restaurants" | json_pp || curl -s "$BASE_URL/restaurants"
echo ""

echo ""
echo "Test 4: Get Payment Methods"
echo "----------------------------"
curl -s "$BASE_URL/payment-methods" | json_pp || curl -s "$BASE_URL/payment-methods"
echo ""

echo ""
echo "Test 5: Register New User"
echo "-------------------------"
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "phone": "+380501111111",
    "password": "testpass123",
    "name": "Test User"
  }')
echo "$REGISTER_RESPONSE" | json_pp || echo "$REGISTER_RESPONSE"
echo ""

echo ""
echo "Test 6: Login"
echo "-------------"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "testpass123"
  }')
echo "$LOGIN_RESPONSE" | json_pp || echo "$LOGIN_RESPONSE"

# Extract token (requires jq, otherwise manual)
if command -v jq &> /dev/null; then
    TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token')
    echo ""
    echo "Token extracted: ${TOKEN:0:20}..."
fi
echo ""

if [ -n "$TOKEN" ]; then
    echo ""
    echo "Test 7: Get Cart (Authenticated)"
    echo "--------------------------------"
    curl -s "$BASE_URL/cart" \
      -H "Authorization: Bearer $TOKEN" | json_pp || curl -s "$BASE_URL/cart" -H "Authorization: Bearer $TOKEN"
    echo ""

    echo ""
    echo "Test 8: Get Order History (Authenticated)"
    echo "-----------------------------------------"
    curl -s "$BASE_URL/orders" \
      -H "Authorization: Bearer $TOKEN" | json_pp || curl -s "$BASE_URL/orders" -H "Authorization: Bearer $TOKEN"
    echo ""
else
    echo ""
    echo "⚠️  Could not extract token. Skipping authenticated tests."
    echo "Install 'jq' for automatic token extraction: sudo apt-get install jq"
    echo ""
fi

echo ""
echo "==================================="
echo "Test Suite Complete"
echo "==================================="
echo ""
echo "Note: Some tests may fail if database is not set up."
echo "To set up database: mysql -u root -p < database/schema.sql"
echo ""
