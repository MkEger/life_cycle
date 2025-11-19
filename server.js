const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// База даних
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'food_delivery',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Middleware для перевірки токену
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Доступ заборонено' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Недійсний токен' });
        }
        req.user = user;
        next();
    });
};

// Middleware для перевірки ролі адміністратора
const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Доступ тільки для адміністраторів' });
    }
    next();
};

// Middleware для перевірки ролі кур'єра
const requireCourier = (req, res, next) => {
    if (req.user.role !== 'courier' && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Доступ тільки для кур\'єрів' });
    }
    next();
};

// F1: Реєстрація
app.post('/api/auth/register', async (req, res) => {
    const { email, phone, password, name } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.execute(
            'INSERT INTO users (email, phone, password, name) VALUES (?, ?, ?, ?)',
            [email, phone || null, hashedPassword, name]
        );

        res.status(201).json({
            message: 'Користувач зареєстрований успішно',
            userId: result.insertId
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ error: 'Email або телефон вже використовується' });
        } else {
            res.status(500).json({ error: 'Помилка реєстрації' });
        }
    }
});

// F1: Вхід
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const [users] = await pool.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({ error: 'Невірний email або пароль' });
        }

        const user = users[0];
        
        // Check if user is blocked
        if (user.is_blocked) {
            return res.status(403).json({ error: 'Ваш акаунт заблоковано' });
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            return res.status(401).json({ error: 'Невірний email або пароль' });
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Помилка входу' });
    }
});

// F1: Phone login (placeholder for OTP integration)
app.post('/api/auth/login-phone', async (req, res) => {
    const { phone, otp } = req.body;
    
    try {
        // In production, verify OTP here
        // For now, simple phone-based login
        const [users] = await pool.execute(
            'SELECT * FROM users WHERE phone = ?',
            [phone]
        );

        if (users.length === 0) {
            return res.status(401).json({ error: 'Користувача не знайдено' });
        }

        const user = users[0];
        
        if (user.is_blocked) {
            return res.status(403).json({ error: 'Ваш акаунт заблоковано' });
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Помилка входу через телефон' });
    }
});

// F1: Social login (placeholder for OAuth integration)
app.post('/api/auth/social-login', async (req, res) => {
    const { provider, token: socialToken, email, name } = req.body;
    
    try {
        // In production, verify social token with provider
        // For now, simple email-based registration/login
        
        let [users] = await pool.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        let user;
        if (users.length === 0) {
            // Create new user
            const tempPassword = await bcrypt.hash(Math.random().toString(36), 10);
            const [result] = await pool.execute(
                'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
                [email, tempPassword, name]
            );
            
            user = { id: result.insertId, email, name, role: 'user' };
        } else {
            user = users[0];
            
            if (user.is_blocked) {
                return res.status(403).json({ error: 'Ваш акаунт заблоковано' });
            }
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Помилка соціального входу' });
    }
});

// F2: Get all categories
app.get('/api/categories', async (req, res) => {
    try {
        const [categories] = await pool.execute(
            'SELECT * FROM categories ORDER BY name'
        );
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Помилка отримання категорій' });
    }
});

// F2: Отримати всі ресторани
app.get('/api/restaurants', async (req, res) => {
    try {
        const [restaurants] = await pool.execute(
            'SELECT * FROM restaurants WHERE is_active = true ORDER BY rating DESC'
        );
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ error: 'Помилка отримання ресторанів' });
    }
});

// Отримати меню-айтеми
app.get('/api/menu-items', async (req, res) => {
    const { restaurantId, categoryId } = req.query;

    let query = `
        SELECT m.*, c.name as category_name
        FROM menu_items m
        LEFT JOIN categories c ON m.category_id = c.id
        WHERE m.is_available = 1
    `;
    const params = [];

    if (restaurantId) {
        query += ' AND m.restaurant_id = ?';
        params.push(restaurantId);
    }

    if (categoryId) {
        query += ' AND m.category_id = ?';
        params.push(categoryId);
    }

    query += ' ORDER BY m.category_id, m.name';

    try {
        const [items] = await pool.execute(query, params);
        console.log('✅ Завантажено страв:', items.length);
        res.json(items);
    } catch (error) {
        console.error('❌ Помилка БД:', error);
        res.status(500).json({ error: 'Помилка отримання страв' });
    }
});

