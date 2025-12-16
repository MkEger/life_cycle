# ?? **Інструкція з запуску тестів - Лабораторна робота №6**

## ?? **Мета лабораторної роботи**

Провести комплексне тестування системи Food Delivery, включаючи:
- **Юніт-тестування** (Unit Testing) - тестування окремих функцій
- **Компонентне тестування** (Component Testing) - тестування інтеграцій
- **Системне тестування** (System Testing) - тестування повних сценаріїв
- **API тестування** - тестування серверних ендпоінтів

## ?? **Передумови**

1. **Node.js** встановлений (версія 16+)
2. **npm** або **yarn** пакетний менеджер
3. **Git** для клонування репозиторію
4. **Браузер** для перегляду HTML звітів

## ?? **Швидкий старт**

### **Варіант 1: Найпростіший (рекомендовано)**
```cmd
# В корневій папці проекту запустіть:
simple-test-runner.bat
```

### **Варіант 2: Повний функціонал (Windows CMD)**
```batch
# Запустіть в корневій папці проекту
run-lab6-tests.bat
```

### **Варіант 3: PowerShell версія**
```powershell
# Запустіть в PowerShell:
.\run-lab6-tests.ps1
```

### **Варіант 4: Ручний запуск**
```bash
# 1. Перейдіть в папку тестів
cd tests

# 2. Встановіть залежності
npm install

# 3. Запустіть потрібний тип тестів (див. нижче)
```

---

## ?? **Типи тестування**

### **?? 1. Юніт-тести (Unit Tests)**
Тестують окремі функції в ізоляції:

```bash
cd tests
npm run test:unit
```

**Що тестується:**
- Функції аутентифікації (`auth.test.js`)
- Логіка замовлень (`orders.test.js`)
- Утилітарні функції (`utils.test.js`)

### **?? 2. Компонентні тести (Component Tests)**
Тестують взаємодію між модулями:

```bash
cd tests
npm run test:component
```

**Що тестується:**
- Компонент логіну (`login.test.js`)
- Компонент кошика (`cart.test.js`)

### **?? 3. Системні тести (System Tests)**
Тестують повні користувацькі сценарії:

```bash
cd tests
npm run test:system
```

**Що тестується:**
- End-to-end workflow (`end-to-end.test.js`)
- Повні користувацькі сценарії
- Інтеграція всієї системи

### **?? 4. API тести**
Тестують серверні ендпоінти:

```bash
# ВАЖЛИВО: Спочатку запустіть сервер в іншому терміналі
node server.js

# Потім в новому терміналі:
cd tests
npm run test tests/api/api.test.js
```

**Що тестується:**
- REST API ендпоінти
- HTTP статус коди
- Структура JSON відповідей
- Обробка помилок

### **?? 5. Повне тестування з покриттям**
Запускає всі тести + генерує звіт покриття:

```bash
cd tests
npm run test:coverage
```

---

## ?? **Детальні команди**

### **Встановлення залежностей**
```bash
cd tests
npm install
```

### **Окремі типи тестів**
```bash
# Юніт-тести
npm run test:unit

# Компонентні тести  
npm run test:component

# Системні тести
npm run test:system

# API тести (сервер має бути запущений)
npm run test:api

# Всі тести
npm run test:all

# Тести з покриттям
npm run test:coverage

# Watch mode (автоматичний перезапуск)
npm run test:watch
```

### **Додаткові опції Jest**
```bash
# Детальний вивід
npm test -- --verbose

# Тести з певним патерном
npm test -- --testNamePattern="should"

# Один конкретний файл
npm test auth.test.js

# З покриттям для одного файлу
npm test auth.test.js -- --coverage
```

---

## ?? **Інтерпретація результатів**

### **Успішний запуск тестів**
```
PASS tests/unit/auth.test.js
  Auth Functions Unit Tests
    getTestUsers()
      ? should return array of test users (5ms)
      ? should have required user properties (2ms)
    validateEmail()
      ? should validate correct email (1ms)
      ? should reject invalid email (2ms)

Test Suites: 1 passed, 1 total
Tests:       15 passed, 15 total
Snapshots:   0 total
Time:        2.456s
```

### **Звіт покриття**
```
--------------------|---------|----------|---------|---------|-------------------
File                | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
--------------------|---------|----------|---------|---------|-------------------
All files           |   85.23 |    78.94 |   92.11 |   84.75 |
 auth.test.js       |   95.24 |    88.89 |   100.0 |   94.74 | 25,67,89
 orders.test.js     |   92.31 |    76.47 |   100.0 |   91.67 | 45,123
 utils.test.js      |   90.12 |    82.35 |   95.00 |   89.23 | 78,156,234
--------------------|---------|----------|---------|---------|-------------------
```

