import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Only send errors in production
  enabled: process.env.NODE_ENV === 'production',
  
  // Performance monitoring
  tracesSampleRate: 1.0,
  
  // Replay session recording (optional)
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  
  // Environment
  environment: process.env.NODE_ENV,
  
  // Ignore certain errors
  ignoreErrors: [
    'Network Error',
    'Navigator is not defined',
    'ResizeObserver loop limit exceeded',
  ],
  
  // Filter out non-critical breadcrumbs
  beforeBreadcrumb(breadcrumb, hint) {
    if (breadcrumb.category === 'ui.click') {
      return null;
    }
    return breadcrumb;
  },
});