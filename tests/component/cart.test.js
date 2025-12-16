/**
 * Component Tests for Shopping Cart
 * Tests cart functionality and integration
 */

// Mock cart component
const mockCartComponent = {
    cart: [],

    // Initialize cart
    initCart: () => {
        mockCartComponent.cart = [];
        const cartContainer = document.createElement('div');
        cartContainer.id = 'cart-container';
        cartContainer.innerHTML = `
            <div id="cart-items"></div>
            <div id="cart-total">$0.00</div>
            <button id="clear-cart">Clear Cart</button>
            <button id="checkout-btn">Checkout</button>
            <div id="cart-message" style="display: none;"></div>
        `;
        document.body.appendChild(cartContainer);
        mockCartComponent.updateCartDisplay();
        return cartContainer;
    },

    // Add item to cart
    addItem: (item) => {
        if (!item || !item.id || !item.name || !item.price) {
            mockCartComponent.showMessage('Invalid item', 'error');
            return false;
        }

        const existingItemIndex = mockCartComponent.cart.findIndex(cartItem => cartItem.id === item.id);
        
        if (existingItemIndex > -1) {
            mockCartComponent.cart[existingItemIndex].quantity += item.quantity || 1;
        } else {
            mockCartComponent.cart.push({
                ...item,
                quantity: item.quantity || 1
            });
        }

        mockCartComponent.updateCartDisplay();
        mockCartComponent.showMessage(`Added ${item.name} to cart`, 'success');
        return true;
    },

    // Remove item from cart
    removeItem: (itemId) => {
        const initialLength = mockCartComponent.cart.length;
        mockCartComponent.cart = mockCartComponent.cart.filter(item => item.id !== itemId);
        
        if (mockCartComponent.cart.length < initialLength) {
            mockCartComponent.updateCartDisplay();
            mockCartComponent.showMessage('Item removed from cart', 'success');
            return true;
        }
        
        return false;
    },

    // Update item quantity
    updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
            return mockCartComponent.removeItem(itemId);
        }

        const item = mockCartComponent.cart.find(item => item.id === itemId);
        if (item) {
            item.quantity = quantity;
            mockCartComponent.updateCartDisplay();
            return true;
        }
        
        return false;
    },

    // Clear cart
    clearCart: () => {
        mockCartComponent.cart = [];
        mockCartComponent.updateCartDisplay();
        mockCartComponent.showMessage('Cart cleared', 'success');
    },

    // Get cart total
    getTotal: () => {
        return mockCartComponent.cart.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    },

    // Get item count
    getItemCount: () => {
        return mockCartComponent.cart.reduce((count, item) => {
            return count + item.quantity;
        }, 0);
    },

    // Update cart display
    updateCartDisplay: () => {
        const cartItemsDiv = document.getElementById('cart-items');
        const cartTotalDiv = document.getElementById('cart-total');
        
        if (cartItemsDiv) {
            if (mockCartComponent.cart.length === 0) {
                cartItemsDiv.innerHTML = '<p>Your cart is empty</p>';
            } else {
                cartItemsDiv.innerHTML = mockCartComponent.cart.map(item => `
                    <div class="cart-item" data-id="${item.id}">
                        <span>${item.name}</span>
                        <span>$${item.price.toFixed(2)}</span>
                        <span>x${item.quantity}</span>
                        <span>$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                `).join('');
            }
        }

        if (cartTotalDiv) {
            cartTotalDiv.textContent = `$${mockCartComponent.getTotal().toFixed(2)}`;
        }

        // Update checkout button state
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.disabled = mockCartComponent.cart.length === 0;
        }
    },

    // Show message
    showMessage: (message, type = 'info') => {
        const messageDiv = document.getElementById('cart-message');
        if (messageDiv) {
            messageDiv.textContent = message;
            messageDiv.className = `message ${type}`;
            messageDiv.style.display = 'block';
            
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 3000);
        }
    },

    // Save cart to localStorage
    saveCart: () => {
        localStorage.setItem('cart', JSON.stringify(mockCartComponent.cart));
    },

    // Load cart from localStorage
    loadCart: () => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                mockCartComponent.cart = JSON.parse(savedCart);
                mockCartComponent.updateCartDisplay();
                return true;
            } catch (error) {
                console.error('Failed to load cart:', error);
                return false;
            }
        }
        return false;
    }
};

