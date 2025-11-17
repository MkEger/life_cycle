# FoodHub - Food Delivery Website

A modern, responsive food delivery web application with a clean design and intuitive user interface.

## Features

### Pages
- **Landing Page** (`index.html`): Hero section, features showcase, how it works, FAQ, and footer
- **Login/Register Page** (`login.html`): User authentication with side-by-side login and registration forms
- **Menu Page** (`menu.html`): Browse food items organized by categories (Food, Drinks, Desserts)

### Design System
- **Primary Color**: #3DAB51 (Green)
- **Consistent Typography**: System font stack for optimal performance
- **Responsive Layout**: Mobile-first design that works on all screen sizes
- **Modern CSS**: Uses Flexbox and Grid for layouts
- **Smooth Animations**: Transitions and hover effects throughout

### Functionality
- ✅ Responsive navigation with mobile hamburger menu
- ✅ FAQ accordion with expand/collapse functionality
- ✅ Shopping cart with item counter
- ✅ Add to cart functionality with notifications
- ✅ Form validation on login/register pages
- ✅ Password visibility toggle
- ✅ Smooth scrolling for anchor links
- ✅ Organized footer with quick links and contact info

## File Structure

```
life_cycle/
├── index.html          # Landing page
├── login.html          # Login and registration page
├── menu.html           # Menu/dishes page
├── css/
│   └── style.css       # Main stylesheet with design system
├── js/
│   └── script.js       # JavaScript for interactivity
├── images/             # Placeholder images for menu items
│   ├── hero-food.svg
│   └── [food items].jpg
└── .gitignore
```

## Technology Stack

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS variables
- **Vanilla JavaScript**: No dependencies, pure JS for functionality
- **SVG**: Scalable vector graphics for icons

## Browser Compatibility

Tested and compatible with:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

## Responsive Breakpoints

- **Desktop**: 1440px and above (primary design)
- **Tablet**: 768px - 1439px
- **Mobile**: 320px - 767px

## How to Run

1. Clone the repository
2. Open `index.html` in a web browser
3. Or use a local server:
   ```bash
   python3 -m http.server 8000
   # Visit http://localhost:8000
   ```

## Features Implementation

### FAQ Section
- Accordion functionality with smooth transitions
- Only one FAQ can be open at a time
- Icons rotate on expand/collapse

### Shopping Cart
- Real-time cart counter updates
- Add items from menu page
- Notification system for user feedback
- Cart button in navigation shows item count

### Forms
- Email validation
- Password strength requirements
- Matching password confirmation
- Real-time error messages
- Remember me checkbox

### Navigation
- Sticky header that stays at top while scrolling
- Active page highlighting
- Smooth scroll to sections
- Mobile hamburger menu (responsive)

## Design Principles

1. **Consistency**: Uniform spacing, colors, and typography throughout
2. **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation
3. **Performance**: Minimal dependencies, optimized CSS
4. **Responsiveness**: Mobile-first approach with flexible layouts
5. **User Experience**: Clear feedback, intuitive interactions

## Future Enhancements

- Backend integration for real order processing
- User authentication system
- Payment gateway integration
- Real-time order tracking
- Restaurant management dashboard
- Customer reviews and ratings
- Search and filter functionality
- Order history

## Credits

Designed and developed for a food delivery platform project.

## License

This project is part of a laboratory work assignment.
