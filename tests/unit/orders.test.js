/**
 * Unit Tests for Order Management Functions
 * Tests order calculation, validation, and state management
 */

// Mock order functions
const mockOrderFunctions = {
    // Calculate order total
    calculateTotal: (items) => {
        if (!Array.isArray(items)) return 0;
        
        return items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    },

    // Calculate tax
    calculateTax: (subtotal, taxRate = 0.1) => {
        return subtotal * taxRate;
    },

    // Calculate delivery fee
    calculateDeliveryFee: (distance, orderTotal) => {
        // Free delivery for orders over 30
        if (orderTotal >= 30) return 0;
        
        // Base fee 5, plus 1 per km
        return Math.max(5, distance * 1);
    },

    // Validate order
    validateOrder: (order) => {
        const errors = [];
        
        if (!order) {
            errors.push('Order is required');
            return errors;
        }
        
        if (!order.items || !Array.isArray(order.items) || order.items.length === 0) {
            errors.push('Order must have at least one item');
        }
        
        if (!order.customerInfo) {
            errors.push('Customer information is required');
        } else {
            if (!order.customerInfo.name) errors.push('Customer name is required');
            if (!order.customerInfo.phone) errors.push('Customer phone is required');
            if (!order.customerInfo.address) errors.push('Delivery address is required');
        }
        
        // Validate items
        if (order.items) {
            order.items.forEach((item, index) => {
                if (!item.name) errors.push(`Item ${index + 1}: name is required`);
                if (!item.price || item.price <= 0) errors.push(`Item ${index + 1}: valid price is required`);
                if (!item.quantity || item.quantity <= 0) errors.push(`Item ${index + 1}: valid quantity is required`);
            });
        }
        
        return errors;
    },

    // Create order
    createOrder: (items, customerInfo, restaurantId) => {
        const subtotal = mockOrderFunctions.calculateTotal(items);
        const tax = mockOrderFunctions.calculateTax(subtotal);
        const deliveryFee = mockOrderFunctions.calculateDeliveryFee(5, subtotal); // Assume 5km distance
        const total = subtotal + tax + deliveryFee;
        
        return {
            id: `order_${Date.now()}`,
            restaurantId,
            items,
            customerInfo,
            subtotal: Number(subtotal.toFixed(2)),
            tax: Number(tax.toFixed(2)),
            deliveryFee: Number(deliveryFee.toFixed(2)),
            total: Number(total.toFixed(2)),
            status: 'pending',
            createdAt: new Date().toISOString()
        };
    },

    // Update order status
    updateOrderStatus: (order, newStatus) => {
        const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivering', 'delivered', 'cancelled'];
        
        if (!validStatuses.includes(newStatus)) {
            throw new Error(`Invalid status: ${newStatus}`);
        }
        
        return {
            ...order,
            status: newStatus,
            updatedAt: new Date().toISOString()
        };
    },

    // Format price for display
    formatPrice: (price) => {
        return `$${price.toFixed(2)}`;
    },

    // Generate order summary
    generateOrderSummary: (order) => {
        return {
            orderId: order.id,
            itemCount: order.items.length,
            totalItems: order.items.reduce((sum, item) => sum + item.quantity, 0),
            subtotal: order.subtotal,
            total: order.total,
            status: order.status
        };
    }
};

