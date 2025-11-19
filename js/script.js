// ============================================
// Food Delivery Website - Main JavaScript
// ============================================

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initFAQ();
    initFormValidation();
    setActiveNavLink();
    updateUserInterface(); // ← Додати
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

// ========== Logout Function ========== (ОНОВЛЕНО)
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        logoutUser(); // з auth.js
    }
}