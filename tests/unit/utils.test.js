/**
 * Unit Tests for Utility Functions
 * Tests helper functions and utilities
 */

// Mock utility functions
const mockUtilityFunctions = {
    // Format date for display
    formatDate: (dateString) => {
        if (!dateString) return 'Invalid date';
        
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Invalid date';
            
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return 'Invalid date';
        }
    },

    // Generate unique ID
    generateId: (prefix = '') => {
        return `${prefix}${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },

    // Validate phone number
    validatePhone: (phone) => {
        if (!phone) return false;
        // Ukrainian phone number format
        const phoneRegex = /^\+380\d{9}$/;
        return phoneRegex.test(phone);
    },

    // Calculate distance (simplified Haversine formula)
    calculateDistance: (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c; // Distance in km
    },

    // Sanitize HTML input
    sanitizeHTML: (str) => {
        if (!str) return '';
        
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '/': '&#x2F;'
        };
        
        return str.replace(/[&<>"'/]/g, (match) => map[match]);
    },

    // Debounce function
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Deep clone object
    deepClone: (obj) => {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => mockUtilityFunctions.deepClone(item));
        
        const cloned = {};
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                cloned[key] = mockUtilityFunctions.deepClone(obj[key]);
            }
        }
        return cloned;
    },

    // Check if object is empty
    isEmpty: (obj) => {
        if (obj === null || obj === undefined) return true;
        if (obj === 0 || obj === false) return false; // 0 and false are not empty
        if (typeof obj === 'string') return obj.trim() === '';
        if (Array.isArray(obj)) return obj.length === 0;
        if (typeof obj === 'object') return Object.keys(obj).length === 0;
        return false;
    },

    // Capitalize first letter
    capitalize: (str) => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    },

    // Convert to currency format
    toCurrency: (amount, currency = 'UAH') => {
        if (amount === null || amount === undefined || isNaN(amount)) return `0.00 ${currency}`;
        
        const formatted = parseFloat(amount).toFixed(2);
        return `${formatted} ${currency}`;
    }
};

describe('Utility Functions Unit Tests', () => {
    describe('formatDate()', () => {
        test('should format valid date string', () => {
            const date = '2024-01-15T18:30:00Z';
            const formatted = mockUtilityFunctions.formatDate(date);
            
            expect(formatted).toContain('January');
            expect(formatted).toContain('15');
            expect(formatted).toContain('2024');
        });

        test('should handle invalid date', () => {
            expect(mockUtilityFunctions.formatDate('invalid')).toBe('Invalid date');
            expect(mockUtilityFunctions.formatDate(null)).toBe('Invalid date');
            expect(mockUtilityFunctions.formatDate('')).toBe('Invalid date');
        });

        test('should handle Date object', () => {
            const date = new Date('2024-01-15T18:30:00Z');
            const formatted = mockUtilityFunctions.formatDate(date.toISOString());
            
            expect(formatted).toContain('January');
        });
    });

    describe('generateId()', () => {
        test('should generate unique IDs', () => {
            const id1 = mockUtilityFunctions.generateId();
            const id2 = mockUtilityFunctions.generateId();
            
            expect(id1).not.toBe(id2);
            expect(typeof id1).toBe('string');
            expect(id1.length).toBeGreaterThan(0);
        });

        test('should include prefix if provided', () => {
            const id = mockUtilityFunctions.generateId('order_');
            expect(id).toMatch(/^order_/);
        });

        test('should work without prefix', () => {
            const id = mockUtilityFunctions.generateId();
            expect(typeof id).toBe('string');
            expect(id.length).toBeGreaterThan(10);
        });
    });

    describe('validatePhone()', () => {
        test('should validate Ukrainian phone numbers', () => {
            expect(mockUtilityFunctions.validatePhone('+380501234567')).toBe(true);
            expect(mockUtilityFunctions.validatePhone('+380671234567')).toBe(true);
            expect(mockUtilityFunctions.validatePhone('+380951234567')).toBe(true);
        });

        test('should reject invalid phone numbers', () => {
            expect(mockUtilityFunctions.validatePhone('1234567890')).toBe(false);
            expect(mockUtilityFunctions.validatePhone('+1234567890')).toBe(false);
            expect(mockUtilityFunctions.validatePhone('+38050123456')).toBe(false);
            expect(mockUtilityFunctions.validatePhone('')).toBe(false);
            expect(mockUtilityFunctions.validatePhone(null)).toBe(false);
        });
    });

    describe('calculateDistance()', () => {
        test('should calculate distance between coordinates', () => {
            // Kyiv to Lviv approximately
            const distance = mockUtilityFunctions.calculateDistance(50.4501, 30.5234, 49.8383, 24.0232);
            
            expect(distance).toBeGreaterThan(400);
            expect(distance).toBeLessThan(600);
        });

        test('should return 0 for same coordinates', () => {
            const distance = mockUtilityFunctions.calculateDistance(50.4501, 30.5234, 50.4501, 30.5234);
            expect(distance).toBeCloseTo(0, 5);
        });

        test('should handle negative coordinates', () => {
            const distance = mockUtilityFunctions.calculateDistance(-50.4501, -30.5234, 49.8383, 24.0232);
            expect(distance).toBeGreaterThan(0);
        });
    });

    describe('sanitizeHTML()', () => {
        test('should sanitize dangerous HTML', () => {
            const input = '<script>alert("xss")</script>';
            const sanitized = mockUtilityFunctions.sanitizeHTML(input);
            
            expect(sanitized).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;');
        });

        test('should handle empty input', () => {
            expect(mockUtilityFunctions.sanitizeHTML('')).toBe('');
            expect(mockUtilityFunctions.sanitizeHTML(null)).toBe('');
            expect(mockUtilityFunctions.sanitizeHTML(undefined)).toBe('');
        });

        test('should sanitize all dangerous characters', () => {
            const input = '&<>"\'\/';
            const sanitized = mockUtilityFunctions.sanitizeHTML(input);
            
            expect(sanitized).toBe('&amp;&lt;&gt;&quot;&#x27;&#x2F;');
        });
    });

    describe('deepClone()', () => {
        test('should clone simple object', () => {
            const original = { name: 'John', age: 30 };
            const cloned = mockUtilityFunctions.deepClone(original);
            
            expect(cloned).toEqual(original);
            expect(cloned).not.toBe(original);
        });

        test('should clone nested object', () => {
            const original = {
                user: { name: 'John', details: { age: 30 } },
                items: [1, 2, 3]
            };
            const cloned = mockUtilityFunctions.deepClone(original);
            
            expect(cloned).toEqual(original);
            expect(cloned.user).not.toBe(original.user);
            expect(cloned.items).not.toBe(original.items);
        });

        test('should handle null and primitive values', () => {
            expect(mockUtilityFunctions.deepClone(null)).toBe(null);
            expect(mockUtilityFunctions.deepClone(42)).toBe(42);
            expect(mockUtilityFunctions.deepClone('string')).toBe('string');
        });

        test('should clone Date objects', () => {
            const original = new Date('2024-01-15');
            const cloned = mockUtilityFunctions.deepClone(original);
            
            expect(cloned).toEqual(original);
            expect(cloned).not.toBe(original);
            expect(cloned instanceof Date).toBe(true);
        });
    });

    describe('isEmpty()', () => {
        test('should detect empty values', () => {
            expect(mockUtilityFunctions.isEmpty('')).toBe(true);
            expect(mockUtilityFunctions.isEmpty('   ')).toBe(true);
            expect(mockUtilityFunctions.isEmpty([])).toBe(true);
            expect(mockUtilityFunctions.isEmpty({})).toBe(true);
            expect(mockUtilityFunctions.isEmpty(null)).toBe(true);
            expect(mockUtilityFunctions.isEmpty(undefined)).toBe(true);
        });

        test('should detect non-empty values', () => {
            expect(mockUtilityFunctions.isEmpty('text')).toBe(false);
            expect(mockUtilityFunctions.isEmpty([1, 2, 3])).toBe(false);
            expect(mockUtilityFunctions.isEmpty({ key: 'value' })).toBe(false);
            expect(mockUtilityFunctions.isEmpty(0)).toBe(false);
            expect(mockUtilityFunctions.isEmpty(false)).toBe(false);
        });
    });

    describe('capitalize()', () => {
        test('should capitalize first letter', () => {
            expect(mockUtilityFunctions.capitalize('hello')).toBe('Hello');
            expect(mockUtilityFunctions.capitalize('WORLD')).toBe('World');
            expect(mockUtilityFunctions.capitalize('tESt')).toBe('Test');
        });

        test('should handle edge cases', () => {
            expect(mockUtilityFunctions.capitalize('')).toBe('');
            expect(mockUtilityFunctions.capitalize(null)).toBe('');
            expect(mockUtilityFunctions.capitalize('a')).toBe('A');
        });
    });

    describe('toCurrency()', () => {
        test('should format currency correctly', () => {
            expect(mockUtilityFunctions.toCurrency(123.45)).toBe('123.45 UAH');
            expect(mockUtilityFunctions.toCurrency(100, 'USD')).toBe('100.00 USD');
            expect(mockUtilityFunctions.toCurrency(5)).toBe('5.00 UAH');
        });

        test('should handle invalid amounts', () => {
            expect(mockUtilityFunctions.toCurrency('invalid')).toBe('0.00 UAH');
            expect(mockUtilityFunctions.toCurrency(null)).toBe('0.00 UAH');
            expect(mockUtilityFunctions.toCurrency(undefined)).toBe('0.00 UAH');
        });

        test('should handle decimal numbers', () => {
            expect(mockUtilityFunctions.toCurrency(123.456)).toBe('123.46 UAH');
            expect(mockUtilityFunctions.toCurrency(0.1)).toBe('0.10 UAH');
        });
    });
});