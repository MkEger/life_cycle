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
    const { category, minPrice, maxPrice, search } = req.query;

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

    query += ' ORDER BY m.rating DESC';

    try {
        const [items] = await pool.execute(query, params);
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: 'Помилка отримання меню' });
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
