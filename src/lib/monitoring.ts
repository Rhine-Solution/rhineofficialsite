// Production-ready monitoring utilities
// Performance metrics, error tracking, user analytics

export interface PerformanceMetrics {
  pageLoad: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
  timeToFirstByte: number;
}

export interface UserAnalytics {
  sessionId: string;
  pageViews: number;
  interactions: number;
  bounceRate: number;
  sessionDuration: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private sessionStart = Date.now();
  private pageViews = 0;
  private interactions = 0;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initObserver();
      this.trackNavigation();
    }
  }

  private initObserver() {
    // Observe Performance Observer API
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry & { startTime: number };
        this.updateMetric('largestContentfulPaint', lastEntry.startTime);
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const perfEntry = entry as PerformanceEntry & { processingStart: number; startTime: number };
          const fid = perfEntry.processingStart - perfEntry.startTime;
          this.updateMetric('firstInputDelay', fid);
        });
      }).observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift
      new PerformanceObserver((list) => {
        let cumulativeShift = 0;
        list.getEntries().forEach((entry) => {
          const layoutEntry = entry as PerformanceEntry & { hadRecentInput: boolean; value: number; sources: unknown[] };
          if (!layoutEntry.hadRecentInput) {
            cumulativeShift += layoutEntry.value;
          }
        });
        this.updateMetric('cumulativeLayoutShift', cumulativeShift);
      }).observe({ entryTypes: ['layout-shift'] });

      // Navigation timing
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const navEntry = entry as PerformanceNavigationTiming;
          this.updateMetric('pageLoad', navEntry.loadEventEnd - navEntry.fetchStart);
          this.updateMetric('timeToFirstByte', navEntry.responseStart - navEntry.requestStart);
        });
      }).observe({ entryTypes: ['navigation'] });
    }
  }

  private trackNavigation() {
    if (typeof window === 'undefined') return;

    window.addEventListener('popstate', () => {
      this.pageViews++;
    });

    // Track first contentful paint
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fcpEntry = entries[0] as PerformanceEntry & { startTime: number };
      this.updateMetric('firstContentfulPaint', fcpEntry.startTime);
    });

    try {
      fcpObserver.observe({ entryTypes: ['paint'] });
    } catch {
      // FCP not supported
    }
  }

  private updateMetric(name: keyof PerformanceMetrics, value: number) {
    const current = this.metrics[this.metrics.length - 1] || {} as PerformanceMetrics;
    (current as unknown as Record<string, number>)[name] = value;
    if (this.metrics.length === 0 || Object.keys(current).length === 1) {
      this.metrics.push(current);
    }
  }

  trackInteraction() {
    this.interactions++;
  }

  getMetrics(): PerformanceMetrics | null {
    return this.metrics[this.metrics.length - 1] || null;
  }

  getAllMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  getSessionAnalytics(): UserAnalytics {
    return {
      sessionId: this.getSessionId(),
      pageViews: this.pageViews + 1,
      interactions: this.interactions,
      bounceRate: this.pageViews === 0 ? 100 : 0,
      sessionDuration: Date.now() - this.sessionStart,
    };
  }

  private getSessionId(): string {
    if (typeof window === 'undefined') return '';
    let sessionId = sessionStorage.getItem('rhine_session_id');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem('rhine_session_id', sessionId);
    }
    return sessionId;
  }

  reportToAnalytics(event: string, properties?: Record<string, unknown>) {
    if (typeof window === 'undefined') return;

    // Send to Plausible (if available)
    const win = window as unknown as { plausible?: (event: string, props?: { props: Record<string, unknown> }) => void };
    if (win.plausible) {
      win.plausible(event, { props: properties || {} });
    }

    // Send to console in development
    if (import.meta.env.DEV) {
      console.log('[Analytics]', event, properties);
    }
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Error tracking
class ErrorTracker {
  private errors: Error[] = [];

  captureError(error: Error, context?: Record<string, unknown>) {
    this.errors.push(error);

    // Log to console
    console.error('[Error]', error.message, {
      stack: error.stack,
      context,
    });

    // Report to Sentry (if available)
    const win = window as unknown as { Sentry?: { captureException: (err: Error, ctx?: unknown) => void } };
    if (win.Sentry) {
      win.Sentry.captureException(error, { extra: context });
    }

    // Store for debugging
    this.storeError(error, context);
  }

  private storeError(error: Error, context?: Record<string, unknown>) {
    if (typeof window === 'undefined') return;

    const errorLog = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    try {
      const errors = JSON.parse(localStorage.getItem('rhine_errors') || '[]');
      errors.push(errorLog);
      // Keep only last 10 errors
      if (errors.length > 10) {
        errors.shift();
      }
      localStorage.setItem('rhine_errors', JSON.stringify(errors));
    } catch {
      // Storage full or unavailable
    }
  }

  getErrors(): Error[] {
    return [...this.errors];
  }

  clearErrors() {
    this.errors = [];
    if (typeof window !== 'undefined') {
      localStorage.removeItem('rhine_errors');
    }
  }
}

export const errorTracker = new ErrorTracker();

// Global error handler
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    if (event.error) {
      errorTracker.captureError(event.error);
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason instanceof Error
      ? event.reason
      : new Error(String(event.reason));
    errorTracker.captureError(error, { type: 'unhandledrejection' });
  });
}

export default performanceMonitor;
