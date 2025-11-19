// ============================================
// Food Delivery Website - Main JavaScript
// Merged script combining cart logic and UI functionality
// ============================================

// ========== Sample Dishes Data ==========
const dishesData = {
    food: [
        { id: 1, name: 'Classic Burger', icon: '🍔', price: 12.99, description: 'Juicy beef patty with fresh vegetables' },
        { id: 2, name: 'Margherita Pizza', icon: '🍕', price: 14.99, description: 'Traditional Italian pizza with fresh mozzarella' },
        { id: 3, name: 'Caesar Salad', icon: '🥗', price: 9.99, description: 'Crispy romaine lettuce with Caesar dressing' },
        { id: 4, name: 'Sushi Roll', icon: '🍣', price: 16.99, description: 'Fresh salmon and avocado roll' },
        { id: 5, name: 'Pasta Carbonara', icon: '🍝', price: 13.99, description: 'Creamy pasta with bacon and parmesan' },
        { id: 6, name: 'Fried Chicken', icon: '🍗', price: 11.99, description: 'Crispy golden fried chicken pieces' }
    ],
    drinks: [
        { id: 7, name: 'Fresh Orange Juice', icon: '🧃', price: 4.99, description: 'Freshly squeezed orange juice' },
        { id: 8, name: 'Iced Coffee', icon: '☕', price: 5.99, description: 'Cold brew coffee with ice' },
        { id: 9, name: 'Smoothie Bowl', icon: '🥤', price: 6.99, description: 'Mixed berry smoothie bowl' },
        { id: 10, name: 'Green Tea', icon: '🍵', price: 3.99, description: 'Traditional green tea' },
        { id: 11, name: 'Milkshake', icon: '🥛', price: 5.49, description: 'Creamy vanilla milkshake' },
        { id: 12, name: 'Lemonade', icon: '🍋', price: 3.99, description: 'Fresh homemade lemonade' }
    ],
    desserts: [
        { id: 13, name: 'Chocolate Cake', icon: '🍰', price: 7.99, description: 'Rich chocolate layer cake' },
        { id: 14, name: 'Ice Cream', icon: '🍨', price: 5.99, description: 'Vanilla ice cream with toppings' },
        { id: 15, name: 'Apple Pie', icon: '🥧', price: 6.99, description: 'Classic apple pie with cinnamon' },
        { id: 16, name: 'Donut', icon: '🍩', price: 2.99, description: 'Glazed donut with sprinkles' },
        { id: 17, name: 'Cookie', icon: '🍪', price: 3.99, description: 'Chocolate chip cookies (3 pcs)' },
        { id: 18, name: 'Cupcake', icon: '🧁', price: 4.99, description: 'Red velvet cupcake with frosting' }
    ]
};

// ========== Cart Management ==========
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// ========== Initialize on DOM Load (Combined) ==========
document.addEventListener('DOMContentLoaded', function() {
    // UI initialization
    initMobileMenu();
    initFAQ();
    initFormValidation();
    setActiveNavLink();
    
    // Cart and dishes initialization
    loadDishes('food', 'foodGrid');
    loadDishes('drinks', 'drinksGrid');
    loadDishes('desserts', 'dessertsGrid');
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
            
            // Toggle icon
            const icon = this.textContent;
            this.textContent = icon === '☰' ? '✕' : '☰';
        });

        // Close menu when clicking on a link
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

// ========== FAQ Accordion ==========
function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            // Toggle active class
            this.classList.toggle('active');
            
            // Get the answer element
            const answer = this.nextElementSibling;
            
            // Toggle answer visibility
            if (answer) {
                answer.classList.toggle('active');
            }
        });
    });
}

// ========== Form Validation ==========
function initFormValidation() {
    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            if (validateEmail(email) && password.length >= 6) {
                showMessage('Login successful! Redirecting...', 'success');
                
                // Simulate login and redirect
                setTimeout(() => {
                    window.location.href = 'pages/account.html';
                }, 1500);
            } else {
                showMessage('Please enter a valid email and password (min 6 characters)', 'error');
            }
        });
    }

    // Register Form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('registerConfirmPassword').value;
            
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
            
            if (password !== confirmPassword) {
                showMessage('Passwords do not match', 'error');
                return;
            }
            
            showMessage('Registration successful! Redirecting to login...', 'success');
            
            // Simulate registration and redirect
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
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

