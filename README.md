# FreshFood Delivery Website

A responsive static HTML, CSS, and JavaScript food delivery website with a clean green-themed design.

## 🌟 Features

- **Landing Page**: Hero section, "How it Works", Featured Dishes, and FAQ sections
- **Login Page**: User authentication interface with social login options
- **Register Page**: New user registration form with validation
- **Account Page**: User profile management and order history
- **About Us Page**: Company mission, values, and story
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Interactive Elements**: FAQ accordion, form validation, mobile menu
- **Green Color Palette**: Clean, modern design with consistent branding

## 📁 Project Structure

```
life_cycle/
├── index.html              # Landing page
├── css/
│   └── styles.css         # Main stylesheet
├── js/
│   └── script.js          # JavaScript functionality
├── pages/
│   ├── login.html         # Login page
│   ├── register.html      # Registration page
│   ├── account.html       # User account page
│   └── about.html         # About us page
├── images/                # Images directory (placeholder)
├── .gitignore            # Git ignore file
└── README.md             # This file
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

## 🎨 Design Features

### Color Palette
- **Primary Green**: #28a745
- **Dark Green**: #1e7e34
- **Light Green**: #d4edda
- **Accent Green**: #5cb85c
- **Text Dark**: #333333
- **Text Light**: #666666

### Pages Overview

#### 1. Landing Page (index.html)
- Attractive hero section with call-to-action buttons
- "How it Works" section explaining the ordering process
- Featured dishes showcase with pricing
- FAQ accordion for common questions
- Responsive navigation and footer

#### 2. Login Page (pages/login.html)
- Email and password authentication
- Remember me option
- Social login buttons (Google, Facebook)
- Link to registration page

#### 3. Register Page (pages/register.html)
- Full name, email, phone, and password fields
- Password confirmation
- Terms and conditions checkbox
- Social registration options

#### 4. Account Page (pages/account.html)
- User profile information display
- Profile editing form
- Password change functionality
- Sidebar navigation for different sections
- Order history display

#### 5. About Us Page (pages/about.html)
- Company story and mission statement
- Core values cards
- Statistics showcase
- Call-to-action section

## 🔧 Customization

### Changing Colors
Edit the CSS variables in `css/styles.css`:

```css
:root {
    --primary-green: #28a745;
    --dark-green: #1e7e34;
    /* ... other variables ... */
}
```

### Adding Images
1. Place your images in the `images/` directory
2. Update the image placeholders in HTML files
3. Replace `.hero-placeholder` and `.dish-image` elements with actual images

### Modifying Content
- Edit HTML files directly to change text, links, and structure
- Menu items and dishes can be added/removed in the Featured Dishes section
- FAQ items can be added/removed in the FAQ section

## 📱 Responsive Breakpoints

- **Desktop**: 1200px and above
- **Tablet**: 768px - 1199px
- **Mobile**: Below 768px

The website uses CSS Grid and Flexbox for responsive layouts that adapt automatically.

## ✨ JavaScript Features

The `js/script.js` file includes:
- Mobile menu toggle
- FAQ accordion functionality
- Form validation for login and registration
- Success/error message notifications
- Smooth scrolling
- Active navigation link highlighting

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 Future Enhancements

Potential features to add:
- Backend integration for real authentication
- Shopping cart functionality
- Real-time order tracking
- Payment gateway integration
- User reviews and ratings
- Restaurant partner dashboard

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👥 Authors

- **FreshFood Delivery Team** - Initial work

## 🙏 Acknowledgments

- Food emoji icons used throughout the design
- Modern CSS practices and responsive design patterns
- Clean, accessible HTML structure
