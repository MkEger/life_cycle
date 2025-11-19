CREATE DATABASE IF NOT EXISTS food_delivery CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE food_delivery;

CREATE TABLE users (
                       id INT PRIMARY KEY AUTO_INCREMENT,
                       email VARCHAR(255) UNIQUE NOT NULL,
                       phone VARCHAR(20) UNIQUE,
                       password VARCHAR(255) NOT NULL,
                       name VARCHAR(100) NOT NULL,
                       role ENUM('user', 'admin', 'restaurant') DEFAULT 'user',
                       address TEXT,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       INDEX idx_email (email),
                       INDEX idx_phone (phone)
);

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

CREATE TABLE categories (
                            id INT PRIMARY KEY AUTO_INCREMENT,
                            name VARCHAR(50) NOT NULL,
                            description TEXT
);

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

CREATE TABLE orders (
                        id INT PRIMARY KEY AUTO_INCREMENT,
                        user_id INT NOT NULL,
                        restaurant_id INT NOT NULL,
                        total_price DECIMAL(10,2) NOT NULL,
                        status ENUM('pending', 'confirmed', 'preparing', 'delivering', 'delivered', 'cancelled') DEFAULT 'pending',
                        payment_method VARCHAR(50) NOT NULL,
                        payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
                        delivery_address TEXT NOT NULL,
                        comment TEXT,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                        FOREIGN KEY (user_id) REFERENCES users(id),
                        FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
                        INDEX idx_user (user_id),
                        INDEX idx_status (status),
                        INDEX idx_created (created_at)
);

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

CREATE TABLE reviews (
                         id INT PRIMARY KEY AUTO_INCREMENT,
                         user_id INT NOT NULL,
                         menu_item_id INT NOT NULL,
                         order_id INT NOT NULL,
                         rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
                         comment TEXT,
                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         FOREIGN KEY (user_id) REFERENCES users(id),
                         FOREIGN KEY (menu_item_id) REFERENCES menu_items(id),
                         FOREIGN KEY (order_id) REFERENCES orders(id)
);

INSERT INTO categories (name, description) VALUES
                                               ('Перші страви', 'Супи та бульйони'),
                                               ('Другі страви', 'Основні гарячі страви'),
                                               ('Салати', 'Свіжі та класичні салати'),
                                               ('Десерти', 'Солодощі та випічка'),
                                               ('Напої', 'Гарячі та холодні напої');

INSERT INTO restaurants (name, description, address, phone, rating) VALUES
                                                                        ('Смачна Їжа', 'Традиційна українська кухня', 'вул. Хрещатик 1, Київ', '+380441234567', 4.5),
                                                                        ('Піца Маестро', 'Італійська піца та паста', 'вул. Саксаганського 10, Київ', '+380442345678', 4.7),
                                                                        ('Суші Бар', 'Японська кухня', 'вул. Басейна 2, Київ', '+380443456789', 4.8);


INSERT INTO users (email, phone, password, name, role) VALUES
    ('admin@fooddelivery.com', '+380501111111', '$2a$10$YourHashedPasswordHere', 'Адміністратор', 'admin');
