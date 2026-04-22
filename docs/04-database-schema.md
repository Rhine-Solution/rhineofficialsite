# Database Schema Documentation

## Tables Overview

| Table | RLS Enabled | Purpose |
|-------|-------------|---------|
| profiles | ✅ Yes | User profiles (extends auth.users) |
| products | ✅ Yes | E-commerce products |
| orders | ✅ Yes | Customer orders |
| order_items | ✅ Yes | Order line items |
| appointments | ✅ Yes | Booking appointments |
| contacts | ✅ Yes | Contact form submissions |
| blog_posts | ✅ Yes | Blog articles |
| comments | ✅ Yes | Blog post comments |
| reviews | ✅ Yes | Product reviews |
| travel_bookings | ✅ Yes | Travel reservations |
| destinations | ✅ Yes | Travel destinations |
| subscriptions | ✅ Yes | Newsletter subscribers |

## Tables Detail

### profiles
```sql
- id (UUID, PK, FK auth.users)
- email (TEXT)
- full_name (TEXT)
- avatar_url (TEXT)
- role (TEXT: 'user' | 'admin')
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)

RLS Policies:
- Users can view own profile
- Users can update own profile
- Admins can view all profiles
```

### products
```sql
- id (UUID, PK)
- name (TEXT)
- description (TEXT)
- price (DECIMAL)
- image_url (TEXT)
- category (TEXT)
- stock (INTEGER)
- is_active (BOOLEAN)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)

RLS Policies:
- Anyone can view active products
- Admins can manage products
```

### orders
```sql
- id (UUID, PK)
- user_id (UUID, FK auth.users)
- status (TEXT: pending|processing|shipped|delivered|cancelled)
- total (DECIMAL)
- customer_name (TEXT)
- customer_email (TEXT)
- shipping_address (TEXT)
- city, zip_code, country (TEXT)
- notes (TEXT)
- stripe_payment_id (TEXT)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)

RLS Policies:
- Users can view own orders
- Admins can view all orders
- Users can create orders
- Admins can update orders
```

### order_items
```sql
- id (UUID, PK)
- order_id (UUID, FK orders)
- product_id (UUID, FK products)
- quantity (INTEGER)
- price (DECIMAL)
```

### appointments
```sql
- id (UUID, PK)
- user_id (UUID, FK auth.users)
- title (TEXT)
- date (DATE)
- time (TIME)
- status (TEXT)
- notes (TEXT)
- created_at (TIMESTAMPTZ)

RLS Policies:
- Users view own appointments
- Admins view all
- Users create/update own
- Admins manage all
```

### contacts
```sql
- id (UUID, PK)
- name (TEXT)
- email (TEXT)
- subject (TEXT)
- message (TEXT)
- status (TEXT: new|read|responded)
- created_at (TIMESTAMPTZ)

RLS Policies:
- Public can create (insert only)
- Admins can view/update
```

### blog_posts
```sql
- id (UUID, PK)
- title (TEXT)
- slug (TEXT, unique)
- excerpt (TEXT)
- content (TEXT)
- image_url (TEXT)
- author (TEXT)
- category (TEXT)
- is_published (BOOLEAN)
- created_at (TIMESTAMPTZ)
- published_at (TIMESTAMPTZ)

RLS Policies:
- Anyone can view published posts
- Admins can manage
```

### comments
```sql
- id (UUID, PK)
- post_id (UUID, FK blog_posts)
- user_id (UUID, FK auth.users)
- content (TEXT)
- created_at (TIMESTAMPTZ)

RLS Policies:
- Anyone can view
- Auth users can create
- User can update/delete own
- Admins can manage all
```

### travel_bookings
```sql
- id (UUID, PK)
- user_id (UUID, FK auth.users)
- destination_id (UUID, FK destinations)
- check_in, check_out (DATE)
- guests (INTEGER)
- total_price (DECIMAL)
- status (TEXT)
- created_at (TIMESTAMPTZ)

RLS Policies:
- Users view own bookings
- Admins view all
- Users create bookings
- Admins update status
```

### destinations
```sql
- id (UUID, PK)
- name (TEXT)
- description (TEXT)
- location (TEXT)
- price (DECIMAL)
- image_url (TEXT)
- category (TEXT: beach|city|mountain|island)
- is_active (BOOLEAN)
- created_at (TIMESTAMPTZ)

RLS Policies:
- Anyone can view active
- Admins can manage
```

### subscriptions (Newsletter)
```sql
- id (UUID, PK)
- email (TEXT, unique)
- status (TEXT: active|unsubscribed)
- created_at (TIMESTAMPTZ)

RLS Policies:
- Public can subscribe (insert)
- Anyone can view active
```

## Triggers

### on_auth_user_created
- Event: AFTER INSERT ON auth.users
- Function: handle_new_user()
- Action: Creates profile record

## Storage Buckets

| Bucket | Public | Purpose |
|--------|--------|---------|
| products | Yes | Product images |
| avatars | Yes | User avatars |
| blog | Yes | Blog images |
| travel | Yes | Destination images |

## Realtime Subscriptions

- **orders**: Listen for status changes (admin dashboard)
- **contacts**: New contact form submissions (admin)
- **travel_bookings**: New bookings (admin)