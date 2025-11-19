// Функція реєстрації
async function registerUser(name, email, password, phone) {
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, phone })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Реєстрація успішна! Тепер увійдіть.');
            window.location.href = '/pages/login.html';
        } else {
            alert(data.error || 'Помилка реєстрації');
        }
    } catch (error) {
        console.error('Помилка:', error);
        alert('Не вдалося зареєструватися. Спробуйте пізніше.');
    }
}

// Функція логіну
async function loginUser(email, password) {
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Зберігаємо токен та дані користувача
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            alert('Вхід успішний!');
            window.location.href = '/index.html';
        } else {
            alert(data.error || 'Невірний email або пароль');
        }
    } catch (error) {
        console.error('Помилка:', error);
        alert('Не вдалося увійти. Спробуйте пізніше.');
    }
}

// Функція виходу
function logoutUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    alert('Ви вийшли з системи');
    window.location.href = '/pages/login.html';
}

// Перевірка авторизації
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/pages/login.html';
        return null;
    }
    return token;
}

// Отримати дані користувача
function getCurrentUser() {
    const userJSON = localStorage.getItem('user');
    return userJSON ? JSON.parse(userJSON) : null;
}

// Відправка захищених запитів
async function fetchWithAuth(url, options = {}) {
    const token = localStorage.getItem('token');

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        ...options,
        headers
    });

    // Якщо токен недійсний - перенаправляємо на логін
    if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/pages/login.html';
    }

    return response;
}
