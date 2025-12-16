-- Створення бази даних та налаштування
-- Запустіть цей скрипт як root користувач MySQL

-- Створення користувача та бази даних (якщо потрібно)
CREATE USER IF NOT EXISTS 'food_user'@'localhost' IDENTIFIED BY 'food_password';
CREATE DATABASE IF NOT EXISTS food_delivery CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
GRANT ALL PRIVILEGES ON food_delivery.* TO 'food_user'@'localhost';
FLUSH PRIVILEGES;

-- Або просто створення бази даних для root користувача
CREATE DATABASE IF NOT EXISTS food_delivery CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE food_delivery;
SHOW TABLES;