describe('Cart Component Tests', () => {
    let cartContainer;

    beforeEach(() => {
        testUtils.setupTestDOM();
        cartContainer = mockCartComponent.initCart();
    });

    afterEach(() => {
        testUtils.cleanup();
        if (cartContainer && cartContainer.parentNode) {
            cartContainer.parentNode.removeChild(cartContainer);
        }
    });

    describe('Cart Initialization', () => {
        test('should create cart container with required elements', () => {
            const cartItems = document.getElementById('cart-items');
            const cartTotal = document.getElementById('cart-total');
            const clearButton = document.getElementById('clear-cart');
            const checkoutButton = document.getElementById('checkout-btn');
            
            expect(cartItems).toBeTruthy();
            expect(cartTotal).toBeTruthy();
            expect(clearButton).toBeTruthy();
            expect(checkoutButton).toBeTruthy();
        });

        test('should start with empty cart', () => {
            expect(mockCartComponent.cart).toHaveLength(0);
            expect(mockCartComponent.getTotal()).toBe(0);
            expect(mockCartComponent.getItemCount()).toBe(0);
            
            const cartTotal = document.getElementById('cart-total');
            expect(cartTotal.textContent).toBe('$0.00');
        });

        test('should disable checkout button when cart is empty', () => {
            const checkoutButton = document.getElementById('checkout-btn');
            expect(checkoutButton.disabled).toBe(true);
        });
    });

    describe('Adding Items', () => {
        const testItem = {
            id: 1,
            name: 'Test Pizza',
            price: 12.99,
            quantity: 1
        };

        test('should add new item to cart', () => {
            const result = mockCartComponent.addItem(testItem);
            
            expect(result).toBe(true);
            expect(mockCartComponent.cart).toHaveLength(1);
            expect(mockCartComponent.cart[0]).toEqual(testItem);
        });

        test('should increase quantity for existing item', () => {
            mockCartComponent.addItem(testItem);
            mockCartComponent.addItem({ ...testItem, quantity: 2 });
            
            expect(mockCartComponent.cart).toHaveLength(1);
            expect(mockCartComponent.cart[0].quantity).toBe(3);
        });

        test('should reject invalid items', () => {
            expect(mockCartComponent.addItem(null)).toBe(false);
            expect(mockCartComponent.addItem({})).toBe(false);
            expect(mockCartComponent.addItem({ id: 1 })).toBe(false);
            expect(mockCartComponent.addItem({ id: 1, name: 'Test' })).toBe(false);
        });

        test('should update display after adding item', () => {
            mockCartComponent.addItem(testItem);
            
            const cartItems = document.getElementById('cart-items');
            const cartTotal = document.getElementById('cart-total');
            const checkoutButton = document.getElementById('checkout-btn');
            
            expect(cartItems.innerHTML).toContain('Test Pizza');
            expect(cartItems.innerHTML).toContain('$12.99');
            expect(cartTotal.textContent).toBe('$12.99');
            expect(checkoutButton.disabled).toBe(false);
        });
    });

    describe('Removing Items', () => {
        const testItem = {
            id: 1,
            name: 'Test Pizza',
            price: 12.99,
            quantity: 1
        };

        beforeEach(() => {
            mockCartComponent.addItem(testItem);
        });

        test('should remove item from cart', () => {
            const result = mockCartComponent.removeItem(1);
            
            expect(result).toBe(true);
            expect(mockCartComponent.cart).toHaveLength(0);
        });

        test('should not remove non-existent item', () => {
            const result = mockCartComponent.removeItem(999);
            
            expect(result).toBe(false);
            expect(mockCartComponent.cart).toHaveLength(1);
        });

        test('should update display after removing item', () => {
            mockCartComponent.removeItem(1);
            
            const cartItems = document.getElementById('cart-items');
            const cartTotal = document.getElementById('cart-total');
            const checkoutButton = document.getElementById('checkout-btn');
            
            expect(cartItems.innerHTML).toContain('Your cart is empty');
            expect(cartTotal.textContent).toBe('$0.00');
            expect(checkoutButton.disabled).toBe(true);
        });
    });

    describe('Quantity Updates', () => {
        const testItem = {
            id: 1,
            name: 'Test Pizza',
            price: 12.99,
            quantity: 1
        };

        beforeEach(() => {
            mockCartComponent.addItem(testItem);
        });

        test('should update item quantity', () => {
            const result = mockCartComponent.updateQuantity(1, 3);
            
            expect(result).toBe(true);
            expect(mockCartComponent.cart[0].quantity).toBe(3);
        });

        test('should remove item when quantity is 0', () => {
            const result = mockCartComponent.updateQuantity(1, 0);
            
            expect(result).toBe(true);
            expect(mockCartComponent.cart).toHaveLength(0);
        });

        test('should not update non-existent item', () => {
            const result = mockCartComponent.updateQuantity(999, 5);
            
            expect(result).toBe(false);
        });
    });

    describe('Cart Calculations', () => {
        test('should calculate correct total', () => {
            mockCartComponent.addItem({ id: 1, name: 'Pizza', price: 12.99, quantity: 2 });
            mockCartComponent.addItem({ id: 2, name: 'Drink', price: 2.50, quantity: 1 });
            
            const total = mockCartComponent.getTotal();
            expect(total).toBe(28.48); // (12.99 * 2) + (2.50 * 1)
        });

        test('should calculate correct item count', () => {
            mockCartComponent.addItem({ id: 1, name: 'Pizza', price: 12.99, quantity: 2 });
            mockCartComponent.addItem({ id: 2, name: 'Drink', price: 2.50, quantity: 3 });
            
            const count = mockCartComponent.getItemCount();
            expect(count).toBe(5); // 2 + 3
        });

        test('should return 0 for empty cart', () => {
            expect(mockCartComponent.getTotal()).toBe(0);
            expect(mockCartComponent.getItemCount()).toBe(0);
        });
    });

    describe('Cart Clear', () => {
        beforeEach(() => {
            mockCartComponent.addItem({ id: 1, name: 'Pizza', price: 12.99 });
            mockCartComponent.addItem({ id: 2, name: 'Drink', price: 2.50 });
        });

        test('should clear all items', () => {
            mockCartComponent.clearCart();
            
            expect(mockCartComponent.cart).toHaveLength(0);
            expect(mockCartComponent.getTotal()).toBe(0);
        });

        test('should update display after clearing', () => {
            mockCartComponent.clearCart();
            
            const cartItems = document.getElementById('cart-items');
            const cartTotal = document.getElementById('cart-total');
            
            expect(cartItems.innerHTML).toContain('Your cart is empty');
            expect(cartTotal.textContent).toBe('$0.00');
        });
    });

    describe('localStorage Integration', () => {
        const testItems = [
            { id: 1, name: 'Pizza', price: 12.99, quantity: 1 },
            { id: 2, name: 'Drink', price: 2.50, quantity: 2 }
        ];

        test('should save cart to localStorage', () => {
            testItems.forEach(item => mockCartComponent.addItem(item));
            mockCartComponent.saveCart();
            
            expect(localStorage.setItem).toHaveBeenCalledWith(
                'cart',
                expect.stringContaining('"name":"Pizza"')
            );
        });

        test('should load cart from localStorage', () => {
            localStorage.getItem.mockReturnValue(JSON.stringify(testItems));
            
            const result = mockCartComponent.loadCart();
            
            expect(result).toBe(true);
            expect(mockCartComponent.cart).toHaveLength(2);
            expect(mockCartComponent.cart[0].name).toBe('Pizza');
        });

        test('should handle invalid cart data', () => {
            localStorage.getItem.mockReturnValue('invalid json');
            
            const result = mockCartComponent.loadCart();
            
            expect(result).toBe(false);
            expect(mockCartComponent.cart).toHaveLength(0);
        });

        test('should handle empty localStorage', () => {
            localStorage.getItem.mockReturnValue(null);
            
            const result = mockCartComponent.loadCart();
            
            expect(result).toBe(false);
        });
    });
});