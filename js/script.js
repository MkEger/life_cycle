// ============================================
// Food Delivery Website - Main JavaScript
// ============================================

// Cart management
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize UI components
    initMobileMenu();
    initFAQ();
    initFormValidation();
    setActiveNavLink();
    updateUserInterface();
    setActiveNavLink();
    updateUserInterface();

    // Load dishes if on dishes page
    if (document.getElementById('foodGrid')) {
        loadDishesFromDB();
    }

    // Update cart count
    updateCartCount();

    // Load order summary if on payment/address/confirmation page
    if (document.getElementById('summaryItems')) {
        loadOrderSummary();
    }

    // Setup event listeners
    setupEventListeners();
});

// ========== Mobile Menu Toggle ==========
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');

            const icon = this.textContent;
            this.textContent = icon === '☰' ? '✕' : '☰';
        });

        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                if (mobileToggle) {
                    mobileToggle.textContent = '☰';
                }
            });
        });
    }
}

// ========== Dish Loading from Database ==========
async function loadDishesFromDB() {
    try {
        console.log('🔄 Завантаження страв...');
        const response = await fetch('http://localhost:3000/api/menu-items?restaurantId=1');

        if (!response.ok) {
            throw new Error('Помилка завантаження страв');
        }

        const dishes = await response.json();
        console.log('📦 Отримано страв:', dishes);

        const foodGrid = document.getElementById('foodGrid');
        const drinksGrid = document.getElementById('drinksGrid');
        const dessertsGrid = document.getElementById('dessertsGrid');

        if (!foodGrid || !drinksGrid || !dessertsGrid) {
            console.error('❌ Елементи foodGrid, drinksGrid, dessertsGrid не знайдені!');
            return;
        }

        foodGrid.innerHTML = '';
        drinksGrid.innerHTML = '';
        dessertsGrid.innerHTML = '';

        dishes.forEach(dish => {
            console.log('🍕 Додаємо страву:', dish.name, 'Category ID:', dish.category_id);

            // ✅ Конвертуємо price у число
            const price = parseFloat(dish.price);

            const card = document.createElement('div');
            card.className = 'dish-card';
            card.innerHTML = `
                <div class="dish-image">
                    <img src="images/${dish.image_url}" alt="${dish.name}" onerror="this.src='images/placeholder.jpg'">
                </div>
                <div class="dish-info">
                    <h3 class="dish-name">${dish.name}</h3>
                    <p class="dish-description">${dish.description}</p>
                    <div class="dish-footer">
                        <span class="dish-price">$${price.toFixed(2)}</span>
                        <button class="add-to-cart-btn" data-dish-id="${dish.id}" data-dish-name="${dish.name}" data-dish-price="${price}">
                            Add to Cart
                        </button>
                    </div>
                </div>
            `;

            // ✅ Додаємо обробник події безпосередньо до кнопки
            const addButton = card.querySelector('.add-to-cart-btn');
            addButton.addEventListener('click', function() {
                addToCartDB(dish.id, dish.name, price);
            });

            if (dish.category_id === 2) { // Піца
                foodGrid.appendChild(card);
            } else if (dish.category_id === 5) { // Напої
                drinksGrid.appendChild(card);
            } else if (dish.category_id === 4) { // Десерти
                dessertsGrid.appendChild(card);
            } else {
                console.warn('⚠️ Невідома категорія:', dish.category_id, 'для', dish.name);
            }
        });

        console.log('✅ Страви завантажено!');
    } catch (error) {
        console.error('❌ Помилка завантаження страв:', error);
        showNotification('Не вдалося завантажити меню');
    }
}

// ========== Cart Management ==========
// Add item to cart (from DB)
function addToCartDB(dishId, dishName, dishPrice) {
    const price = parseFloat(dishPrice);
    if (isNaN(price)) {
        console.error('Invalid price for dish:', dishName);
        return;
    }

    const existingItem = cart.find(item => item.id === dishId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: dishId,
            name: dishName,
            price: price,
            quantity: 1
        });
    }

    saveCart();
    updateCartCount();
    showNotification(`${dishName} added to cart!`);
}

// Remove item from cart
function removeFromCart(dishId) {
    cart = cart.filter(item => item.id !== dishId);
    saveCart();
    updateCartCount();
    displayCart();
}