// Меню ресторану
app.get('/api/restaurants/:id/menu', async (req, res) => {
    const { id } = req.params;
    const { category, minPrice, maxPrice, search, minRating } = req.query;

    let query = `
        SELECT m.*, c.name as category_name
        FROM menu_items m
        LEFT JOIN categories c ON m.category_id = c.id
        WHERE m.restaurant_id = ? AND m.is_available = true
    `;
    const params = [id];

    if (category) {
        query += ' AND m.category_id = ?';
        params.push(category);
    }
    if (minPrice) {
        query += ' AND m.price >= ?';
        params.push(minPrice);
    }
    if (maxPrice) {
        query += ' AND m.price <= ?';
        params.push(maxPrice);
    }
    if (search) {
        query += ' AND m.name LIKE ?';
        params.push(`%${search}%`);
    }
    if (minRating) {
        query += ' AND m.rating >= ?';
        params.push(minRating);
    }

    query += ' ORDER BY m.rating DESC';

    try {
        const [items] = await pool.execute(query, params);
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: 'Помилка отримання меню' });
    }
});

// F3: Cart Management - Get user cart
app.get('/api/cart', authenticateToken, async (req, res) => {
    try {
        // Get or create cart for user
        let [carts] = await pool.execute(
            'SELECT id FROM carts WHERE user_id = ?',
            [req.user.userId]
        );

        let cartId;
        if (carts.length === 0) {
            const [result] = await pool.execute(
                'INSERT INTO carts (user_id) VALUES (?)',
                [req.user.userId]
            );
            cartId = result.insertId;
        } else {
            cartId = carts[0].id;
        }

        // Get cart items
        const [items] = await pool.execute(`
            SELECT ci.id, ci.quantity, mi.id as menu_item_id, mi.name, mi.price, 
                   mi.image_url, mi.description, r.name as restaurant_name, r.id as restaurant_id
            FROM cart_items ci
            JOIN menu_items mi ON ci.menu_item_id = mi.id
            JOIN restaurants r ON mi.restaurant_id = r.id
            WHERE ci.cart_id = ?
        `, [cartId]);

        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        res.json({ cartId, items, total });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ error: 'Помилка отримання кошика' });
    }
});

// F3: Add item to cart
app.post('/api/cart/items', authenticateToken, async (req, res) => {
    const { menuItemId, quantity } = req.body;

    try {
        // Get or create cart
        let [carts] = await pool.execute(
            'SELECT id FROM carts WHERE user_id = ?',
            [req.user.userId]
        );

        let cartId;
        if (carts.length === 0) {
            const [result] = await pool.execute(
                'INSERT INTO carts (user_id) VALUES (?)',
                [req.user.userId]
            );
            cartId = result.insertId;
        } else {
            cartId = carts[0].id;
        }

        // Check if item already in cart
        const [existing] = await pool.execute(
            'SELECT id, quantity FROM cart_items WHERE cart_id = ? AND menu_item_id = ?',
            [cartId, menuItemId]
        );

        if (existing.length > 0) {
            // Update quantity
            await pool.execute(
                'UPDATE cart_items SET quantity = quantity + ? WHERE id = ?',
                [quantity || 1, existing[0].id]
            );
        } else {
            // Add new item
            await pool.execute(
                'INSERT INTO cart_items (cart_id, menu_item_id, quantity) VALUES (?, ?, ?)',
                [cartId, menuItemId, quantity || 1]
            );
        }

        res.json({ message: 'Додано до кошика' });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ error: 'Помилка додавання до кошика' });
    }
});

// F3: Update cart item quantity
app.patch('/api/cart/items/:id', authenticateToken, async (req, res) => {
    const { quantity } = req.body;

    try {
        await pool.execute(
            'UPDATE cart_items SET quantity = ? WHERE id = ?',
            [quantity, req.params.id]
        );
        res.json({ message: 'Кількість оновлено' });
    } catch (error) {
        res.status(500).json({ error: 'Помилка оновлення кількості' });
    }
});

