# Sunny Travels - Next.js Travel Booking App

A modern travel booking application built with Next.js 14 (App Router) and React.

## Features

- Modern App Router architecture
- Server Components & Client Components
- Dynamic routing (/booking/[id])
- Search and filter functionality
- Responsive design
- Dark theme with animations
- Supabase integration ready

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

## Project Structure

```
nextjs/
├── app/
│   ├── layout.js       # Root layout
│   ├── page.js         # Home page with destinations
│   ├── globals.css     # Global styles
│   └── booking/
│       └── page.js     # Booking form
├── components/         # React components (to add)
├── lib/               # Utilities (Supabase client, etc.)
├── public/            # Static assets
└── package.json
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: JavaScript/React
- **Styling**: CSS Variables
- **Database**: Supabase (ready for integration)
- **Deployment**: Vercel or Cloudflare Pages

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Supabase Documentation](https://supabase.com/docs)

## Roadmap Status

- [x] Next.js setup
- [x] App Router
- [x] Dynamic routing
- [x] Search & filter
- [ ] Supabase integration
- [ ] User authentication
- [ ] Booking database
- [ ] Production deployment