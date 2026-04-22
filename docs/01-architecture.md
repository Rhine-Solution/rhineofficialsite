# Architecture Documentation

## Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Next.js | 14.2.0 |
| UI Library | React | 18.3.0 |
| Styling | Tailwind CSS | 3.4.19 |
| Database | Supabase (PostgreSQL) | - |
| Auth | Supabase Auth | - |
| Payments | Stripe | - |
| Hosting | Vercel | - |
| Error Tracking | Sentry | 10.49.0 |
| Session Recording | OpenReplay | 18.0.4 |
| Search | Meilisearch | 0.57.0 |
| Forms | Cloudflare Turnstile | - |

## Folder Structure

```
nextjs/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── orders/
│   │   ├── products/
│   │   ├── send-email/
│   │   ├── subscribe/
│   │   └── verify-turnstile/
│   ├── admin/            # Admin dashboard
│   ├── appointments/     # Booking system
│   ├── blog/             # Blog pages
│   ├── dashboard/        # User dashboard
│   ├── travel/          # Travel booking
│   ├── shop/            # E-commerce
│   └── ...              # Other pages
├── components/           # React components
│   ├── ui/              # Base UI components
│   ├── admin/           # Admin-specific components
│   ├── layout/          # Navbar, Footer
│   └── ...              # Feature components
├── lib/                 # Utilities
│   ├── supabase.js     # Supabase client
│   ├── local-chatbot.js
│   └── knowledge/       # AI knowledge base
├── hooks/               # Custom React hooks
├── scripts/             # Build/utility scripts
└── public/              # Static assets
```

## Data Flow

```
User Browser
    │
    ├─► Next.js Server (SSR/ISR)
    │       │
    │       ├─► Supabase (Database + Auth)
    │       │
    │       ├─► Stripe (Payments)
    │       │
    │       ├─► SendGrid/Resend (Email)
    │       │
    │       └─► External APIs (Turnstile, Sentry, etc.)
    │
    └─► Client Components (useEffect)
            │
            └─► Supabase Client (Auth + DB)
```

## Environment Variables Reference

> **Note:** Actual credentials are stored in Vercel Environment Variables and local `.env.local`. See `nextjs/.env.example` for required keys. Never commit actual keys to Git!

| Variable | Required | Description |
|----------|----------|-------------|
| NEXT_PUBLIC_SUPABASE_URL | Yes | Supabase project URL |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Yes | Supabase anonymous key |
| SUPABASE_SERVICE_ROLE_KEY | Yes | Service role for admin ops |
| NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY | Yes | Stripe public key |
| STRIPE_SECRET_KEY | Yes | Stripe secret key |
| NEXT_PUBLIC_TURNSTILE_SITE_KEY | Yes | Cloudflare Turnstile site key |
| TURNSTILE_SECRET_KEY | Yes | Cloudflare Turnstile secret |
| NEXT_PUBLIC_SENTRY_DSN | No | Sentry error tracking |
| NEXT_PUBLIC_OPENREPLAY_KEY | No | OpenReplay session recording |
| MEILISEARCH_HOST_URL | No | Meilisearch search engine |
| OPENAI_API_KEY | No | AI chatbot (deprecated - now local) |

## Infrastructure Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Vercel Hosting                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │   Next.js   │  │   Images    │  │   Edge Cache   │  │
│  │   App       │  │  Optimized  │  │   + CDN        │  │
│  └─────────────┘  └─────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────┘
           │                    │
    ┌──────┴──────┐        ┌──────┴──────┐
    ▼             ▼        ▼             ▼
┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐
│Supabase │  │ Stripe  │  │ Cloud-  │  │ Sentry │
│(PostgreSQL)│ │Payments│  │flare    │  │Errors  │
└─────────┘  └─────────┘  └─────────┘  └─────────┘
    │
    ├─► Auth (Email/Google/GitHub)
    ├─► Database (Tables + RLS)
    └─► Storage (Files)
```

## Authentication Flow

1. User signs up/login via Supabase Auth
2. Auth trigger creates profile in `public.profiles` table
3. Middleware checks session cookies
4. Protected routes redirect to /login if unauthenticated
5. Role-based access: `user` vs `admin`

## API Security

- **Turnstile Verification**: All public forms (contact, register, checkout)
- **RLS Policies**: Database-level row security
- **Middleware**: Route protection for /admin, /dashboard, /profile, /orders
- **Input Validation**: Server-side validation on API routes