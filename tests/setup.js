/**
 * @jest-environment jsdom
 */

// Test setup file
// Configures testing environment and global utilities

// Ensure we're in a DOM environment
require('jest-environment-jsdom');

// Mock localStorage for tests
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: jest.fn((key) => store[key] || null),
        setItem: jest.fn((key, value) => { store[key] = value.toString(); }),
        removeItem: jest.fn((key) => { delete store[key]; }),
        clear: jest.fn(() => { store = {}; }),
        get length() { return Object.keys(store).length; },
        key: jest.fn((index) => Object.keys(store)[index] || null)
    };
})();

// Ensure localStorage is properly mocked as a spy
Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true
});
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = (() => {
    let store = {};
    return {
        getItem: jest.fn((key) => store[key] || null),
        setItem: jest.fn((key, value) => { store[key] = value.toString(); }),
        removeItem: jest.fn((key) => { delete store[key]; }),
        clear: jest.fn(() => { store = {}; }),
        get length() { return Object.keys(store).length; },
        key: jest.fn((index) => Object.keys(store)[index] || null)
    };
})();

// Ensure sessionStorage is properly mocked as a spy  
Object.defineProperty(window, 'sessionStorage', {
    value: sessionStorageMock,
    writable: true
});
global.sessionStorage = sessionStorageMock;

// Mock fetch API
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({}),
        text: () => Promise.resolve(''),
        headers: {
            get: (name) => {
                if (name === 'content-type') return 'application/json';
                if (name === 'access-control-allow-origin') return '*';
                return null;
            }
        }
    })
);

// Mock window.location
delete window.location;
window.location = {
    href: 'http://localhost:3000',
    pathname: '/',
    search: '',
    hash: ''
};

// Mock console methods to reduce noise in tests
global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
};

// Global test utilities
global.testUtils = {
    // Create mock user for tests
    createMockUser: (role = 'user') => ({
        id: Math.floor(Math.random() * 1000),
        email: `test${Math.random()}@example.com`,
        name: `Test User ${Math.random()}`,
        role: role,
        phone: '+380501234567'
    }),
    
    // Create mock order for tests
    createMockOrder: () => ({
        id: Math.floor(Math.random() * 1000),
        restaurant: 'Test Restaurant',
        items: [
            { name: 'Test Dish', quantity: 1, price: 10.99 }
        ],
        total: 10.99,
        status: 'pending',
        date: new Date().toISOString()
    }),
    
    // Setup DOM elements for tests
    setupTestDOM: () => {
        document.body.innerHTML = `
            <div id="app">
                <div id="notification" style="display: none;"></div>
                <div class="container"></div>
            </div>
        `;
    },
    
    // Clean up after tests
    cleanup: () => {
        document.body.innerHTML = '';
        if (localStorage.clear && localStorage.clear.mockClear) {
            localStorage.clear.mockClear();
        }
        if (sessionStorage.clear && sessionStorage.clear.mockClear) {
            sessionStorage.clear.mockClear();
        }
        if (fetch && fetch.mockClear) {
            fetch.mockClear();
        }
    }
};

// Setup test environment before each test
beforeEach(() => {
    // Clear all mocks safely
    if (localStorage.getItem && localStorage.getItem.mockClear) {
        localStorage.getItem.mockClear();
    }
    if (localStorage.setItem && localStorage.setItem.mockClear) {
        localStorage.setItem.mockClear();
    }
    if (localStorage.removeItem && localStorage.removeItem.mockClear) {
        localStorage.removeItem.mockClear();
    }
    if (localStorage.clear && localStorage.clear.mockClear) {
        localStorage.clear.mockClear();
    }
    
    if (sessionStorage.getItem && sessionStorage.getItem.mockClear) {
        sessionStorage.getItem.mockClear();
    }
    if (sessionStorage.setItem && sessionStorage.setItem.mockClear) {
        sessionStorage.setItem.mockClear();
    }
    if (sessionStorage.removeItem && sessionStorage.removeItem.mockClear) {
        sessionStorage.removeItem.mockClear();
    }
    if (sessionStorage.clear && sessionStorage.clear.mockClear) {
        sessionStorage.clear.mockClear();
    }
    
    if (fetch && fetch.mockClear) {
        fetch.mockClear();
    }
    
    // Reset window.location
    window.location.href = 'http://localhost:3000';
    window.location.pathname = '/';
    window.location.search = '';
    window.location.hash = '';
});

// Cleanup after each test
afterEach(() => {
    testUtils.cleanup();
    // Clear all timers лише якщо використовуються fake timers
    if (jest.isMockFunction(setTimeout)) {
        jest.clearAllTimers();
        jest.useRealTimers();
    }
});

// Setup timers (використовуємо real timers за замовчуванням для стабільності)
beforeEach(() => {
    // Не використовуємо fake timers за замовчуванням
    jest.useRealTimers();
});

console.log('? Test environment setup complete');