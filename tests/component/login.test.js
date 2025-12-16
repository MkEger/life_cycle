/**
 * Component Tests for Login System
 * Tests integration between auth functions and UI components
 */

// Mock DOM elements and functions
const mockLoginComponent = {
    // Initialize login form
    initLoginForm: () => {
        const form = document.createElement('form');
        form.innerHTML = `
            <input type="email" id="email" name="email" required>
            <input type="password" id="password" name="password" required>
            <button type="submit" id="login-btn">Login</button>
            <div id="error-message" style="display: none;"></div>
            <div id="success-message" style="display: none;"></div>
        `;
        document.body.appendChild(form);
        return form;
    },

    // Show error message
    showError: (message) => {
        const errorDiv = document.getElementById('error-message');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
    },

    // Show success message
    showSuccess: (message) => {
        const successDiv = document.getElementById('success-message');
        if (successDiv) {
            successDiv.textContent = message;
            successDiv.style.display = 'block';
        }
    },

    // Hide all messages
    hideMessages: () => {
        const errorDiv = document.getElementById('error-message');
        const successDiv = document.getElementById('success-message');
        
        if (errorDiv) errorDiv.style.display = 'none';
        if (successDiv) successDiv.style.display = 'none';
    },

    // Process login
    processLogin: async (email, password) => {
        mockLoginComponent.hideMessages();
        
        // Validate input
        if (!email || !password) {
            mockLoginComponent.showError('Email and password are required');
            return false;
        }
        
        // Simulate API call
        try {
            const user = await mockLoginComponent.authenticateUser(email, password);
            
            if (user) {
                mockLoginComponent.showSuccess(`Welcome, ${user.name}!`);
                
                // Store user data
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('token', `token_${Date.now()}`);
                
                return true;
            } else {
                mockLoginComponent.showError('Invalid email or password');
                return false;
            }
        } catch (error) {
            mockLoginComponent.showError('Login failed. Please try again.');
            return false;
        }
    },

    // Mock authentication
    authenticateUser: async (email, password) => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Test users
        const users = [
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
        
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            const { password: _, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }
        
        return null;
    }
};

