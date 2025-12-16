-- Додаткові тестові дані для Food Delivery
USE food_delivery;

-- Додаємо більше тестових користувачів (пароль для всіх: test123)
INSERT INTO users (email, phone, password, name, role) VALUES
('john.doe@email.com', '+380501111001', '$2a$10$YbE8k/WmAF5Xw3UHhVEJI.2K/zqv6J5hLmU6oZE3lNtE8GQ9FHHFW', 'Джон Доу', 'user'),
('jane.smith@email.com', '+380501111002', '$2a$10$YbE8k/WmAF5Xw3UHhVEJI.2K/zqv6J5hLmU6oZE3lNtE8GQ9FHHFW', 'Джейн Сміт', 'user'),
('mike.brown@email.com', '+380501111003', '$2a$10$YbE8k/WmAF5Xw3UHhVEJI.2K/zqv6J5hLmU6oZE3lNtE8GQ9FHHFW', 'Майк Браун', 'user'),
('courier1@delivery.com', '+380501111004', '$2a$10$YbE8k/WmAF5Xw3UHhVEJI.2K/zqv6J5hLmU6oZE3lNtE8GQ9FHHFW', 'Кур\'єр Олексій', 'courier'),
('courier2@delivery.com', '+380501111005', '$2a$10$YbE8k/WmAF5Xw3UHhVEJI.2K/zqv6J5hLmU6oZE3lNtE8GQ9FHHFW', 'Кур\'єр Марія', 'courier'),
('manager@restaurant.com', '+380501111006', '$2a$10$YbE8k/WmAF5Xw3UHhVEJI.2K/zqv6J5hLmU6oZE3lNtE8GQ9FHHFW', 'Менеджер Ресторану', 'restaurant');

-- Додаємо ще ресторани
INSERT INTO restaurants (name, description, address, phone, rating) VALUES
('Суші Майстер', 'Автентична японська кухня', 'вул. Басейна 5, Київ', '+380442345678', 4.7),
('Burger House', 'Найкращі бургери в місті', 'пр. Перемоги 25, Київ', '+380443456789', 4.4),
('Італійський дворик', 'Справжня італійська кухня', 'вул. Володимирська 15, Київ', '+380444567890', 4.8);

-- Додаємо страви для нових ресторанів
-- Суші Майстер (restaurant_id = 2)
INSERT INTO menu_items (restaurant_id, category_id, name, description, price, image_url, is_available, rating) VALUES
(2, 2, 'Філадельфія', 'Рол з лососем, огірком та крем-сиром', 8.99, 'philadelphia.jpg', true, 4.8),
(2, 2, 'Каліфорнія', 'Рол з крабом, огірком та авокадо', 7.99, 'california.jpg', true, 4.6),
(2, 2, 'Унагі рол', 'Рол з копченим вугрем', 9.99, 'unagi.jpg', true, 4.7),
(2, 3, 'Салат чука', 'Салат з морських водоростей', 4.99, 'chuka.jpg', true, 4.5),
(2, 5, 'Зелений чай', 'Традиційний японський чай', 2.99, 'green-tea.jpg', true, 4.3);

-- Burger House (restaurant_id = 3)
INSERT INTO menu_items (restaurant_id, category_id, name, description, price, image_url, is_available, rating) VALUES
(3, 2, 'Класік Бургер', 'Яловичина, сир, салат, помідор', 6.99, 'classic-burger.jpg', true, 4.5),
(3, 2, 'Чізбургер', 'Подвійний сир, яловичина, соус', 8.99, 'cheeseburger.jpg', true, 4.6),
(3, 2, 'Чікен Бургер', 'Куряча котлета, соус барбекю', 7.99, 'chicken-burger.jpg', true, 4.4),
(3, 3, 'Картопля фрі', 'Хрустка картопля фрі', 3.99, 'fries.jpg', true, 4.2),
(3, 5, 'Мілкшейк', 'Ванільний мілкшейк', 4.99, 'milkshake.jpg', true, 4.7);

-- Італійський дворик (restaurant_id = 4)
INSERT INTO menu_items (restaurant_id, category_id, name, description, price, image_url, is_available, rating) VALUES
(4, 2, 'Паста Карбонара', 'Спагеті з беконом та вершками', 11.99, 'carbonara.jpg', true, 4.9),
(4, 2, 'Лазанья', 'Класична м\'ясна лазанья', 13.99, 'lasagna.jpg', true, 4.8),
(4, 2, 'Різотто з грибами', 'Кремове різотто з білими грибами', 12.99, 'risotto.jpg', true, 4.7),
(4, 3, 'Салат Капрезе', 'Моцарела, томати, базилік', 7.99, 'caprese.jpg', true, 4.6),
(4, 4, 'Канноли', 'Сицилійський десерт з рикоттою', 5.99, 'cannoli.jpg', true, 4.8);

-- Додаємо тестові замовлення
INSERT INTO orders (user_id, restaurant_id, delivery_address, total_price, payment_method_id, status) VALUES
(2, 1, 'Клієнт: Джон Доу\nТелефон: +380501111001\nАдреса: вул. Шевченка 10, Київ, 01001, Україна', 29.97, 1, 'delivered'),
(3, 2, 'Клієнт: Джейн Сміт\nТелефон: +380501111002\nАдреса: пр. Незалежності 5, Київ, 01002, Україна', 18.97, 4, 'pending'),
(4, 3, 'Клієнт: Майк Браун\nТелефон: +380501111003\nАдреса: вул. Хрещатик 25, Київ, 01003, Україна', 15.98, 1, 'preparing');

-- Додаємо елементи замовлень
INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES
-- Замовлення 1 (Джон Доу)
(1, 1, 1, 12.99), -- Маргарита
(1, 2, 1, 15.99), -- Пепероні
(1, 11, 1, 2.99), -- Кока-Кола

-- Замовлення 2 (Джейн Сміт)
(2, 6, 2, 8.99), -- Філадельфія x2
(2, 7, 1, 7.99), -- Каліфорнія

-- Замовлення 3 (Майк Браун)
(3, 11, 1, 6.99), -- Класік Бургер
(3, 14, 1, 3.99), -- Картопля фрі
(3, 15, 1, 4.99); -- Мілкшейк

COMMIT;

-- Показуємо статистику
SELECT 'Створено тестові дані!' as message;
SELECT CONCAT('Користувачів: ', COUNT(*)) as count FROM users;
SELECT CONCAT('Ресторанів: ', COUNT(*)) as count FROM restaurants;
SELECT CONCAT('Страв: ', COUNT(*)) as count FROM menu_items;
SELECT CONCAT('Замовлень: ', COUNT(*)) as count FROM orders;