// ========== Load Dishes into Grid ==========
function loadDishes(category, gridId) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    
    dishesData[category].forEach(dish => {
        const dishCard = createDishCard(dish);
        grid.appendChild(dishCard);
    });
}

// ========== Create Dish Card Element ==========
function createDishCard(dish) {
    const card = document.createElement('div');
    card.className = 'dish-card';
    card.innerHTML = `
        <div class="dish-image">${dish.icon}</div>
        <div class="dish-info">
            <h3 class="dish-name">${dish.name}</h3>
            <p class="dish-description">${dish.description}</p>
            <div class="dish-footer">
                <span class="dish-price">$${dish.price.toFixed(2)}</span>
                <button class="add-to-cart-btn" onclick="addToCart(${dish.id})">Add to Cart</button>
            </div>
        </div>
    `;
    return card;
}

// ========== Add Item to Cart ==========
function addToCart(dishId) {
    // Find the dish
    let dish = null;
    for (let category in dishesData) {
        dish = dishesData[category].find(d => d.id === dishId);
        if (dish) break;
    }
    
    if (!dish) return;
    
    // Check if item already in cart
    const existingItem = cart.find(item => item.id === dishId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: dish.id,
            name: dish.name,
            icon: dish.icon,
            price: dish.price,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    
    // Show feedback
    showNotification(`${dish.name} added to cart!`);
}

// ========== Remove Item from Cart ==========
function removeFromCart(dishId) {
    cart = cart.filter(item => item.id !== dishId);
    saveCart();
    updateCartCount();
    displayCart();
}

// ========== Update Quantity ==========
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

// ========== Save Cart to localStorage ==========
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// ========== Update Cart Count in Header ==========
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// ========== Calculate Cart Total ==========
function calculateTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// ========== Display Cart ==========
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
            <div class="cart-item-icon">${item.icon}</div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">🗑️</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    
    if (totalPrice) {
        totalPrice.textContent = '$' + calculateTotal().toFixed(2);
    }
}

// ========== Load Order Summary ==========
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
            <span>${item.icon} ${item.name} x${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        `;
        summaryItems.appendChild(summaryItem);
    });
    
    if (orderTotal) {
        orderTotal.textContent = '$' + calculateTotal().toFixed(2);
    }
}

// ========== Setup Event Listeners ==========
function setupEventListeners() {
    // Cart button
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.addEventListener('click', openCart);
    }
    
    // Close cart button
    const closeCartBtn = document.getElementById('closeCartBtn');
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', closeCart);
    }
    
    // Checkout button
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
    
    // Close cart when clicking outside
    const cartOverlay = document.getElementById('cartOverlay');
    if (cartOverlay) {
        cartOverlay.addEventListener('click', function(e) {
            if (e.target === cartOverlay) {
                closeCart();
            }
        });
    }
    
    // Payment method change
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

// ========== Open Cart Overlay ==========
function openCart() {
    const cartOverlay = document.getElementById('cartOverlay');
    if (cartOverlay) {
        cartOverlay.classList.add('active');
        displayCart();
    }
}

// ========== Close Cart Overlay ==========
function closeCart() {
    const cartOverlay = document.getElementById('cartOverlay');
    if (cartOverlay) {
        cartOverlay.classList.remove('active');
    }
}

// ========== Show Notification (for cart actions) ==========
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

// ========== Show Message (for form validation) ==========
function showMessage(message, type) {
    // Remove existing message if any
    const existingMessage = document.querySelector('.alert-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `alert-message alert-${type}`;
    messageDiv.textContent = message;
    
    // Add styles
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
    
    // Remove message after 4 seconds
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            messageDiv.remove();
        }, 300);
    }, 4000);
}

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
    // Redirect to dishes page to order
    window.location.href = 'dishes.html';
}

// ========== Logout Function ==========
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        showMessage('Logging out...', 'success');
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1000);
    }
}

// ========== Add Animation Styles ==========
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
