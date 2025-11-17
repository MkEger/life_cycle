# FreshFood Delivery Website

A complete, responsive food delivery website built with HTML, CSS, and JavaScript, featuring both marketing pages and a full ordering system.

## 🌟 Features

### Marketing & Authentication
- **Landing Page**: Hero section, "How it Works", Featured Dishes, and FAQ sections
- **Login Page**: User authentication interface with social login options
- **Register Page**: New user registration form with validation
- **Account Page**: User profile management and order history
- **About Us Page**: Company mission, values, and story

### Food Ordering System
- **Dishes Page**: Browse 18 food items categorized as Food, Drinks, and Desserts
- **Shopping Cart**: Dynamic cart overlay with add/remove functionality and quantity controls
- **Payment Page**: Select payment method with conditional card details form
- **Address Page**: Complete delivery address form with validation
- **Confirmation Page**: Order confirmation with delivery status timeline

### Design & Technology
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Green Color Palette**: Consistent green (#2d8659 and #28a745) and white theme
- **Interactive Elements**: FAQ accordion, form validation, mobile menu, cart management
- **LocalStorage**: Persists cart data across sessions
- **No Dependencies**: Pure HTML, CSS, and JavaScript

## 📁 Project Structure

```
life_cycle/
├── index.html              # Landing page
├── dishes.html             # Food catalog/menu page
├── payment.html            # Payment information page
├── address.html            # Delivery address page
├── confirmation.html       # Order confirmation page
├── styles.css              # Ordering system styles
├── script.js               # Ordering system JavaScript
├── css/
│   └── styles.css         # Landing & auth pages styles
├── js/
│   └── script.js          # Landing & auth pages JavaScript
├── pages/
│   ├── login.html         # Login page
│   ├── register.html      # Registration page
│   ├── account.html       # User account page
│   └── about.html         # About us page
├── .gitignore             # Git ignore file
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- No build tools or dependencies required

### Installation

1. Clone the repository:
```bash
git clone https://github.com/MkEger/life_cycle.git
cd life_cycle
```

2. Open the website:
   - Simply open `index.html` in your web browser
   - Or use a local development server:
   
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js (http-server)
   npx http-server
   ```

3. Access the website at `http://localhost:8000` (if using a local server)

### Usage Flow

1. **Browse**: Start at `index.html` (landing page) to learn about the service
2. **Sign Up/Login**: Use the authentication pages to create an account
3. **Order Food**: Navigate to `dishes.html` to browse the menu
4. **Add to Cart**: Click "Add to Cart" on any dish
5. **Checkout**: Click the cart button, review items, and proceed to checkout
6. **Payment**: Select payment method and enter card details
7. **Delivery**: Fill in delivery address information
8. **Confirmation**: Receive order confirmation with tracking timeline

## 🎨 Design Features

### Color Palette
- **Primary Green**: #28a745 (Landing & Auth)
- **Ordering Green**: #2d8659 (Dishes, Cart, Checkout)
- **Dark Green**: #1e7e34, #236b47
- **Light Green**: #d4edda, #e8f5e9
- **Text Colors**: #333333 (dark), #666666 (light)

### Pages Overview

#### Marketing Pages
1. **Landing Page** (index.html) - Hero, features, FAQ
2. **About** (pages/about.html) - Company story and values
3. **Login** (pages/login.html) - Authentication
4. **Register** (pages/register.html) - New user signup
5. **Account** (pages/account.html) - Profile management

#### Ordering Pages
1. **Dishes** (dishes.html) - 18 food items in 3 categories
2. **Payment** (payment.html) - Payment method selection
3. **Address** (address.html) - Delivery information
4. **Confirmation** (confirmation.html) - Order tracking

## 🔧 Technical Details

### Cart System
- Stores cart items in localStorage
- Real-time quantity updates
- Price calculations
- Persistent across page navigation

### Form Validation
- Required field validation
- Email format validation
- Password confirmation
- Phone number formatting

### Responsive Design
- **Desktop**: 1200px and above
- **Tablet**: 768px - 1199px
- **Mobile**: Below 768px

Uses CSS Grid and Flexbox for adaptive layouts.

## ✨ JavaScript Features

### Landing Pages (js/script.js)
- Mobile menu toggle
- FAQ accordion
- Form validation
- Smooth scrolling
- Active navigation highlighting

### Ordering System (script.js)
- Cart management (add, remove, update)
- LocalStorage persistence
- Real-time total calculations
- Order summary display
- Payment method toggle
- Notification system

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 Customization

### Changing Colors
Edit CSS variables in the respective stylesheets.

### Adding Menu Items
Edit the `dishesData` object in `script.js`:

```javascript
const dishesData = {
    food: [
        { id: 1, name: 'New Item', icon: '🍔', price: 12.99, description: '...' },
        // Add more items
    ],
    // ...
};
```

### Modifying Content
- Edit HTML files directly to change text and structure
- Update images by replacing placeholder emojis
- Customize forms and validation in JavaScript files

## 🔒 Security Notes

- This is a **static frontend demo** - not production-ready
- No real authentication or payment processing
- All data is stored in browser localStorage
- Implement proper backend for production use

## 📱 Mobile Features

- Touch-friendly buttons and controls
- Responsive cart modal
- Optimized forms for mobile input
- Adaptive navigation menu

## 🚧 Future Enhancements

Potential features to add:
- Backend API integration
- Real authentication system
- Actual payment gateway
- Real-time order tracking
- User reviews and ratings
- Restaurant partner dashboard
- Push notifications
- Order history persistence

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👥 Authors

- **FreshFood Delivery Team** - Initial work

## 🙏 Acknowledgments

- Emoji icons for visual appeal
- Modern CSS Grid and Flexbox layouts
- Clean, semantic HTML structure
- localStorage API for data persistence
