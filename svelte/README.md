# Svelte Appointment App

A role-based appointment scheduling application built with SvelteKit.

## Features

- Role-based access (Client/Employee/Admin)
- Appointment scheduling
- Calendar view
- Real-time updates
- Supabase integration

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
svelte/
├── src/
│   ├── routes/
│   │   ├── +page.svelte       # Home/Dashboard
│   │   ├── +layout.svelte     # Main layout
│   │   ├── appointments/
│   │   └── login/
│   ├── lib/
│   │   ├── stores/            # Svelte stores
│   │   └── components/
└── static/
```

## Tech Stack

- **Framework**: SvelteKit
- **Styling**: CSS
- **Database**: Supabase
- **Deployment**: Vercel

## Roles

- **Client**: Book appointments
- **Employee**: Manage own appointments
- **Admin**: Full access

## Status

- [x] Project setup
- [ ] Authentication
- [ ] Role management
- [ ] Appointment booking
- [ ] Calendar view
- [ ] Supabase integration