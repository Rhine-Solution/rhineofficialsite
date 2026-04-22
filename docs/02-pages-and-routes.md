# Pages and Routes Documentation

## Frontend Routes

| Path | File | Type | Auth Required | Purpose |
|------|------|------|---------------|----------|
| `/` | app/page.js | SSR | No | Homepage |
| `/shop` | app/shop/page.js | SSR | No | E-commerce products |
| `/shop/[id]` | app/shop/[id]/page.js | SSR | No | Product detail |
| `/travel` | app/travel/page.js | SSR | No | Travel destinations |
| `/travel/booking` | app/travel/booking/page.js | SSR | Yes | Booking form |
| `/travel/success` | app/travel/success/page.js | SSR | Yes | Booking confirmation |
| `/portfolio` | app/portfolio/page.js | SSR | No | Portfolio showcase |
| `/blog` | app/blog/page.js | SSR | No | Blog listing |
| `/blog/[slug]` | app/blog/[slug]/page.js | SSR | No | Blog post |
| `/pricing` | app/pricing/page.js | SSR | No | Subscription plans |
| `/faq` | app/faq/page.js | SSR | No | FAQ with categories |
| `/contact` | app/contact/page.js | SSR | No | Contact form |
| `/about` | app/about/page.js | SSR | No | Company info |
| `/terms` | app/terms/page.js | SSR | No | Terms of service |
| `/privacy` | app/privacy/page.js | SSR | No | Privacy policy |
| `/login` | app/login/page.js | Client | No | Login page |
| `/register` | app/register/page.js | Client | No | Registration |
| `/dashboard` | app/dashboard/page.js | SSR | Yes | User dashboard |
| `/profile` | app/profile/page.js | SSR | Yes | Profile settings |
| `/orders` | app/orders/page.js | SSR | Yes | Order history |
| `/wishlist` | app/wishlist/page.js | SSR | Yes | Wishlist items |
| `/checkout` | app/checkout/page.js | Client | Yes | Checkout flow |
| `/checkout/success` | app/checkout/success/page.js | SSR | Yes | Order confirmation |
| `/appointments` | app/appointments/page.js | SSR | Yes | Appointment list |
| `/appointments/book` | app/appointments/book/page.js | Client | Yes | Book appointment |
| `/admin` | app/admin/page.js | SSR | Yes (Admin) | Admin dashboard |
| `/admin/products` | app/admin/products/page.js | SSR | Yes (Admin) | Manage products |
| `/admin/orders` | app/admin/orders/page.js | SSR | Yes (Admin) | Manage orders |
| `/admin/contacts` | app/admin/contacts/page.js | SSR | Yes (Admin) | Contact submissions |
| `/admin/bookings` | app/admin/bookings/page.js | SSR | Yes (Admin) | Travel bookings |

## API Routes

| Endpoint | Methods | Auth | Rate Limit | Purpose |
|----------|---------|------|------------|---------|
| `/api/products` | GET, POST | No / Yes | No | Product CRUD |
| `/api/orders` | GET, POST | Yes | No | Order CRUD |
| `/api/subscribe` | POST | No | Yes | Newsletter signup |
| `/api/send-email` | POST | No (internal) | No | Transactional email |
| `/api/verify-turnstile` | POST | No | Yes | Turnstile verification |

## Dynamic Parameters

| Route | Parameters | Type |
|-------|------------|------|
| `/shop/[id]` | id (UUID) | Product |
| `/blog/[slug]` | slug (string) | Blog post |
| `/travel/booking` | destination (query) | Optional |

## Revalidation Strategy

- **ISR**: Homepage, Blog, FAQ (revalidate: 60)
- **SSR**: Dashboard, Profile, Orders
- **Client**: Login, Register, Checkout flow