// Update quantity
function updateQuantity(dishId, change) {
    const item = cart.find(item => item.id === dishId);
    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        removeFromCart(dishId);
    } else {
        saveCart();
        displayCart();
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Update cart count in header
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Calculate cart total
function calculateTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Display cart
function displayCart() {
    const cartItems = document.getElementById('cartItems');
    const totalPrice = document.getElementById('totalPrice');

    if (!cartItems) return;

    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="cart-empty">Your cart is empty</div>';
        if (totalPrice) totalPrice.textContent = '$0.00';
        return;
    }

    cartItems.innerHTML = '';
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn decrease-btn">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn increase-btn">+</button>
                <button class="remove-btn">🗑️</button>
            </div>
        `;

        // ✅ Додаємо обробники подій безпосередньо до кнопок
        const decreaseBtn = cartItem.querySelector('.decrease-btn');
        const increaseBtn = cartItem.querySelector('.increase-btn');
        const removeBtn = cartItem.querySelector('.remove-btn');

        decreaseBtn.addEventListener('click', () => updateQuantity(item.id, -1));
        increaseBtn.addEventListener('click', () => updateQuantity(item.id, 1));
        removeBtn.addEventListener('click', () => removeFromCart(item.id));

        cartItems.appendChild(cartItem);
    });

    if (totalPrice) {
        totalPrice.textContent = '$' + calculateTotal().toFixed(2);
    }
}

// Load order summary
function loadOrderSummary() {
    const summaryItems = document.getElementById('summaryItems');
    const orderTotal = document.getElementById('orderTotal');

    if (!summaryItems) return;

    if (cart.length === 0) {
        summaryItems.innerHTML = '<div style="text-align: center; color: #999;">No items in order</div>';
        if (orderTotal) orderTotal.textContent = '$0.00';
        return;
    }

    summaryItems.innerHTML = '';
    cart.forEach(item => {
        const summaryItem = document.createElement('div');
        summaryItem.className = 'summary-item';
        summaryItem.innerHTML = `
            <span>${item.name} x${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        `;
        summaryItems.appendChild(summaryItem);
    });

    if (orderTotal) {
        orderTotal.textContent = '$' + calculateTotal().toFixed(2);
    }
}

// Setup event listeners
function setupEventListeners() {
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) cartBtn.addEventListener('click', openCart);

    const closeCartBtn = document.getElementById('closeCartBtn');
    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);

    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            window.location.href = 'payment.html';
        });
    }

    const cartOverlay = document.getElementById('cartOverlay');
    if (cartOverlay) {
        cartOverlay.addEventListener('click', function(e) {
            if (e.target === cartOverlay) closeCart();
        });
    }

    const paymentMethod = document.getElementById('paymentMethod');
    if (paymentMethod) {
        paymentMethod.addEventListener('change', function() {
            const cardDetails = document.getElementById('cardDetails');
            if (this.value === 'credit' || this.value === 'debit') {
                cardDetails.classList.add('active');
            } else {
                cardDetails.classList.remove('active');
            }
        });
    }
}

// Open cart overlay
function openCart() {
    const cartOverlay = document.getElementById('cartOverlay');
    if (cartOverlay) {
        cartOverlay.classList.add('active');
        displayCart();
    }
}

// Close cart overlay
function closeCart() {
    const cartOverlay = document.getElementById('cartOverlay');
    if (cartOverlay) {
        cartOverlay.classList.remove('active');
    }
}

// ========== FAQ Accordion ==========
function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            this.classList.toggle('active');

            const answer = this.nextElementSibling;

            if (answer) {
                answer.classList.toggle('active');
            }
        });
    });
}

// ========== Form Validation ========== (ОНОВЛЕНО)
function initFormValidation() {
    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            if (validateEmail(email) && password.length >= 6) {
                await loginUser(email, password); // ← Використовуємо функцію з auth.js
            } else {
                showMessage('Please enter a valid email and password (min 6 characters)', 'error');
            }
        });
    }

    // Register Form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const phone = document.getElementById('registerPhone')?.value || '';

            if (!name || name.length < 2) {
                showMessage('Please enter a valid name', 'error');
                return;
            }

            if (!validateEmail(email)) {
                showMessage('Please enter a valid email address', 'error');
                return;
            }

            if (password.length < 6) {
                showMessage('Password must be at least 6 characters long', 'error');
                return;
            }

            await registerUser(name, email, password, phone); // ← Використовуємо функцію з auth.js
        });
    }

    // Profile Update Form
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('profileName').value;
            const email = document.getElementById('profileEmail').value;

            if (!name || name.length < 2) {
                showMessage('Please enter a valid name', 'error');
                return;
            }

            if (!validateEmail(email)) {
                showMessage('Please enter a valid email address', 'error');
                return;
            }

            showMessage('Profile updated successfully!', 'success');
        });
    }
}

// ========== Email Validation ==========
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ========== Show Message ==========
function showMessage(message, type) {
    const existingMessage = document.querySelector('.alert-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `alert-message alert-${type}`;
    messageDiv.textContent = message;

    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 350px;
    `;

    if (type === 'success') {
        messageDiv.style.backgroundColor = '#d4edda';
        messageDiv.style.color = '#155724';
        messageDiv.style.border = '1px solid #c3e6cb';
    } else {
        messageDiv.style.backgroundColor = '#f8d7da';
        messageDiv.style.color = '#721c24';
        messageDiv.style.border = '1px solid #f5c6cb';
    }

    document.body.appendChild(messageDiv);

    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            messageDiv.remove();
        }, 300);
    }, 4000);
}

