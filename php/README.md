# PHP Webshop

A simple e-commerce application demonstrating PHP fundamentals.

## Features

- User registration and login
- Product catalog
- Shopping cart (session-based)
- Order history
- Clean URL routing

## Getting Started

1. Install PHP (if not already): `winget install PHP.PHP`
2. Start PHP built-in server:
   ```bash
   php -S localhost:8000
   ```
3. Open http://localhost:8000

## Demo Credentials

- Email: demo@rhine.dev
- Password: demo123

## Project Structure

```
php/
├── index.php          # Main entry point
├── pages/             # Page templates
│   ├── home.php
│   ├── products.php
│   ├── login.php
│   ├── register.php
│   ├── cart.php
│   └── orders.php
└── README.md
```

## Learning Topics

- [x] Basic PHP syntax
- [x] Forms and $_POST/$_GET
- [x] Sessions
- [x] Database connection (PDO)
- [x] Prepared statements
- [ ] OOP (see php2-portfolio)