// ============================================
// Food Delivery Website - Main JavaScript
// ============================================

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initFAQ();
    initFormValidation();
    setActiveNavLink();
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
            
            // Close other FAQs (optional - uncomment to enable)
            // faqQuestions.forEach(otherQuestion => {
            //     if (otherQuestion !== this) {
            //         otherQuestion.classList.remove('active');
            //         const otherAnswer = otherQuestion.nextElementSibling;
            //         if (otherAnswer) {
            //             otherAnswer.classList.remove('active');
            //         }
            //     }
            // });
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

// ========== Show Message ==========
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