// Show notification (alternative style for cart actions)
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #2d8659;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 3px 10px rgba(0,0,0,0.2);
        z-index: 2000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ========== Set Active Navigation Link ==========
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// ========== Update User Interface ========== (НОВА ФУНКЦІЯ)
function updateUserInterface() {
    const user = getCurrentUser(); // з auth.js
    const nav = document.querySelector('.nav-links');

    if (nav && user) {
        // Якщо користувач увійшов, показуємо його ім'я
        const userInfo = document.createElement('li');
        userInfo.innerHTML = `
    <span class="user-name">👤 ${user.name}</span>
    <a href="#" onclick="logoutUser()" class="nav-link">Logout</a>
`;
        nav.appendChild(userInfo);

    }
}

// ========== Smooth Scroll ==========
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// ========== Order Now Button Handler ==========
function orderNow(dishName) {
    window.location.href = 'dishes.html';
}

// ========== Order Submission (for address.html) ==========
if (window.location.pathname.includes('address.html')) {
    const confirmOrderBtn = document.querySelector('.confirm-btn, button[type="submit"]');
    if (confirmOrderBtn) {
        confirmOrderBtn.addEventListener('click', async function(e) {
            e.preventDefault();

            // ✅ Отримуємо елементи форми
            const fullNameInput = document.getElementById('fullName');
            const phoneInput = document.getElementById('phoneNumber');
            const addressInput = document.getElementById('streetAddress');
            const cityInput = document.getElementById('city');
            const stateInput = document.getElementById('state');
            const zipInput = document.getElementById('zipCode');
            const countryInput = document.getElementById('country');
            const notesInput = document.getElementById('deliveryNotes');

            // ✅ Перевірка існування елементів
            if (!fullNameInput || !phoneInput || !addressInput || !cityInput || !countryInput || !zipInput) {
                console.error('❌ Не знайдено елементи форми!');
                alert('Помилка: форма не завантажена');
                return;
            }

            // ✅ Отримуємо значення
            const fullName = fullNameInput.value.trim();
            const phone = phoneInput.value.trim();
            const address = addressInput.value.trim();
            const city = cityInput.value.trim();
            const state = stateInput?.value.trim() || '';
            const zip = zipInput.value.trim();
            const country = countryInput.value.trim();
            const notes = notesInput?.value.trim() || '';

            // ✅ Валідація
            if (!fullName || !phone || !address || !city || !country || !zip) {
                alert('Заповніть всі обов\'язкові поля!');
                return;
            }

            if (cart.length === 0) {
                alert('Кошик порожній!');
                return;
            }

            // ✅ Отримуємо payment_method з localStorage
            const paymentMethod = localStorage.getItem('payment_method');
            if (!paymentMethod) {
                alert('Спосіб оплати не обрано!');
                return;
            }

            // ✅ Отримуємо user_id (якщо авторизований)
            const userId = getUserIdFromToken();

            try {
                const response = await fetch('http://localhost:3000/api/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        user_id: userId,
                        customer_name: fullName,
                        phone: phone,
                        address: address,
                        city: city,
                        state: state,
                        zip: zip,
                        country: country,
                        delivery_notes: notes,
                        payment_method: paymentMethod, // ✅ Передаємо спосіб оплати
                        items: cart,
                        total: calculateTotal()
                    })
                });

                const data = await response.json();

                if (data.success) {
                    showNotification('Замовлення створено!');

                    // Очищуємо кошик і payment_method
                    cart = [];
                    saveCart();
                    updateCartCount();
                    localStorage.removeItem('payment_method');

                    // Переходимо на сторінку підтвердження
                    setTimeout(() => {
                        window.location.href = 'confirmation.html?orderId=' + data.orderId;
                    }, 1000);
                } else {
                    alert('Помилка створення замовлення');
                }
            } catch (error) {
                console.error('Помилка:', error);
                alert('Не вдалося створити замовлення');
            }
        });
    }
}

// ✅ Функція для отримання user_id з токену
function getUserIdFromToken() {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.userId;
    } catch (error) {
        console.error('❌ Помилка декодування токену:', error);
        return null;
    }
}

// ========== Logout Function ========== (ОНОВЛЕНО)
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        logoutUser(); // з auth.js
    }
}