-- Швидке налаштування бази даних для Food Delivery
-- Виконайте цей скрипт: mysql -u root -p < database/quick_setup.sql

-- Створюємо базу даних
DROP DATABASE IF EXISTS food_delivery;
CREATE DATABASE food_delivery CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE food_delivery;

-- Таблиця користувачів
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role ENUM('user', 'admin', 'restaurant', 'courier') DEFAULT 'user',
    address TEXT,
    is_blocked BOOLEAN DEFAULT false,
    blocked_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_phone (phone)
);

-- Таблиця ресторанів
CREATE TABLE restaurants (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    address VARCHAR(255),
    phone VARCHAR(20),
    rating DECIMAL(3,2) DEFAULT 0.00,
    image_url VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_rating (rating)
);

-- Таблиця категорій
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    description TEXT
);

-- Таблиця способів оплати
CREATE TABLE payment_methods (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    code VARCHAR(20) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблиця страв меню
CREATE TABLE menu_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    restaurant_id INT NOT NULL,
    category_id INT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(255),
    is_available BOOLEAN DEFAULT true,
    rating DECIMAL(3,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_restaurant (restaurant_id),
    INDEX idx_category (category_id),
    INDEX idx_price (price),
    INDEX idx_rating (rating)
);

-- Таблиця замовлень
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    restaurant_id INT NOT NULL,
    courier_id INT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'confirmed', 'preparing', 'delivering', 'delivered', 'cancelled') DEFAULT 'pending',
    payment_method_id INT NOT NULL,
    payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
    delivery_address TEXT NOT NULL,
    comment TEXT,
    estimated_delivery_time TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
    FOREIGN KEY (courier_id) REFERENCES users(id),
    FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id),
    INDEX idx_user (user_id),
    INDEX idx_courier (courier_id),
    INDEX idx_status (status),
    INDEX idx_created (created_at)
);

-- Таблиця елементів замовлення
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    menu_item_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    options TEXT,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);

-- Заповнюємо тестові дані
INSERT INTO categories (name, description) VALUES
('Супи', 'Супи та бульйони'),
('Піца', 'Піца різних видів'),
('Салати', 'Свіжі та класичні салати'),
('Десерти', 'Солодощі та випічка'),
('Напої', 'Гарячі та холодні напої');

INSERT INTO payment_methods (name, code, is_active) VALUES
('Банківська картка', 'card', true),
('Apple Pay', 'apple_pay', true),
('Google Pay', 'google_pay', true),
('Готівка при доставці', 'cash', true);

INSERT INTO restaurants (name, description, address, phone, rating) VALUES
('Смачна Піцерія', 'Найкраща піца в місті', 'вул. Хрещатик 1, Київ', '+380441234567', 4.5);

-- Додаємо меню
INSERT INTO menu_items (restaurant_id, category_id, name, description, price, image_url, is_available, rating) VALUES
-- Піца
(1, 2, 'Маргарита', 'Класична італійська піца з моцарелою, томатами та базиліком', 12.99, 'margherita.jpg', true, 4.5),
(1, 2, 'Пепероні', 'Піца з пепероні та сиром моцарела', 15.99, 'pepperoni.jpg', true, 4.7),
(1, 2, 'Гавайська', 'Піца з шинкою, ананасами та сиром', 14.99, 'hawaiian.jpg', true, 4.2),
(1, 2, 'Чотири сири', 'Піца з чотирма видами сиру', 16.99, 'four-cheese.jpg', true, 4.6),
(1, 2, 'М\'ясна', 'Піца з різними видами м\'яса', 18.99, 'meat.jpg', true, 4.8),

-- Десерти
(1, 4, 'Тірамісу', 'Класичний італійський десерт тірамісу', 6.99, 'tiramisu.jpg', true, 4.9),
(1, 4, 'Панна-котта', 'Ніжний італійський десерт панна-котта', 5.99, 'panna-cotta.jpg', true, 4.7),

-- Напої
(1, 5, 'Кока-Кола', 'Класична кока-кола 0.33л', 2.99, 'cola.jpg', true, 4.3),
(1, 5, 'Фанта', 'Фанта апельсинова 0.33л', 2.99, 'fanta.jpg', true, 4.1),
(1, 5, 'Спрайт', 'Спрайт 0.33л', 2.99, 'sprite.jpg', true, 4.2),
(1, 5, 'Апельсиновий сік', 'Свіжовичавлений апельсиновий сік', 4.99, 'orange-juice.jpg', true, 4.8);

-- Створюємо тестових користувачів
INSERT INTO users (email, phone, password, name, role) VALUES
('admin@fooddelivery.com', '+380501111111', '$2a$10$YbE8k/WmAF5Xw3UHhVEJI.2K/zqv6J5hLmU6oZE3lNtE8GQ9FHHFW', 'Адміністратор', 'admin'),
('test@example.com', '+380501234567', '$2a$10$YbE8k/WmAF5Xw3UHhVEJI.2K/zqv6J5hLmU6oZE3lNtE8GQ9FHHFW', 'Тестовий користувач', 'user');

COMMIT;

SELECT 'База даних налаштована успішно!' as message;
SELECT CONCAT('Користувачів: ', COUNT(*)) as users FROM users;
SELECT CONCAT('Страв: ', COUNT(*)) as menu_items FROM menu_items;
SELECT CONCAT('Категорій: ', COUNT(*)) as categories FROM categories;