# Rhine Official Site

> Enterprise-grade multi-service platform built with modern web technologies.

[![Deployment](https://img.shields.io/badge/Main%20Site-Vercel-blue)](https://www.rhinesolution.com)
[![Shop](https://img.shields.io/badge/Shop-Vercel%20PHP-green)](https://shop.rhinesolution.com)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green)](https://supabase.com)

---

## 📋 Overview

Rhine Official Site is a production-ready enterprise platform demonstrating full-stack development capabilities across multiple technologies while providing real business value.

### Key Features

- 🛒 **E-commerce** - Product catalog, shopping cart, checkout
- 🌍 **Travel Booking** - Destination discovery and booking
- 📁 **Portfolio** - Project showcase with filtering
- 👥 **User Dashboard** - Profile, orders, file management
- 📞 **Contact System** - Form with database storage
- 🔐 **Authentication** - Secure login with Supabase Auth
- 📊 **Admin Panel** - User and content management
- 🛡️ **Human Verification** - Cloudflare Turnstile

---

## 🏗️ Architecture

### Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | Next.js 14, React 18 | UI Framework |
| Styling | Tailwind CSS | Responsive design |
| Language | TypeScript, PHP | Language |
| Backend | Supabase | Database, Auth, Storage |
| Hosting | Vercel | Deployment |
| CDN | Cloudflare | DNS only |
| CI/CD | GitHub Actions | Automated deployment |

### Infrastructure

```
┌─────────────────────────────────────────────────────┐
│                    Cloudflare                       │
│  ┌─────────────┐                                    │
│  │    DNS      │  (Domain management only)         │
│  └─────────────┘                                    │
└─────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────┐
│                      Vercel                         │
│  ┌─────────────┐  ┌─────────────┐                   │
│  │  Main Site  │  │  PHP Shop   │                   │
│  │  (Next.js)  │  │  (PHP)      │                   │
│  └─────────────┘  └─────────────┘                   │
└─────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────┐
│                     Supabase                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │  PostgreSQL  │  │    Auth     │  │   Storage   │  │
│  │  (Database)  │  │ (Users/Roles)│  │  (Files)    │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Local Development

```bash
# Clone repository
git clone https://github.com/Rhine-Solution/rhineofficialsite.git
cd rhineofficialsite

# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

---

## 📁 Project Structure

```
rhineofficialsite/
├── nextjs/                # Main site (Next.js 14)
│   ├── app/               # Next.js App Router
│   ├── components/       # React components
│   ├── lib/              # Utilities & Supabase client
│   └── public/           # Static assets
├── php/                   # PHP Shop (Vercel)
├── supabase/              # Database configuration
├── .github/workflows/     # CI/CD pipelines
├── memory.md             # Project documentation
└── README.md             # This file
```

---

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## 📊 Database Schema

### Core Tables

| Table | Description |
|-------|-------------|
| `users` | User accounts with roles |
| `products` | E-commerce catalog |
| `orders` | Customer orders |
| `order_items` | Order line items |
| `appointments` | Booking system |
| `contacts` | Contact form submissions |

### RLS Policies

All tables have Row Level Security enabled with policies for:
- Public read access for products
- Authenticated access for user data
- Admin-only for management operations

---

## 🌍 Deployment

### Production URLs

| Service | URL | Platform |
|---------|-----|----------|
| Main Site | https://www.rhinesolution.com | Vercel (Next.js) |
| PHP Shop | https://shop.rhinesolution.com | Vercel (PHP) |

### Auto-Deployment

- **Main Site (Vercel):** Automatic on push to main
- **PHP Shop (Vercel):** Automatic on push to main

### Manual Deployment

```bash
# Deploy to Vercel (or connect GitHub for auto-deploy)
vercel --prod
```

---

## 📈 Features Status

| Feature | Status | Notes |
|---------|--------|-------|
| User Authentication | ✅ Complete | Supabase Auth |
| Contact Form | ✅ Complete | Database storage |
| Product Catalog | ✅ Complete | From Supabase |
| Shopping Cart | ✅ Complete | Session-based |
| User Dashboard | ✅ Complete | With file upload |
| Travel Booking | 🔶 In Progress | Next.js integration |
| Admin Panel | ⏳ Planned | Phase 2 |
| Unified App | 🔶 In Progress | Migration to Next.js |

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

MIT License - see LICENSE file for details.

---

## 📚 Documentation

- [Project Memory](memory.md) - Detailed project documentation
- [Roadmap](roadmap.mmd) - Project vision and milestones
- [Supabase Docs](https://supabase.com/docs) - Database documentation
- [Next.js Docs](https://nextjs.org/docs) - Framework documentation

---

## 🔗 Links

- **Main Site:** https://www.rhinesolution.com
- **Shop:** https://shop.rhinesolution.com
- **GitHub:** https://github.com/RAGNAROK-RS0/rhineofficialsite
- **Supabase:** https://supabase.com/dashboard/project/crqjedivobupxbbathux
- **Cloudflare:** https://dash.cloudflare.com
- **Vercel:** https://vercel.com/dashboard

---

*Built with ❤️ using Next.js, Supabase, Vercel, and Cloudflare DNS.*