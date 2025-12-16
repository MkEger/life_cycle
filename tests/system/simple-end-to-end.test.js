/**
 * Simplified System Tests for Food Delivery Application
 * Basic functionality testing without complex async operations
 */

const simpleSystem = {
    state: {
        currentUser: null,
        currentPage: 'home',
        cart: [],
        orders: []
    },

    // Simple synchronous authentication
    authenticateUser: (email, password) => {
        const testUsers = [
            {
                id: 1,
                email: 'admin@fooddelivery.com.ua',
                password: 'admin2024',
                name: 'Administrator',
                role: 'admin'
            },
            {
                id: 2,
                email: 'test@example.com',
                password: 'test123',
                name: 'Test User',
                role: 'user'
            }
        ];

        const user = testUsers.find(u => u.email === email && u.password === password);
        
        if (user) {
            const { password: _, ...userWithoutPassword } = user;
            simpleSystem.state.currentUser = userWithoutPassword;
            localStorage.setItem('user', JSON.stringify(userWithoutPassword));
            return userWithoutPassword;
        }
        return null;
    },

    // Simple navigation
    navigateTo: (page) => {
        simpleSystem.state.currentPage = page;
        return page;
    },

    // Simple add to cart
    addToCart: (item) => {
        if (!simpleSystem.state.currentUser) {
            return false;
        }
        
        const existingItem = simpleSystem.state.cart.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            simpleSystem.state.cart.push({ ...item, quantity: 1 });
        }
        
        localStorage.setItem('cart', JSON.stringify(simpleSystem.state.cart));
        return true;
    },

    // Simple checkout
    checkout: () => {
        if (!simpleSystem.state.currentUser || simpleSystem.state.cart.length === 0) {
            return false;
        }

        const order = {
            id: Date.now(),
            userId: simpleSystem.state.currentUser.id,
            items: [...simpleSystem.state.cart],
            total: simpleSystem.state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            status: 'pending',
            date: new Date().toISOString()
        };
        
        simpleSystem.state.orders.push(order);
        simpleSystem.state.cart = [];
        
        localStorage.setItem('orders', JSON.stringify(simpleSystem.state.orders));
        localStorage.removeItem('cart');
        simpleSystem.navigateTo('orders');
        
        return true;
    },

    // Reset state
    reset: () => {
        simpleSystem.state = {
            currentUser: null,
            currentPage: 'home',
            cart: [],
            orders: []
        };
        localStorage.clear();
    }
};

describe('Simple System Tests', () => {
    
    beforeEach(() => {
        simpleSystem.reset();
        testUtils.setupTestDOM();
    });

    afterEach(() => {
        testUtils.cleanup();
    });

    describe('Basic Authentication', () => {
        test('should authenticate valid user', () => {
            const user = simpleSystem.authenticateUser('test@example.com', 'test123');
            
            expect(user).toBeTruthy();
            expect(user.email).toBe('test@example.com');
            expect(user.name).toBe('Test User');
            expect(simpleSystem.state.currentUser).toEqual(user);
        });

        test('should reject invalid credentials', () => {
            const user = simpleSystem.authenticateUser('invalid@email.com', 'wrongpass');
            
            expect(user).toBeNull();
            expect(simpleSystem.state.currentUser).toBeNull();
        });
    });

    describe('Navigation System', () => {
        test('should navigate between pages', () => {
            const pages = ['home', 'menu', 'cart', 'profile', 'orders'];
            
            pages.forEach(page => {
                const result = simpleSystem.navigateTo(page);
                expect(result).toBe(page);
                expect(simpleSystem.state.currentPage).toBe(page);
            });
        });
    });

    describe('Shopping Cart', () => {
        beforeEach(() => {
            simpleSystem.authenticateUser('test@example.com', 'test123');
        });

        test('should add items to cart when logged in', () => {
            const item = { id: 1, name: 'Pizza', price: 12.99 };
            const result = simpleSystem.addToCart(item);
            
            expect(result).toBe(true);
            expect(simpleSystem.state.cart).toHaveLength(1);
            expect(simpleSystem.state.cart[0]).toEqual({ ...item, quantity: 1 });
        });

        test('should not add items when not logged in', () => {
            simpleSystem.state.currentUser = null;
            
            const item = { id: 1, name: 'Pizza', price: 12.99 };
            const result = simpleSystem.addToCart(item);
            
            expect(result).toBe(false);
            expect(simpleSystem.state.cart).toHaveLength(0);
        });

        test('should handle multiple items', () => {
            const item1 = { id: 1, name: 'Pizza', price: 12.99 };
            const item2 = { id: 2, name: 'Drink', price: 2.50 };
            
            simpleSystem.addToCart(item1);
            simpleSystem.addToCart(item2);
            simpleSystem.addToCart(item1); // Add same item again
            
            expect(simpleSystem.state.cart).toHaveLength(2);
            expect(simpleSystem.state.cart[0].quantity).toBe(2);
            expect(simpleSystem.state.cart[1].quantity).toBe(1);
        });
    });

    describe('Order Processing', () => {
        beforeEach(() => {
            simpleSystem.authenticateUser('test@example.com', 'test123');
            simpleSystem.addToCart({ id: 1, name: 'Pizza', price: 12.99 });
        });

        test('should process checkout successfully', () => {
            const result = simpleSystem.checkout();
            
            expect(result).toBe(true);
            expect(simpleSystem.state.cart).toHaveLength(0);
            expect(simpleSystem.state.orders).toHaveLength(1);
            expect(simpleSystem.state.currentPage).toBe('orders');
            
            const order = simpleSystem.state.orders[0];
            expect(order.total).toBe(12.99);
            expect(order.status).toBe('pending');
            expect(order.items).toHaveLength(1);
        });

        test('should not checkout empty cart', () => {
            simpleSystem.state.cart = [];
            const result = simpleSystem.checkout();
            
            expect(result).toBe(false);
            expect(simpleSystem.state.orders).toHaveLength(0);
        });

        test('should not checkout when not logged in', () => {
            simpleSystem.state.currentUser = null;
            const result = simpleSystem.checkout();
            
            expect(result).toBe(false);
            expect(simpleSystem.state.orders).toHaveLength(0);
        });
    });

    describe('Data Persistence', () => {
        test('should save user data to localStorage', () => {
            simpleSystem.authenticateUser('test@example.com', 'test123');
            
            expect(localStorage.setItem).toHaveBeenCalledWith(
                'user',
                expect.stringContaining('test@example.com')
            );
        });

        test('should save cart data to localStorage', () => {
            simpleSystem.authenticateUser('test@example.com', 'test123');
            simpleSystem.addToCart({ id: 1, name: 'Pizza', price: 12.99 });
            
            expect(localStorage.setItem).toHaveBeenCalledWith(
                'cart',
                expect.stringContaining('Pizza')
            );
        });
    });
});