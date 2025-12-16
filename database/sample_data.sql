-- Sample data for food delivery system

USE food_delivery;

-- Add sample menu items for the restaurants
INSERT INTO menu_items (restaurant_id, category_id, name, description, price, image_url, is_available, rating) VALUES
-- Pizza (category_id = 2)
(1, 2, 'Margherita Pizza', 'Класична італійська піца з моцарелою, томатами та базиліком', 12.99, 'margherita.jpg', true, 4.5),
(1, 2, 'Pepperoni Pizza', 'Піца з пепероні та сиром моцарела', 15.99, 'pepperoni.jpg', true, 4.7),
(1, 2, 'Hawaiian Pizza', 'Піца з шинкою, ананасами та сиром', 14.99, 'hawaiian.jpg', true, 4.2),
(1, 2, 'Four Cheese Pizza', 'Піца з чотирма видами сиру', 16.99, 'four-cheese.jpg', true, 4.6),
(1, 2, 'Meat Lovers Pizza', 'Піца з різними видами м\'яса', 18.99, 'meat.jpg', true, 4.8),

-- Desserts (category_id = 4)  
(1, 4, 'Tiramisu', 'Класичний італійський десерт тірамісу', 6.99, 'tiramisu.jpg', true, 4.9),
(1, 4, 'Panna Cotta', 'Ніжний італійський десерт панна-котта', 5.99, 'panna-cotta.jpg', true, 4.7),

-- Drinks (category_id = 5)
(1, 5, 'Coca-Cola', 'Класична кока-кола 0.33л', 2.99, 'cola.jpg', true, 4.3),
(1, 5, 'Fanta Orange', 'Фанта апельсинова 0.33л', 2.99, 'fanta.jpg', true, 4.1),
(1, 5, 'Sprite', 'Спрайт 0.33л', 2.99, 'sprite.jpg', true, 4.2),
(1, 5, 'Fresh Orange Juice', 'Свіжовичавлений апельсиновий сік', 4.99, 'orange-juice.jpg', true, 4.8);

-- Create admin user with proper password hash
UPDATE users SET password = '$2a$10$YbE8k/WmAF5Xw3UHhVEJI.2K/zqv6J5hLmU6oZE3lNtE8GQ9FHHFW' WHERE email = 'admin@fooddelivery.com';

-- Add a test user
INSERT INTO users (email, phone, password, name, role) VALUES
('test@example.com', '+380501234567', '$2a$10$YbE8k/WmAF5Xw3UHhVEJI.2K/zqv6J5hLmU6oZE3lNtE8GQ9FHHFW', 'Test User', 'user');

-- Update payment methods to match expected codes
UPDATE payment_methods SET code = 'card' WHERE name = 'Банківська картка';
UPDATE payment_methods SET code = 'cash' WHERE name = 'Готівка при доставці';

COMMIT;