// F3: Remove item from cart
app.delete('/api/cart/items/:id', authenticateToken, async (req, res) => {
    try {
        await pool.execute(
            'DELETE FROM cart_items WHERE id = ?',
            [req.params.id]
        );
        res.json({ message: 'Видалено з кошика' });
    } catch (error) {
        res.status(500).json({ error: 'Помилка видалення з кошика' });
    }
});

// F3: Clear cart
app.delete('/api/cart', authenticateToken, async (req, res) => {
    try {
        const [carts] = await pool.execute(
            'SELECT id FROM carts WHERE user_id = ?',
            [req.user.userId]
        );

        if (carts.length > 0) {
            await pool.execute(
                'DELETE FROM cart_items WHERE cart_id = ?',
                [carts[0].id]
            );
        }

        res.json({ message: 'Кошик очищено' });
    } catch (error) {
        res.status(500).json({ error: 'Помилка очищення кошика' });
    }
});

// F3: Створити замовлення
// Створення замовлення
app.post('/api/orders', async (req, res) => {
    const { user_id, customer_name, phone, address, city, state, zip, country, delivery_notes, payment_method, items, total } = req.body;

    try {
        // ✅ Перетворюємо 'credit' / 'debit' / 'paypal' / 'cash' → 1/2/3/4
        const paymentMethodMap = {
            'credit': 1,
            'debit': 2,
            'paypal': 3,
            'cash': 4
        };

        const paymentMethodId = paymentMethodMap[payment_method] || 4;

        // 1️⃣ Створюємо замовлення
        const [orderResult] = await pool.query(
            `INSERT INTO orders (user_id, restaurant_id, delivery_address, total_price, payment_method_id, status)
             VALUES (?, 1, ?, ?, ?, 'pending')`,
            [
                user_id || null,
                `Клієнт: ${customer_name}\nТелефон: ${phone}\nАдреса: ${address}, ${city}, ${state}, ${zip}, ${country}${delivery_notes ? '\nПримітки: ' + delivery_notes : ''}`,
                total,
                paymentMethodId // ✅ Зберігаємо ID (1/2/3/4)
            ]
        );

        const orderId = orderResult.insertId;

        // 2️⃣ Додаємо страви до замовлення
        const orderItemsPromises = items.map(item => {
            return pool.query(
                'INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES (?, ?, ?, ?)',
                [orderId, item.id, item.quantity, item.price]
            );
        });

        await Promise.all(orderItemsPromises);

        res.json({
            success: true,
            orderId,
            message: 'Замовлення створено!'
        });
    } catch (error) {
        console.error('Помилка створення замовлення:', error);
        res.status(500).json({ error: 'Не вдалося створити замовлення' });
    }
});

// F4: Process payment
app.post('/api/orders/:id/payment', authenticateToken, async (req, res) => {
    const { paymentMethodId, paymentDetails } = req.body;
    
    try {
        // In production, integrate with payment gateway here
        // For now, we'll just update the payment status
        
        await pool.execute(
            'UPDATE orders SET payment_status = ? WHERE id = ? AND user_id = ?',
            ['paid', req.params.id, req.user.userId]
        );
        
        res.json({ 
            message: 'Оплату успішно проведено',
            paymentStatus: 'paid'
        });
    } catch (error) {
        console.error('Payment error:', error);
        res.status(500).json({ error: 'Помилка обробки платежу' });
    }
});

// F3: Get user order history
app.get('/api/orders', authenticateToken, async (req, res) => {
    try {
        const [orders] = await pool.execute(`
            SELECT o.id, o.total_price, o.status, o.payment_status, o.created_at,
                   r.name as restaurant_name
            FROM orders o
            JOIN restaurants r ON o.restaurant_id = r.id
            WHERE o.user_id = ?
            ORDER BY o.created_at DESC
        `, [req.user.userId]);

        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Помилка отримання історії замовлень' });
    }
});

