# API Documentation - Food Delivery Backend

## Base URL
`http://localhost:3000/api`

## Authentication
Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## 1. Authentication Endpoints

### 1.1 Register User
**POST** `/auth/register`

**Body:**
```json
{
  "email": "user@example.com",
  "phone": "+380501234567",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "message": "Користувач зареєстрований успішно",
  "userId": 1
}
```

### 1.2 Login with Email
**POST** `/auth/login`

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

### 1.3 Login with Phone
**POST** `/auth/login-phone`

**Body:**
```json
{
  "phone": "+380501234567",
  "otp": "123456"
}
```

### 1.4 Social Login
**POST** `/auth/social-login`

**Body:**
```json
{
  "provider": "google",
  "token": "social_token",
  "email": "user@example.com",
  "name": "John Doe"
}
```

---

## 2. Categories & Restaurants

### 2.1 Get All Categories
**GET** `/categories`

**Response:**
```json
[
  {
    "id": 1,
    "name": "Перші страви",
    "description": "Супи та бульйони"
  }
]
```

### 2.2 Get All Restaurants
**GET** `/restaurants`

**Response:**
```json
[
  {
    "id": 1,
    "name": "Смачна Їжа",
    "description": "Традиційна українська кухня",
    "address": "вул. Хрещатик 1, Київ",
    "phone": "+380441234567",
    "rating": 4.5,
    "image_url": "url",
    "is_active": true
  }
]
```

### 2.3 Get Restaurant Menu
**GET** `/restaurants/:id/menu?category=1&minPrice=10&maxPrice=100&search=pizza&minRating=4`

**Query Parameters:**
- `category` - Filter by category ID
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `search` - Search by name
- `minRating` - Minimum rating

### 2.4 Get Menu Items
**GET** `/menu-items?restaurantId=1&categoryId=2`

---

## 3. Cart Management (Requires Authentication)

### 3.1 Get Cart
**GET** `/cart`

**Response:**
```json
{
  "cartId": 1,
  "items": [
    {
      "id": 1,
      "quantity": 2,
      "menu_item_id": 5,
      "name": "Pizza Margherita",
      "price": 120.00,
      "restaurant_name": "Піца Маестро"
    }
  ],
  "total": 240.00
}
```

### 3.2 Add Item to Cart
**POST** `/cart/items`

**Body:**
```json
{
  "menuItemId": 5,
  "quantity": 2
}
```

### 3.3 Update Cart Item Quantity
**PATCH** `/cart/items/:id`

**Body:**
```json
{
  "quantity": 3
}
```

### 3.4 Remove Item from Cart
**DELETE** `/cart/items/:id`

### 3.5 Clear Cart
**DELETE** `/cart`

---

## 4. Orders (Requires Authentication)

### 4.1 Create Order
**POST** `/orders`

**Body:**
```json
{
  "user_id": 1,
  "customer_name": "John Doe",
  "phone": "+380501234567",
  "address": "вул. Хрещатик 1",
  "city": "Київ",
  "state": "Київська область",
  "zip": "01001",
  "country": "Україна",
  "delivery_notes": "Додаткові примітки",
  "payment_method": "card",
  "items": [
    {
      "id": 5,
      "quantity": 2,
      "price": 120.00
    }
  ],
  "total": 240.00
}
```

### 4.2 Get User Order History
**GET** `/orders`

### 4.3 Get Order Details
**GET** `/orders/:id`

### 4.4 Get Order Details (Public)
**GET** `/orders/:id/details`

### 4.5 Cancel Order
**PATCH** `/orders/:id/cancel`

### 4.6 Process Payment
**POST** `/orders/:id/payment`

**Body:**
```json
{
  "paymentMethodId": 1,
  "paymentDetails": {
    "cardNumber": "4111111111111111",
    "expiryDate": "12/25",
    "cvv": "123"
  }
}
```

---

## 5. Reviews & Ratings (Requires Authentication)

### 5.1 Create Review
**POST** `/reviews`

**Body:**
```json
{
  "orderId": 1,
  "menuItemId": 5,
  "restaurantId": 1,
  "rating": 5,
  "comment": "Дуже смачно!"
}
```

