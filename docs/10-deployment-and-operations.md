# Deployment and Operations

## Vercel Deployment

### Initial Setup
1. Connect GitHub repository to Vercel
2. Framework preset: Next.js
3. Build command: `npm run build` (nextjs folder)
4. Output directory: `nextjs/.next`

### Environment Variables in Vercel
```
Required:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- STRIPE_SECRET_KEY
- NEXT_PUBLIC_TURNSTILE_SITE_KEY
- TURNSTILE_SECRET_KEY

Optional:
- NEXT_PUBLIC_SENTRY_DSN
- NEXT_PUBLIC_OPENREPLAY_KEY
- RESEND_API_KEY
```

### Custom Domain (Cloudflare)
1. Add domain in Cloudflare
2. Create CNAME record pointing to Vercle
3. Enable Cloudflare proxy (orange cloud)
4. Add domain in Vercel dashboard

## CI/CD Pipeline

### GitHub Actions
- Automatic deploy on push to main
- Runs: npm install, npm run build
- No custom tests in CI yet

### Workflow Steps
1. Push triggers workflow_dispatch or pull_request
2. Checkout code
3. Setup Node.js 20
4. Install dependencies
5. Run build
6. Deploy to Vercel (if main branch)

## Monitoring

### Sentry
- Set DSN in environment variables
- Errors tracked in app/global-error.jsx
- Currently not fully configured

### Vercel Analytics
- Page views tracked automatically
- Core Web Vitals in dashboard
- No additional setup needed

### OpenReplay (Optional)
- Session recording for debugging
- Needs: NEXT_PUBLIC_OPENREPLAY_KEY

## Backup & Recovery

### Database Backups
- Supabase provides automatic backups
- Point-in-time recovery available
- Manual export: pg_dump if needed

### Code Backup
- GitHub serves as primary backup
- Full history in repository

## Maintenance Tasks

### Weekly
- Check Vercel deployment logs for errors
- Review Sentry errors (if configured)
- Check for dependency updates

### Monthly
- Run npm audit fix
- Update Node.js version if needed
- Review and rotate API keys

### As Needed
- Add new pages/features
- Update content
- Monitor Stripe usage

## Troubleshooting

### Build Fails
1. Check Node version (use 20.x)
2. Verify environment variables set
3. Run build locally to reproduce

### Deployment Stuck
1. Check Vercel build logs
2. Cancel stuck deployment
3. Redeploy from last working commit

### Runtime Errors
1. Check browser console
2. Check Vercel function logs
3. Check Sentry if configured

### Stripe Issues
1. Verify keys in env (not test keys in prod)
2. Check webhook endpoint reachable
3. Review Stripe dashboard logs