// ========================================
// DOM Content Loaded
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    initializeHamburgerMenu();
    initializeFAQ();
    initializeAuthForms();
    initializeCart();
    initializePasswordToggles();
});

// ========================================
// Hamburger Menu
// ========================================
function initializeHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
}

// ========================================
// FAQ Accordion
// ========================================
function initializeFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Close all FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });
}

// ========================================
// Authentication Forms
// ========================================
function initializeAuthForms() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            if (validateEmail(email) && password.length >= 6) {
                showNotification('Login successful!', 'success');
                // Redirect or handle login
                setTimeout(() => {
                    window.location.href = 'menu.html';
                }, 1500);
            } else {
                showNotification('Please enter valid credentials', 'error');
            }
        });
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const phone = document.getElementById('registerPhone').value;
            const password = document.getElementById('registerPassword').value;
            const passwordConfirm = document.getElementById('registerPasswordConfirm').value;
            
            if (!name || name.length < 2) {
                showNotification('Please enter your full name', 'error');
                return;
            }
            
            if (!validateEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            if (!phone || phone.length < 10) {
                showNotification('Please enter a valid phone number', 'error');
                return;
            }
            
            if (password.length < 6) {
                showNotification('Password must be at least 6 characters', 'error');
                return;
            }
            
            if (password !== passwordConfirm) {
                showNotification('Passwords do not match', 'error');
                return;
            }
            
            showNotification('Registration successful!', 'success');
            // Redirect or handle registration
            setTimeout(() => {
                window.location.href = 'menu.html';
            }, 1500);
        });
    }
}

// ========================================
// Shopping Cart
// ========================================
let cartItems = [];
let cartCount = 0;

function initializeCart() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const cartBtn = document.getElementById('cartBtn');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const menuItem = this.closest('.menu-item');
            const itemName = menuItem.querySelector('.menu-item-name').textContent.trim();
            const itemPrice = menuItem.querySelector('.menu-item-price').textContent.trim();
            
            addToCart(itemName, itemPrice);
        });
    });
    
    if (cartBtn) {
        cartBtn.addEventListener('click', function() {
            showCart();
        });
    }
}

function addToCart(name, price) {
    cartItems.push({ name, price });
    cartCount++;
    updateCartBadge();
    showNotification(`${name} added to cart!`, 'success');
}

function updateCartBadge() {
    const badges = document.querySelectorAll('.badge');
    badges.forEach(badge => {
        badge.textContent = cartCount;
    });
}

function showCart() {
    if (cartCount === 0) {
        showNotification('Your cart is empty', 'info');
        return;
    }
    
    let cartHTML = 'Cart Items:\n\n';
    cartItems.forEach((item, index) => {
        cartHTML += `${index + 1}. ${item.name} - ${item.price}\n`;
    });
    
    alert(cartHTML);
}

// ========================================
// Password Toggle
// ========================================
function initializePasswordToggles() {
    const toggleButtons = document.querySelectorAll('.toggle-password');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const passwordInput = this.previousElementSibling;
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
            } else {
                passwordInput.type = 'password';
            }
        });
    });
}

// ========================================
// Utility Functions
// ========================================
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        background-color: ${type === 'success' ? '#3DAB51' : type === 'error' ? '#dc3545' : '#2196F3'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-weight: 600;
    `;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
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
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ========================================
// Smooth Scrolling for Anchor Links
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Skip if it's just "#"
        if (href === '#') {
            return;
        }
        
        const target = document.querySelector(href);
        
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
