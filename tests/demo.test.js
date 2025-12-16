/**
 * Простий демо тест - має завжди працювати
 */

describe('Демо тести для Лабораторної роботи 6', () => {
    test('Перевірка базової функціональності JavaScript', () => {
        expect(1 + 1).toBe(2);
        expect('hello').toBe('hello');
        expect(true).toBe(true);
    });

    test('Перевірка роботи з масивами', () => {
        const array = [1, 2, 3];
        expect(array.length).toBe(3);
        expect(array[0]).toBe(1);
    });

    test('Перевірка роботи з об\'єктами', () => {
        const user = { name: 'Test', role: 'user' };
        expect(user.name).toBe('Test');
        expect(user).toHaveProperty('role');
    });

    test('Перевірка простої функції', () => {
        const add = (a, b) => a + b;
        expect(add(2, 3)).toBe(5);
        expect(add(0, 0)).toBe(0);
    });

    test('Перевірка роботи з рядками', () => {
        const text = 'Food Delivery System';
        expect(text).toContain('Food');
        expect(text.length).toBeGreaterThan(5);
    });
});

console.log('? Демо тест завантажений успішно!');