describe('Order Functions Unit Tests', () => {
    describe('calculateTotal()', () => {
        test('should calculate correct total for multiple items', () => {
            const items = [
                { name: 'Pizza', price: 12.99, quantity: 2 },
                { name: 'Drink', price: 2.50, quantity: 1 }
            ];
            
            const total = mockOrderFunctions.calculateTotal(items);
            expect(total).toBe(28.48); // (12.99 * 2) + (2.50 * 1)
        });

        test('should return 0 for empty items', () => {
            expect(mockOrderFunctions.calculateTotal([])).toBe(0);
            expect(mockOrderFunctions.calculateTotal(null)).toBe(0);
            expect(mockOrderFunctions.calculateTotal(undefined)).toBe(0);
        });

        test('should handle single item', () => {
            const items = [{ name: 'Burger', price: 8.99, quantity: 1 }];
            const total = mockOrderFunctions.calculateTotal(items);
            expect(total).toBe(8.99);
        });

        test('should handle decimal quantities', () => {
            const items = [{ name: 'Salad', price: 5.00, quantity: 1.5 }];
            const total = mockOrderFunctions.calculateTotal(items);
            expect(total).toBe(7.50);
        });
    });

    describe('calculateTax()', () => {
        test('should calculate correct tax with default rate', () => {
            const tax = mockOrderFunctions.calculateTax(100);
            expect(tax).toBe(10); // 10% of 100
        });

        test('should calculate tax with custom rate', () => {
            const tax = mockOrderFunctions.calculateTax(100, 0.15);
            expect(tax).toBe(15); // 15% of 100
        });

        test('should handle zero subtotal', () => {
            const tax = mockOrderFunctions.calculateTax(0);
            expect(tax).toBe(0);
        });
    });

    describe('calculateDeliveryFee()', () => {
        test('should return 0 for orders over 30', () => {
            const fee = mockOrderFunctions.calculateDeliveryFee(10, 35);
            expect(fee).toBe(0);
        });

        test('should calculate distance-based fee for small orders', () => {
            const fee = mockOrderFunctions.calculateDeliveryFee(3, 20);
            expect(fee).toBe(5); // Base fee of 5 (3km < base fee)
        });

        test('should calculate distance-based fee for long distance', () => {
            const fee = mockOrderFunctions.calculateDeliveryFee(10, 20);
            expect(fee).toBe(10); // 1 per km
        });
    });

    describe('validateOrder()', () => {
        const validOrder = {
            items: [
                { name: 'Pizza', price: 12.99, quantity: 1 }
            ],
            customerInfo: {
                name: 'John Doe',
                phone: '+1234567890',
                address: '123 Main St'
            }
        };

        test('should pass validation for valid order', () => {
            const errors = mockOrderFunctions.validateOrder(validOrder);
            expect(errors).toHaveLength(0);
        });

        test('should require order object', () => {
            const errors = mockOrderFunctions.validateOrder(null);
            expect(errors).toContain('Order is required');
        });

        test('should require items', () => {
            const order = { ...validOrder, items: [] };
            const errors = mockOrderFunctions.validateOrder(order);
            expect(errors).toContain('Order must have at least one item');
        });

        test('should require customer info', () => {
            const order = { ...validOrder, customerInfo: null };
            const errors = mockOrderFunctions.validateOrder(order);
            expect(errors).toContain('Customer information is required');
        });

        test('should validate item properties', () => {
            const order = {
                ...validOrder,
                items: [
                    { name: '', price: -1, quantity: 0 }
                ]
            };
            const errors = mockOrderFunctions.validateOrder(order);
            expect(errors.length).toBeGreaterThan(0);
        });
    });

    describe('createOrder()', () => {
        const items = [
            { name: 'Pizza', price: 12.99, quantity: 1 }
        ];
        const customerInfo = {
            name: 'John Doe',
            phone: '+1234567890',
            address: '123 Main St'
        };

        test('should create order with correct structure', () => {
            const order = mockOrderFunctions.createOrder(items, customerInfo, 1);
            
            expect(order).toHaveProperty('id');
            expect(order).toHaveProperty('restaurantId', 1);
            expect(order).toHaveProperty('items', items);
            expect(order).toHaveProperty('customerInfo', customerInfo);
            expect(order).toHaveProperty('subtotal');
            expect(order).toHaveProperty('tax');
            expect(order).toHaveProperty('deliveryFee');
            expect(order).toHaveProperty('total');
            expect(order).toHaveProperty('status', 'pending');
            expect(order).toHaveProperty('createdAt');
        });

        test('should calculate totals correctly', () => {
            const order = mockOrderFunctions.createOrder(items, customerInfo, 1);
            
            expect(order.subtotal).toBe(12.99);
            expect(order.tax).toBe(1.30); // 10% of 12.99, rounded
            expect(order.deliveryFee).toBe(5); // Base delivery fee
            expect(order.total).toBe(19.29); // 12.99 + 1.30 + 5.00
        });
    });

    describe('updateOrderStatus()', () => {
        const order = { id: '123', status: 'pending' };

        test('should update status correctly', () => {
            const updatedOrder = mockOrderFunctions.updateOrderStatus(order, 'confirmed');
            
            expect(updatedOrder.status).toBe('confirmed');
            expect(updatedOrder).toHaveProperty('updatedAt');
            expect(updatedOrder.id).toBe(order.id);
        });

        test('should reject invalid status', () => {
            expect(() => {
                mockOrderFunctions.updateOrderStatus(order, 'invalid');
            }).toThrow('Invalid status: invalid');
        });
    });

    describe('formatPrice()', () => {
        test('should format price correctly', () => {
            expect(mockOrderFunctions.formatPrice(12.99)).toBe('$12.99');
            expect(mockOrderFunctions.formatPrice(5)).toBe('$5.00');
            expect(mockOrderFunctions.formatPrice(0.5)).toBe('$0.50');
        });
    });

    describe('generateOrderSummary()', () => {
        test('should generate correct summary', () => {
            const order = {
                id: 'order_123',
                items: [
                    { name: 'Pizza', quantity: 2 },
                    { name: 'Drink', quantity: 1 }
                ],
                subtotal: 25.98,
                total: 32.28,
                status: 'pending'
            };

            const summary = mockOrderFunctions.generateOrderSummary(order);
            
            expect(summary.orderId).toBe('order_123');
            expect(summary.itemCount).toBe(2);
            expect(summary.totalItems).toBe(3); // 2 + 1
            expect(summary.subtotal).toBe(25.98);
            expect(summary.total).toBe(32.28);
            expect(summary.status).toBe('pending');
        });
    });
});