// F3: Cancel order
app.patch('/api/orders/:id/cancel', authenticateToken, async (req, res) => {
    try {
        const [orders] = await pool.execute(
            'SELECT status FROM orders WHERE id = ? AND user_id = ?',
            [req.params.id, req.user.userId]
        );

        if (orders.length === 0) {
            return res.status(404).json({ error: 'Замовлення не знайдено' });
        }

        if (orders[0].status !== 'pending' && orders[0].status !== 'confirmed') {
            return res.status(400).json({ error: 'Неможливо скасувати замовлення в поточному статусі' });
        }

        await pool.execute(
            'UPDATE orders SET status = ? WHERE id = ?',
            ['cancelled', req.params.id]
        );

        res.json({ message: 'Замовлення скасовано' });
    } catch (error) {
        res.status(500).json({ error: 'Помилка скасування замовлення' });
    }
});


// F5: Відстеження замовлення
app.get('/api/orders/:id', authenticateToken, async (req, res) => {
    try {
        const [orders] = await pool.execute(`
            SELECT o.*, r.name as restaurant_name, u.name as user_name
            FROM orders o
            JOIN restaurants r ON o.restaurant_id = r.id
            JOIN users u ON o.user_id = u.id
            WHERE o.id = ? AND (o.user_id = ? OR ? = 'admin')
        `, [req.params.id, req.user.userId, req.user.role]);

        if (orders.length === 0) {
            return res.status(404).json({ error: 'Замовлення не знайдено' });
        }

        const [items] = await pool.execute(`
            SELECT oi.*, mi.name, mi.image_url
            FROM order_items oi
            JOIN menu_items mi ON oi.menu_item_id = mi.id
            WHERE oi.order_id = ?
        `, [req.params.id]);

        res.json({ ...orders[0], items });
    } catch (error) {
        res.status(500).json({ error: 'Помилка отримання замовлення' });
    }
});

// F6: Create review for menu item or restaurant
app.post('/api/reviews', authenticateToken, async (req, res) => {
    const { orderId, menuItemId, restaurantId, rating, comment } = req.body;

    try {
        // Verify order belongs to user and is delivered
        const [orders] = await pool.execute(
            'SELECT id FROM orders WHERE id = ? AND user_id = ? AND status = ?',
            [orderId, req.user.userId, 'delivered']
        );

        if (orders.length === 0) {
            return res.status(400).json({ error: 'Можна залишати відгуки тільки для доставлених замовлень' });
        }

        // Create review
        await pool.execute(
            'INSERT INTO reviews (user_id, order_id, menu_item_id, restaurant_id, rating, comment) VALUES (?, ?, ?, ?, ?, ?)',
            [req.user.userId, orderId, menuItemId || null, restaurantId || null, rating, comment]
        );

        // Update menu item rating if applicable
        if (menuItemId) {
            const [avgRating] = await pool.execute(
                'SELECT AVG(rating) as avg_rating FROM reviews WHERE menu_item_id = ?',
                [menuItemId]
            );
            
            await pool.execute(
                'UPDATE menu_items SET rating = ? WHERE id = ?',
                [avgRating[0].avg_rating, menuItemId]
            );
        }

        // Update restaurant rating if applicable
        if (restaurantId) {
            const [avgRating] = await pool.execute(
                'SELECT AVG(rating) as avg_rating FROM reviews WHERE restaurant_id = ?',
                [restaurantId]
            );
            
            await pool.execute(
                'UPDATE restaurants SET rating = ? WHERE id = ?',
                [avgRating[0].avg_rating, restaurantId]
            );
        }

        res.json({ message: 'Відгук додано успішно' });
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({ error: 'Помилка створення відгуку' });
    }
});

// F6: Get reviews for menu item
app.get('/api/menu-items/:id/reviews', async (req, res) => {
    try {
        const [reviews] = await pool.execute(`
            SELECT r.*, u.name as user_name
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            WHERE r.menu_item_id = ?
            ORDER BY r.created_at DESC
        `, [req.params.id]);

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: 'Помилка отримання відгуків' });
    }
});

// F6: Get reviews for restaurant
app.get('/api/restaurants/:id/reviews', async (req, res) => {
    try {
        const [reviews] = await pool.execute(`
            SELECT r.*, u.name as user_name
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            WHERE r.restaurant_id = ?
            ORDER BY r.created_at DESC
        `, [req.params.id]);

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: 'Помилка отримання відгуків' });
    }
});

