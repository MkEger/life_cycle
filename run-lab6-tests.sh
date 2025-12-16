#!/bin/bash

# ?? ЛАБОРАТОРНА РОБОТА №6: ТЕСТУВАННЯ ТА ВАЛІДАЦІЯ
# ===============================================

echo "?? ЛАБОРАТОРНА РОБОТА №6: ТЕСТУВАННЯ ТА ВАЛІДАЦІЯ"
echo "==============================================="
echo ""

echo "?? МЕТА: Провести комплексне тестування системи Food Delivery"
echo "   Включає: Unit Tests + Component Tests + System Tests + API Tests"
echo ""

echo "?? ПІДГОТОВКА ТЕСТОВОГО СЕРЕДОВИЩА..."

# Перевірити наявність Node.js
if ! command -v node &> /dev/null; then
    echo "? Node.js не встановлено! Встановіть з https://nodejs.org"
    exit 1
fi

# Перейти в папку тестів
cd tests

# Встановити залежності якщо потрібно
if [ ! -d "node_modules" ]; then
    echo "?? Встановлення залежностей для тестування..."
    npm install
    if [ $? -ne 0 ]; then
        echo "? Помилка встановлення залежностей"
        exit 1
    fi
fi

echo ""
echo "? Тестове середовище готове!"
echo ""

echo "?? ВИБІР ТИПУ ТЕСТУВАННЯ:"
echo ""
echo "1. ?? Юніт-тести (Unit Tests)"
echo "2. ?? Компонентні тести (Component Tests)"
echo "3. ?? Системні тести (System Tests)"
echo "4. ?? API тести (потребує запущений сервер)"
echo "5. ?? Всі тести + покриття (Full Test Suite)"
echo "6. ?? Швидкий тест (основні функції)"
echo "7. ?? Генерувати звіт"
echo ""

read -p "Виберіть опцію (1-7): " choice

case $choice in
    1)
        echo ""
        echo "?? ЗАПУСК ЮНІТ-ТЕСТІВ..."
        echo "========================"
        npm run test:unit
        ;;
    2)
        echo ""
        echo "?? ЗАПУСК КОМПОНЕНТНИХ ТЕСТІВ..."
        echo "==============================="
        npm run test:component
        ;;
    3)
        echo ""
        echo "?? ЗАПУСК СИСТЕМНИХ ТЕСТІВ..."
        echo "============================="
        npm run test:system
        ;;
    4)
        echo ""
        echo "?? ЗАПУСК API ТЕСТІВ..."
        echo "======================"
        echo "??  Переконайтесь що сервер запущений (node server.js)"
        echo ""
        read -p "Натисніть Enter для продовження..."
        echo "Тестування API..."
        npm run test tests/api/api.test.js
        ;;
    5)
        echo ""
        echo "?? ПОВНЕ ТЕСТУВАННЯ З ПОКРИТТЯМ..."
        echo "================================="
        echo "Це займе кілька хвилин..."
        echo ""
        npm run test:coverage
        echo ""
        echo "?? Генерування детального звіту..."
        npm run test:all
        ;;
    6)
        echo ""
        echo "?? ШВИДКЕ ТЕСТУВАННЯ..."
        echo "======================"
        echo "Тестуємо основні функції..."
        npm test -- --testNamePattern="should" --verbose
        ;;
    7)
        echo ""
        echo "?? ГЕНЕРУВАННЯ ЗВІТУ..."
        echo "======================"
        echo "Створюємо детальний звіт про тестування..."
        
        # Створити HTML звіт
        cat > test-results.html << EOF
<!DOCTYPE html>
<html><head><title>Звіт про тестування</title></head>
<body><h1>?? Результати тестування Food Delivery</h1>
<p>Дата: $(date)</p>
<h2>Результати тестів:</h2><pre>
EOF

        npm run test:coverage > test-output.log 2>&1
        cat test-output.log >> test-results.html
        echo "</pre></body></html>" >> test-results.html
        
        echo "? Звіт створено: tests/test-results.html"
        if command -v xdg-open &> /dev/null; then
            xdg-open test-results.html
        elif command -v open &> /dev/null; then
            open test-results.html
        fi
        ;;
    *)
        echo "? Невірний вибір"
        exit 1
        ;;
esac

echo ""
echo "?? ТЕСТУВАННЯ ЗАВЕРШЕНО!"
echo ""
echo "?? РЕЗУЛЬТАТИ:"
echo "   ?? Файли тестів: tests/**/*.test.js"
echo "   ?? Звіт покриття: tests/coverage/"
echo "   ?? Детальний звіт: tests/TEST_REPORT.md"
echo ""
echo "?? ДЛЯ ЛАБОРАТОРНОЇ РОБОТИ:"
echo "   1. Результати тестування: tests/test-results.html"
echo "   2. Покриття коду: tests/coverage/lcov-report/index.html"
echo "   3. Повний звіт: tests/TEST_REPORT.md"
echo ""

echo "?? РЕКОМЕНДАЦІЇ:"
if [ "$choice" = "5" ]; then
    echo "   ? Відкрийте coverage/lcov-report/index.html для детального покриття"
    echo "   ? Перевірте TEST_REPORT.md для висновків"
fi
if [ "$choice" = "4" ]; then
    echo "   ??  Якщо API тести провалились - запустіть сервер: node server.js"
fi

echo ""
read -p "Натисніть Enter для завершення..."

cd ..