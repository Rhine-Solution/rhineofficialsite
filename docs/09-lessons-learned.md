# Lessons Learned

## Development Gotchas

### 1. Middleware broke i18n (CRITICAL LESSON)
- **Issue**: Initial i18n implementation used next-intl middleware with locale prefixes (/en/, /es/)
- **Problem**: Middleware intercepted ALL routes, caused 404 on homepage
- **Fix**: Removed middleware entirely, used URL param approach, then Google Translate
- **Lesson**: Test middleware changes on EVERY route including root

### 2. i18next Path Alias Didn't Work
- **Issue**: `@/lib/i18n` import failed in components
- **Fix**: Used relative paths instead: `../lib/i18n`
- **Lesson**: Check Next.js path aliases in next.config.js before assuming they work

### 3. Layout Tag Nesting Broken Homepage
- **Issue**: AccessibilityChecker and OpenReplayProvider closing tags in wrong order
- **Problem**: React couldn't render, showed 404 on working routes
- **Fix**: Fixed tag nesting in app/layout.js
- **Lesson**: Always verify layout.js changes don't break rendering

### 4. Sentry Import Crashed Build
- **Issue**: global-error.jsx imported * from @sentry/nextjs
- **Problem**: Build failed with Prisma/OpenTelemetry dependency error
- **Fix**: Simplified global-error.jsx, removed Sentry temporarily
- **Lesson**: Keep error boundaries simple, add integrations gradually

### 5. LocalStorage SSR Mismatch
- **Issue**: Language preference stored in localStorage, couldn't read on SSR
- **Fix**: Added `mounted` check, only render after client mount
- **Lesson**: Always check `typeof window !== 'undefined'` for browser APIs

### 6. Build Succeeded but Runtime Failed
- **Issue**: npm run build passed but errors appeared on deploy
- **Problem**: Missing translations, broken imports not caught in build
- **Lesson**: Test build output in preview deployment before production

## Best Practices for This Stack

### Next.js + Supabase
- Always use Supabase SSR helpers in middleware
- Keep RLS policies simple - test in Supabase dashboard
- Use parameterized queries - never string concatenation

### Styling with Tailwind
- Use `dark:` prefix for dark mode variants
- Keep custom colors in tailwind.config.js
- Use `group-hover` for complex hover states

### State Management
- Context for global state (auth, cart, theme)
- URL params for page state (filters, pagination)
- Local state for component-specific UI

### API Routes
- Always validate input with Zod or manual checks
- Use proper error codes (400, 401, 403, 500)
- Add rate limiting for public endpoints

## Common OpenCode Mistakes to Avoid

1. **Don't skip build verification** - Always run npm run build before committing
2. **Don't forget environment variables** - Check .env.example is complete
3. **Don't leave console.log in production** - Remove debug statements
4. **Don't ignore TypeScript errors** - Even in .js files, check for issues
5. **Don't test only happy path** - Verify error handling works

## Stack-Specific Notes

### Next.js 14 App Router
- Use 'use client' for interactive components
- Keep pages as simple as possible, move logic to components
- Use generateMetadata for SEO

### Supabase Auth
- Middleware handles session refresh automatically
- Profile auto-created via trigger on auth.users insert
- Role stored in profiles table, not auth.users

### Stripe Integration
- Create Checkout Sessions server-side only
- Webhooks need raw body parsing (handled by Next.js)
- Test in test mode before production

### Vercel Deployment
- Set NEXT_PUBLIC_ vars in Vercel dashboard
- Functions timeout at 10 seconds by default
- Use incremental static regeneration for static-like dynamic pages