// F7: Всі замовлення (для адміна)
app.get('/api/admin/orders', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Доступ заборонено' });
    }

    try {
        const [orders] = await pool.execute(`
            SELECT o.*, r.name as restaurant_name, u.name as user_name
            FROM orders o
            JOIN restaurants r ON o.restaurant_id = r.id
            JOIN users u ON o.user_id = u.id
            ORDER BY o.created_at DESC
        `);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Помилка отримання замовлень' });
    }
});

// F7: Оновити статус замовлення
app.patch('/api/admin/orders/:id/status', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Доступ заборонено' });
    }

    const { status } = req.body;

    try {
        await pool.execute(
            'UPDATE orders SET status = ? WHERE id = ?',
            [status, req.params.id]
        );
        res.json({ message: 'Статус оновлено' });
    } catch (error) {
        res.status(500).json({ error: 'Помилка оновлення статусу' });
    }
});

// F8: Admin - Order statistics
app.get('/api/admin/statistics', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const [totalOrders] = await pool.execute(
            'SELECT COUNT(*) as count FROM orders'
        );
        
        const [totalRevenue] = await pool.execute(
            'SELECT SUM(total_price) as revenue FROM orders WHERE payment_status = ?',
            ['paid']
        );
        
        const [ordersByStatus] = await pool.execute(
            'SELECT status, COUNT(*) as count FROM orders GROUP BY status'
        );
        
        const [recentOrders] = await pool.execute(`
            SELECT o.id, o.total_price, o.status, o.created_at, r.name as restaurant_name
            FROM orders o
            JOIN restaurants r ON o.restaurant_id = r.id
            ORDER BY o.created_at DESC
            LIMIT 10
        `);

        res.json({
            totalOrders: totalOrders[0].count,
            totalRevenue: totalRevenue[0].revenue || 0,
            ordersByStatus,
            recentOrders
        });
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({ error: 'Помилка отримання статистики' });
    }
});

// F7: Admin - Create restaurant
app.post('/api/admin/restaurants', authenticateToken, requireAdmin, async (req, res) => {
    const { name, description, address, phone, image_url } = req.body;

    try {
        const [result] = await pool.execute(
            'INSERT INTO restaurants (name, description, address, phone, image_url) VALUES (?, ?, ?, ?, ?)',
            [name, description, address, phone, image_url]
        );

        res.status(201).json({
            message: 'Ресторан створено',
            restaurantId: result.insertId
        });
    } catch (error) {
        res.status(500).json({ error: 'Помилка створення ресторану' });
    }
});

// F7: Admin - Update restaurant
app.put('/api/admin/restaurants/:id', authenticateToken, requireAdmin, async (req, res) => {
    const { name, description, address, phone, image_url, is_active } = req.body;

    try {
        await pool.execute(
            'UPDATE restaurants SET name = ?, description = ?, address = ?, phone = ?, image_url = ?, is_active = ? WHERE id = ?',
            [name, description, address, phone, image_url, is_active, req.params.id]
        );

        res.json({ message: 'Ресторан оновлено' });
    } catch (error) {
        res.status(500).json({ error: 'Помилка оновлення ресторану' });
    }
});

// F7: Admin - Delete restaurant
app.delete('/api/admin/restaurants/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        await pool.execute('DELETE FROM restaurants WHERE id = ?', [req.params.id]);
        res.json({ message: 'Ресторан видалено' });
    } catch (error) {
        res.status(500).json({ error: 'Помилка видалення ресторану' });
    }
});

// F7: Admin - Create menu item
app.post('/api/admin/menu-items', authenticateToken, requireAdmin, async (req, res) => {
    const { restaurant_id, category_id, name, description, price, image_url } = req.body;

    try {
        const [result] = await pool.execute(
            'INSERT INTO menu_items (restaurant_id, category_id, name, description, price, image_url) VALUES (?, ?, ?, ?, ?, ?)',
            [restaurant_id, category_id, name, description, price, image_url]
        );

        res.status(201).json({
            message: 'Страву створено',
            menuItemId: result.insertId
        });
    } catch (error) {
        res.status(500).json({ error: 'Помилка створення страви' });
    }
});