### 5.2 Get Menu Item Reviews
**GET** `/menu-items/:id/reviews`

### 5.3 Get Restaurant Reviews
**GET** `/restaurants/:id/reviews`

---

## 6. Admin - Orders (Requires Admin Role)

### 6.1 Get All Orders
**GET** `/admin/orders`

### 6.2 Update Order Status
**PATCH** `/admin/orders/:id/status`

**Body:**
```json
{
  "status": "preparing"
}
```

**Possible statuses:** `pending`, `confirmed`, `preparing`, `delivering`, `delivered`, `cancelled`

### 6.3 Get Statistics
**GET** `/admin/statistics`

**Response:**
```json
{
  "totalOrders": 150,
  "totalRevenue": 15000.00,
  "ordersByStatus": [
    { "status": "pending", "count": 10 },
    { "status": "delivered", "count": 120 }
  ],
  "recentOrders": []
}
```

---

## 7. Admin - Menu Management (Requires Admin Role)

### 7.1 Restaurant Management

**Create Restaurant**
**POST** `/admin/restaurants`

**Body:**
```json
{
  "name": "Новий Ресторан",
  "description": "Опис",
  "address": "Адреса",
  "phone": "+380441234567",
  "image_url": "url"
}
```

**Update Restaurant**
**PUT** `/admin/restaurants/:id`

**Delete Restaurant**
**DELETE** `/admin/restaurants/:id`

### 7.2 Menu Item Management

**Create Menu Item**
**POST** `/admin/menu-items`

**Body:**
```json
{
  "restaurant_id": 1,
  "category_id": 2,
  "name": "Нова страва",
  "description": "Опис",
  "price": 150.00,
  "image_url": "url"
}
```

**Update Menu Item**
**PUT** `/admin/menu-items/:id`

**Delete Menu Item**
**DELETE** `/admin/menu-items/:id`

### 7.3 Category Management

**Create Category**
**POST** `/admin/categories`

**Body:**
```json
{
  "name": "Нова категорія",
  "description": "Опис"
}
```

**Update Category**
**PUT** `/admin/categories/:id`

**Delete Category**
**DELETE** `/admin/categories/:id`

---

## 8. Admin - User Management (Requires Admin Role)

### 8.1 Get All Users
**GET** `/admin/users`

### 8.2 Block/Unblock User
**PATCH** `/admin/users/:id/block`

**Body:**
```json
{
  "is_blocked": true
}
```

### 8.3 Change User Role
**PATCH** `/admin/users/:id/role`

**Body:**
```json
{
  "role": "courier"
}
```

**Possible roles:** `user`, `admin`, `restaurant`, `courier`

---

## 9. Courier Endpoints (Requires Courier Role)

### 9.1 Get Available Orders
**GET** `/courier/available-orders`

**Response:**
```json
[
  {
    "id": 1,
    "total_price": 240.00,
    "status": "confirmed",
    "delivery_address": "адреса",
    "restaurant_name": "Смачна Їжа",
    "restaurant_address": "адреса ресторану"
  }
]
```

### 9.2 Accept Order
**POST** `/courier/orders/:id/accept`

### 9.3 Get My Assigned Orders
**GET** `/courier/my-orders`

### 9.4 Update Delivery Status
**PATCH** `/courier/orders/:id/status`

**Body:**
```json
{
  "status": "delivering"
}
```

---

## 10. Utility Endpoints

### 10.1 Get Payment Methods
**GET** `/payment-methods`

**Response:**
```json
[
  {
    "id": 1,
    "name": "Банківська картка",
    "code": "card"
  },
  {
    "id": 2,
    "name": "Apple Pay",
    "code": "apple_pay"
  }
]
```

---

## Error Responses

All endpoints may return the following error responses:

**400 Bad Request**
```json
{
  "error": "Error message"
}
```

**401 Unauthorized**
```json
{
  "error": "Доступ заборонено"
}
```

**403 Forbidden**
```json
{
  "error": "Недійсний токен"
}
```

**404 Not Found**
```json
{
  "error": "Resource not found"
}
```

**500 Internal Server Error**
```json
{
  "error": "Internal server error message"
}
```
