// Sample dishes data
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

// Cart management
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Load dishes if on index page
    if (document.getElementById('foodGrid')) {
        loadDishes('food', 'foodGrid');
        loadDishes('drinks', 'drinksGrid');
        loadDishes('desserts', 'dessertsGrid');
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

// Load dishes into grid
function loadDishes(category, gridId) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    
    dishesData[category].forEach(dish => {
        const dishCard = createDishCard(dish);
        grid.appendChild(dishCard);
    });
}

// Create dish card element
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

// Add item to cart
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
            <span>${item.icon} ${item.name} x${item.quantity}</span>
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

// Show notification
function showNotification(message) {
    // Simple alert for now - can be enhanced with custom notification
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
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);
