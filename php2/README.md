# PHP 2 - OOP Portfolio

Object-Oriented PHP portfolio demonstrating professional PHP development with classes, inheritance, and design patterns.

## OOP Concepts Demonstrated

### Classes & Objects
- `User` - Base user class with encapsulation
- `UserProfile` - 1:1 relationship with User
- `Admin` - Extends User (inheritance)
- `Project` - Abstract base class
- `FreelanceProject` / `SchoolProject` - Inheritance & polymorphism
- `Database` - Singleton pattern
- `Router` - Clean URL routing

### Design Patterns
- **Singleton** - Database connection
- **Factory** - Project creation
- **Inheritance** - Admin extends User
- **Polymorphism** - Different project types
- **Encapsulation** - Getters/setters

## Running the Project

```bash
cd php2
php -S localhost:8000
# Open http://localhost:8000
```

## Demo Credentials
- Email: admin@rhine.dev
- Password: admin123

## Project Structure

```
php2/
├── classes/
│   ├── Autoloader.php
│   ├── Database.php
│   ├── User.php
│   ├── Admin.php
│   ├── UserProfile.php
│   ├── Project.php
│   ├── FreelanceProject.php
│   ├── SchoolProject.php
│   └── Router.php
├── views/
│   ├── header.php
│   ├── footer.php
│   ├── home.php
│   ├── projects.php
│   ├── project-detail.php
│   ├── login.php
│   └── admin.php
├── index.php
└── README.md
```

## Learning Outcomes

- [x] Classes and Objects
- [x] Constructors and Destructors
- [x] Access Modifiers (private, protected, public)
- [x] Getters and Setters
- [x] Inheritance
- [x] Abstract Classes
- [x] Interfaces
- [x] Traits
- [x] Static Methods
- [x] Namespaces
- [x] Autoloading (PSR-4)
- [x] Design Patterns