describe('Login Component Tests', () => {
    let loginForm;

    beforeEach(() => {
        // Setup test DOM
        testUtils.setupTestDOM();
        loginForm = mockLoginComponent.initLoginForm();
    });

    afterEach(() => {
        // Cleanup
        testUtils.cleanup();
        if (loginForm && loginForm.parentNode) {
            loginForm.parentNode.removeChild(loginForm);
        }
    });

    describe('Form Initialization', () => {
        test('should create login form with required elements', () => {
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            const loginButton = document.getElementById('login-btn');
            
            expect(emailInput).toBeTruthy();
            expect(passwordInput).toBeTruthy();
            expect(loginButton).toBeTruthy();
            
            expect(emailInput.type).toBe('email');
            expect(passwordInput.type).toBe('password');
            expect(emailInput.required).toBe(true);
            expect(passwordInput.required).toBe(true);
        });

        test('should have message containers', () => {
            const errorMessage = document.getElementById('error-message');
            const successMessage = document.getElementById('success-message');
            
            expect(errorMessage).toBeTruthy();
            expect(successMessage).toBeTruthy();
            expect(errorMessage.style.display).toBe('none');
            expect(successMessage.style.display).toBe('none');
        });
    });

    describe('Message Display', () => {
        test('should show error message', () => {
            const testMessage = 'Test error message';
            mockLoginComponent.showError(testMessage);
            
            const errorDiv = document.getElementById('error-message');
            expect(errorDiv.textContent).toBe(testMessage);
            expect(errorDiv.style.display).toBe('block');
        });

        test('should show success message', () => {
            const testMessage = 'Test success message';
            mockLoginComponent.showSuccess(testMessage);
            
            const successDiv = document.getElementById('success-message');
            expect(successDiv.textContent).toBe(testMessage);
            expect(successDiv.style.display).toBe('block');
        });

        test('should hide all messages', () => {
            mockLoginComponent.showError('Error');
            mockLoginComponent.showSuccess('Success');
            mockLoginComponent.hideMessages();
            
            const errorDiv = document.getElementById('error-message');
            const successDiv = document.getElementById('success-message');
            
            expect(errorDiv.style.display).toBe('none');
            expect(successDiv.style.display).toBe('none');
        });
    });

    describe('Authentication Process', () => {
        test('should authenticate valid user', async () => {
            const user = await mockLoginComponent.authenticateUser('admin@fooddelivery.com.ua', 'admin2024');
            
            expect(user).toBeTruthy();
            expect(user.email).toBe('admin@fooddelivery.com.ua');
            expect(user.name).toBe('Administrator');
            expect(user.role).toBe('admin');
            expect(user.password).toBeUndefined(); // Password should be removed
        });

        test('should reject invalid credentials', async () => {
            const user = await mockLoginComponent.authenticateUser('invalid@email.com', 'wrongpass');
            expect(user).toBeNull();
        });

        test('should reject empty credentials', async () => {
            const user1 = await mockLoginComponent.authenticateUser('', 'password');
            const user2 = await mockLoginComponent.authenticateUser('email@test.com', '');
            
            expect(user1).toBeNull();
            expect(user2).toBeNull();
        });
    });

    describe('Login Process Integration', () => {
        test('should process successful login', async () => {
            const result = await mockLoginComponent.processLogin('admin@fooddelivery.com.ua', 'admin2024');
            
            expect(result).toBe(true);
            
            // Check if success message is shown
            const successDiv = document.getElementById('success-message');
            expect(successDiv.textContent).toContain('Welcome');
            expect(successDiv.style.display).toBe('block');
            
            // Check if user data is stored
            const storedUser = JSON.parse(localStorage.getItem('user'));
            const storedToken = localStorage.getItem('token');
            
            expect(storedUser).toBeTruthy();
            expect(storedUser.email).toBe('admin@fooddelivery.com.ua');
            expect(storedToken).toBeTruthy();
            expect(storedToken).toMatch(/^token_/);
        }, 10000);

        test('should handle failed login', async () => {
            // Clear localStorage before the test
            localStorage.clear();
            
            const result = await mockLoginComponent.processLogin('invalid@email.com', 'wrongpass');
            
            expect(result).toBe(false);
            
            // Check if error message is shown
            const errorDiv = document.getElementById('error-message');
            expect(errorDiv.textContent).toBe('Invalid email or password');
            expect(errorDiv.style.display).toBe('block');
            
            // Check that no user data is stored
            const storedUser = localStorage.getItem('user');
            const storedToken = localStorage.getItem('token');
            
            expect(storedUser).toBeNull();
            expect(storedToken).toBeNull();
        }, 10000);

        test('should validate required fields', async () => {
            const result1 = await mockLoginComponent.processLogin('', 'password');
            const result2 = await mockLoginComponent.processLogin('email@test.com', '');
            
            expect(result1).toBe(false);
            expect(result2).toBe(false);
            
            const errorDiv = document.getElementById('error-message');
            expect(errorDiv.textContent).toBe('Email and password are required');
            expect(errorDiv.style.display).toBe('block');
        });
    });

    describe('localStorage Integration', () => {
        test('should store user data after successful login', async () => {
            // Clear localStorage mock calls
            if (localStorage.setItem.mockClear) {
                localStorage.setItem.mockClear();
            }
            
            await mockLoginComponent.processLogin('test@example.com', 'test123');
            
            expect(localStorage.setItem).toHaveBeenCalledWith(
                'user',
                expect.stringContaining('"email":"test@example.com"')
            );
            expect(localStorage.setItem).toHaveBeenCalledWith(
                'token',
                expect.stringMatching(/^token_\d+$/)
            );
        }, 10000);

        test('should not store data after failed login', async () => {
            if (localStorage.setItem.mockClear) {
                localStorage.setItem.mockClear();
            }
            
            await mockLoginComponent.processLogin('invalid@email.com', 'wrongpass');
            
            expect(localStorage.setItem).not.toHaveBeenCalled();
        }, 10000);
    });
});