### **Помилки та їх вирішення**
```
FAIL tests/unit/auth.test.js
  ? validateEmail › should reject invalid email

    expect(received).toBe(expected)
    
    Expected: false
    Received: true
```

**Типові помилки:**
1. **Сервер не запущений** - для API тестів потрібно `node server.js`
2. **Залежності не встановлені** - запустіть `npm install` в папці tests
3. **Node.js не встановлений** - завантажте з https://nodejs.org

---

## ?? **Структура тестових файлів**

```
tests/
??? package.json              # Конфігурація тестів
??? setup.js                  # Налаштування тестового середовища
??? unit/                     # Юніт-тести
?   ??? auth.test.js          #   - Тести аутентифікації
?   ??? orders.test.js        #   - Тести замовлень
?   ??? utils.test.js         #   - Тести утиліт
??? component/                # Компонентні тести
?   ??? login.test.js         #   - Тести форми логіну
?   ??? cart.test.js          #   - Тести кошика
??? system/                   # Системні тести
?   ??? end-to-end.test.js    #   - End-to-end тести
??? api/                      # API тести
?   ??? api.test.js           #   - Jest API тести
?   ??? food-delivery-api.postman_collection.json  # Postman тести
??? coverage/                 # Звіти покриття (генерується)
??? TEST_REPORT.md            # Детальний звіт
```

---

## ?? **Звіти та результати**

### **1. HTML звіт покриття**
```bash
# Після npm run test:coverage відкрийте:
tests/coverage/lcov-report/index.html
```

### **2. Детальний звіт**
```bash
# Прочитайте повний звіт:
tests/TEST_REPORT.md
```

### **3. JSON результати**
```bash
# Для автоматичної обробки:
npm test -- --json > results.json
```

---

## ?? **Налагодження тестів**

### **Debug режим в VS Code**
1. Встановіть breakpoint в тестовому файлі
2. Натисніть F5 або `Debug > Start Debugging`
3. Виберіть конфігурацію Jest

### **Console logging**
```javascript
// В тестових файлах:
console.log('Debug info:', someVariable);

// Запустіть з виводом:
npm test -- --verbose
```

### **Ізоляція проблемних тестів**
```bash
# Запустіть тільки один тест
npm test -- --testNamePattern="should validate email"

# Запустіть один файл
npm test auth.test.js

# Пропустити тести
npm test -- --testPathIgnorePatterns="system"
```

---

## ?? **Критерії оцінювання лабораторної**

### **Обов'язково для здачі:**

1. **? Всі тести пройдені** - 0 failed tests
2. **? Покриття > 80%** - у всіх категоріях
3. **? Звіт заповнений** - TEST_REPORT.md
4. **? Документація** - README з результатами

### **Додаткові бали:**

1. **+1 бал** - Власні тести додані
2. **+1 бал** - API тести з Postman
3. **+1 бал** - CI/CD конфігурація
4. **+1 бал** - Performance тести

---

## ?? **Часті проблеми та рішення**

### **Проблема 1: "Cannot find module jest"**
```bash
# Рішення:
cd tests
npm install
```

### **Проблема 2: "ECONNREFUSED" для API тестів**
```bash
# Рішення: Запустіть сервер в іншому терміналі
node server.js

# Потім запустіть API тести
cd tests
npm run test tests/api/api.test.js
```

### **Проблема 3: "Test timeout"**
```bash
# Збільшіть timeout в jest.config.js:
{
  "testTimeout": 10000
}
```

### **Проблема 4: "Coverage below threshold"**
```bash
# Подивіться які файли не покриті:
npm run test:coverage

# Відкрийте coverage/lcov-report/index.html
# Додайте тести для непокритих частин
```

---

## ?? **Підтримка**

**Якщо виникли проблеми:**
1. Перевірте що Node.js встановлений: `node --version`
2. Перевірте що npm працює: `npm --version`
3. Очистіть кеш: `npm cache clean --force`
4. Видаліть node_modules і переустановіть: `rm -rf node_modules && npm install`

**Корисні команди для діагностики:**
```bash
# Інформація про систему
node --version
npm --version

# Список встановлених пакетів
npm list

# Перевірка конфігурації Jest
npx jest --showConfig

# Детальна діагностика
npm test -- --detectOpenHandles --forceExit
```

---

**?? Успішного тестування!**