// F7: Admin - Update menu item
app.put('/api/admin/menu-items/:id', authenticateToken, requireAdmin, async (req, res) => {
    const { restaurant_id, category_id, name, description, price, image_url, is_available } = req.body;

    try {
        await pool.execute(
            'UPDATE menu_items SET restaurant_id = ?, category_id = ?, name = ?, description = ?, price = ?, image_url = ?, is_available = ? WHERE id = ?',
            [restaurant_id, category_id, name, description, price, image_url, is_available, req.params.id]
        );

        res.json({ message: 'Страву оновлено' });
    } catch (error) {
        res.status(500).json({ error: 'Помилка оновлення страви' });
    }
});

// F7: Admin - Delete menu item
app.delete('/api/admin/menu-items/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        await pool.execute('DELETE FROM menu_items WHERE id = ?', [req.params.id]);
        res.json({ message: 'Страву видалено' });
    } catch (error) {
        res.status(500).json({ error: 'Помилка видалення страви' });
    }
});

// F7: Admin - Create category
app.post('/api/admin/categories', authenticateToken, requireAdmin, async (req, res) => {
    const { name, description } = req.body;

    try {
        const [result] = await pool.execute(
            'INSERT INTO categories (name, description) VALUES (?, ?)',
            [name, description]
        );

        res.status(201).json({
            message: 'Категорію створено',
            categoryId: result.insertId
        });
    } catch (error) {
        res.status(500).json({ error: 'Помилка створення категорії' });
    }
});

// F7: Admin - Update category
app.put('/api/admin/categories/:id', authenticateToken, requireAdmin, async (req, res) => {
    const { name, description } = req.body;

    try {
        await pool.execute(
            'UPDATE categories SET name = ?, description = ? WHERE id = ?',
            [name, description, req.params.id]
        );

        res.json({ message: 'Категорію оновлено' });
    } catch (error) {
        res.status(500).json({ error: 'Помилка оновлення категорії' });
    }
});

// F7: Admin - Delete category
app.delete('/api/admin/categories/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        await pool.execute('DELETE FROM categories WHERE id = ?', [req.params.id]);
        res.json({ message: 'Категорію видалено' });
    } catch (error) {
        res.status(500).json({ error: 'Помилка видалення категорії' });
    }
});

// F9: Admin - Get all users
app.get('/api/admin/users', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const [users] = await pool.execute(
            'SELECT id, email, phone, name, role, is_blocked, created_at FROM users ORDER BY created_at DESC'
        );
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Помилка отримання користувачів' });
    }
});

// F9: Admin - Block/Unblock user
app.patch('/api/admin/users/:id/block', authenticateToken, requireAdmin, async (req, res) => {
    const { is_blocked } = req.body;

    try {
        await pool.execute(
            'UPDATE users SET is_blocked = ?, blocked_at = ? WHERE id = ?',
            [is_blocked, is_blocked ? new Date() : null, req.params.id]
        );

        res.json({ message: is_blocked ? 'Користувача заблоковано' : 'Користувача розблоковано' });
    } catch (error) {
        res.status(500).json({ error: 'Помилка зміни статусу користувача' });
    }
});

// F9: Admin - Change user role
app.patch('/api/admin/users/:id/role', authenticateToken, requireAdmin, async (req, res) => {
    const { role } = req.body;

    try {
        await pool.execute(
            'UPDATE users SET role = ? WHERE id = ?',
            [role, req.params.id]
        );

        res.json({ message: 'Роль користувача змінено' });
    } catch (error) {
        res.status(500).json({ error: 'Помилка зміни ролі користувача' });
    }
});

// F10: Courier - Get available orders
app.get('/api/courier/available-orders', authenticateToken, requireCourier, async (req, res) => {
    try {
        const [orders] = await pool.execute(`
            SELECT o.id, o.total_price, o.status, o.delivery_address, o.created_at,
                   r.name as restaurant_name, r.address as restaurant_address
            FROM orders o
            JOIN restaurants r ON o.restaurant_id = r.id
            WHERE o.status IN ('confirmed', 'preparing') AND o.courier_id IS NULL
            ORDER BY o.created_at ASC
        `);

        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Помилка отримання доступних замовлень' });
    }
});

