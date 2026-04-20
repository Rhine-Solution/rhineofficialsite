# Project Credentials & API Keys

> **Last Updated:** April 2026
> **Status:** Store sensitive info here, never commit to Git

---

## Supabase

- **Project ID:** crqjedivobupxbbathux
- **URL:** https://crqjedivobupxbbathux.supabase.co
- **Anon Key:** (in .env.local)

---

## Stripe (Test Mode)

- **Publishable Key:** pk_test_51TO0B62MPln5rJhtdfzf...
- **Secret Key:** sk_test_... (reveal in Stripe dashboard)

---

## Cloudflare

- **Account:** admin@rhinesolution.com
- **Turnstile Site Key:** (in Vercel env vars)
- **Turnstile Secret Key:** (in Vercel env vars)
- **DNS Only:** rhinesolution.com, shop.rhinesolution.com

---

## Google OAuth (To be configured)

- **Client ID:** TODO - Create in Google Cloud Console
- **Client Secret:** TODO - Get from Google Cloud Console
- **Callback URL:** https://crqjedivobupxbbathux.supabase.co/auth/v1/callback

### Steps to enable Google Sign-In:
1. Go to console.cloud.google.com → APIs & Services → Credentials
2. Create OAuth 2.0 Client ID (Web application)
3. Add callback URL to "Authorized redirect URIs"
4. Copy Client ID and Client Secret to Supabase (Authentication → Providers → Google)

---

## Vercel

- **Project:** rhineofficialsite
- **URL:** https://vercel.com/ragnarok-rs0s-projects/rhineofficialsite

---

## Environment Variables (Vercel)

| Variable | Status |
|----------|--------|
| NEXT_PUBLIC_SUPABASE_URL | ✅ Set |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | ✅ Set |
| NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY | ✅ Set |
| STRIPE_SECRET_KEY | ✅ Set |
| NEXT_PUBLIC_TURNSTILE_SITE_KEY | ✅ Set |

---

*Never commit this file or API keys to GitHub!*