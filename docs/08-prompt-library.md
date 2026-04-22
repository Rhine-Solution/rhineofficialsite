# Prompt Library

Curated best prompts for this project, organized by category.

## Security Hardening

### Add Rate Limiting
```
Add rate limiting to all API routes in nextjs/app/api/
Use a simple in-memory rate limiter that allows 10 requests
per minute per IP. Apply to: /api/subscribe, /api/contact
```

### Fix CSRF on State-Changing Routes
```
Add CSRF token validation to /api/orders POST endpoint.
Generate token on login, validate on POST requests.
```

### Audit Secrets in Client Bundle
```
Check nextjs build output for any exposed API keys.
Ensure NEXT_PUBLIC_ variables are safe to expose.
```

## Performance Optimization

### Add Dynamic Import for CommandPalette
```
The CommandPalette is heavy - it's loaded on every page.
Use next/dynamic to lazy load it only when user presses Cmd+K.
```

### Optimize Images
```
Review all image tags in components. Replace any <img> tags
with the OptimizedImage component. Add proper sizes attributes.
```

### Add Cache Headers
```
Add Cache-Control headers to /api/products GET endpoint.
Use stale-while-revalidate for 60 second cache.
```

## UI/UX Polish

### Fix Mobile Menu Animation
```
The mobile menu in Navbar.js feels janky. Add smooth
CSS transitions using transform and opacity.
```

### Add Skeleton Loaders
```
Add skeleton loaders to: /dashboard, /orders, /shop
Show while data is loading from Supabase.
```

### Improve Form Validation
```
Add better error messages to the contact form.
Show field-level errors inline, not just at top.
```

## New Feature Implementation

### Complete Referral System
```
Create referrals database table in Supabase, add referral_code
column to profiles, create API to track referrals, update
ReferralBanner component to show actual stats.
```

### Add PDF Invoice Download
```
Install @react-pdf/renderer, create InvoicePDF component,
add download button to order details page.
```

### Implement Email Webhooks
```
Set up Stripe webhook handler, verify signature,
send confirmation emails via Resend when payment succeeds.
```

## Bug Fix Patterns

### Fix "X not defined" Errors
```
Search for any console.log statements or undefined variable
references in production code. Check: AIChatbot, CommandPalette
```

### Fix Build Warnings
```
Run npm run build and fix all warnings about:
- Critical dependencies
- Unused variables
- Missing dependencies
```

### Fix Tests
```
Jest is configured but no tests exist. Write tests for:
- AuthProvider login/logout
- CartProvider add/remove
- useDebounce hook
```

## Documentation Prompts

### Update API Docs
```
Document all POST/PUT endpoints in /api/
with: parameters, auth required, example request/response
```

### Document Environment Variables
```
Create comprehensive .env.example with all variables,
grouped by: Required, Optional, Development only
```

### Write Component Storybook
```
Create stories for base UI components: Button, Card, Input
Use @storybook/react or just document usage patterns
```