// F10: Courier - Accept order
app.post('/api/courier/orders/:id/accept', authenticateToken, requireCourier, async (req, res) => {
    try {
        // Check if order is still available
        const [orders] = await pool.execute(
            'SELECT id, status FROM orders WHERE id = ? AND courier_id IS NULL',
            [req.params.id]
        );

        if (orders.length === 0) {
            return res.status(400).json({ error: 'Замовлення вже прийнято іншим кур\'єром' });
        }

        // Assign courier to order
        await pool.execute(
            'UPDATE orders SET courier_id = ? WHERE id = ?',
            [req.user.userId, req.params.id]
        );

        // Calculate estimated delivery time (30 minutes from now)
        const estimatedTime = new Date(Date.now() + 30 * 60 * 1000);
        await pool.execute(
            'UPDATE orders SET estimated_delivery_time = ? WHERE id = ?',
            [estimatedTime, req.params.id]
        );

        res.json({ message: 'Замовлення прийнято' });
    } catch (error) {
        console.error('Error accepting order:', error);
        res.status(500).json({ error: 'Помилка прийняття замовлення' });
    }
});

// F10: Courier - Get assigned orders
app.get('/api/courier/my-orders', authenticateToken, requireCourier, async (req, res) => {
    try {
        const [orders] = await pool.execute(`
            SELECT o.id, o.total_price, o.status, o.delivery_address, o.created_at, 
                   o.estimated_delivery_time,
                   r.name as restaurant_name, r.address as restaurant_address
            FROM orders o
            JOIN restaurants r ON o.restaurant_id = r.id
            WHERE o.courier_id = ? AND o.status IN ('preparing', 'delivering')
            ORDER BY o.created_at ASC
        `, [req.user.userId]);

        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Помилка отримання моїх замовлень' });
    }
});

// F10: Courier - Update delivery status
app.patch('/api/courier/orders/:id/status', authenticateToken, requireCourier, async (req, res) => {
    const { status } = req.body;

    try {
        // Verify courier owns this order
        const [orders] = await pool.execute(
            'SELECT id FROM orders WHERE id = ? AND courier_id = ?',
            [req.params.id, req.user.userId]
        );

        if (orders.length === 0) {
            return res.status(403).json({ error: 'Доступ заборонено' });
        }

        await pool.execute(
            'UPDATE orders SET status = ? WHERE id = ?',
            [status, req.params.id]
        );

        res.json({ message: 'Статус оновлено' });
    } catch (error) {
        res.status(500).json({ error: 'Помилка оновлення статусу' });
    }
});

app.get('/api/payment-methods', async (req, res) => {
    try {
        const [methods] = await pool.execute(
            'SELECT id, name, code FROM payment_methods WHERE is_active = true ORDER BY id'
        );
        res.json(methods);
    } catch (error) {
        console.error('Помилка отримання способів оплати:', error);
        res.status(500).json({ error: 'Не вдалося завантажити способи оплати' });
    }
});

// ✅ Отримати дані замовлення для confirmation.html
app.get('/api/orders/:id/details', async (req, res) => {
    const { id } = req.params;

    try {
        // 1️⃣ Отримуємо замовлення
        const [orders] = await pool.execute(`
            SELECT o.id, o.total_price, o.status, o.created_at,
                   pm.name as payment_method
            FROM orders o
            LEFT JOIN payment_methods pm ON o.payment_method_id = pm.id
            WHERE o.id = ?
        `, [id]);

        if (orders.length === 0) {
            return res.status(404).json({ error: 'Замовлення не знайдено' });
        }

        // 2️⃣ Отримуємо страви замовлення
        const [items] = await pool.execute(`
            SELECT oi.quantity, oi.price, mi.name, mi.image_url
            FROM order_items oi
            JOIN menu_items mi ON oi.menu_item_id = mi.id
            WHERE oi.order_id = ?
        `, [id]);

        res.json({
            ...orders[0],
            items
        });
    } catch (error) {
        console.error('Помилка отримання замовлення:', error);
        res.status(500).json({ error: 'Не вдалося завантажити замовлення' });
    }
});





// ✅ Оголосити PORT перед використанням
const PORT = process.env.PORT || 3000;

// ✅ Тільки один app.listen()
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущено: http://localhost:${PORT}`);
});
