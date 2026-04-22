# Components Catalog

## Layout Components

| Component | Path | Type | Reusability | Purpose |
|-----------|------|------|--------------|---------|
| Navbar | components/layout/Navbar.js | Client | High | Main navigation with mega menus, mobile menu, auth dropdown |
| Footer | components/layout/Footer.js | Client | High | Footer with links, newsletter, social |
| PageTransition | components/PageTransition.jsx | Client | Medium | Animated page transitions |
| FloatingActionButton | components/FloatingActionButton.jsx | Client | Low | Quick action FAB menu |

## UI Components (Base)

| Component | Path | Type | Reusability | Purpose |
|-----------|------|------|--------------|---------|
| Button | components/ui/Button.js | Client | High | Primary button with variants |
| Card | components/ui/Card.js | Client | High | Content card with variants |
| Input | components/ui/Input.js | Client | High | Form input with label |
| Toast | components/ui/Toast.js | Client | Medium | Notification toasts |
| Skeleton | components/ui/Skeleton.js | Client | High | Loading placeholders |
| FadeInSection | components/ui/FadeInSection.jsx | Client | Medium | Scroll-triggered animations |
| PageLoader | components/ui/PageLoader.jsx | Client | Medium | Loading spinner |
| PageSuspense | components/ui/PageSuspense.jsx | Client | Medium | Suspense wrapper |
| OptimizedImage | components/ui/OptimizedImage.js | Client | High | Next.js Image wrapper |

## Feature Components

| Component | Path | Type | Reusability | Purpose |
|-----------|------|------|--------------|---------|
| AIChatbot | components/AIChatbot.jsx | Client | Low | Local AI chatbot |
| BlogComments | components/BlogComments.jsx | Client | Medium | Blog comment system |
| CommandPalette | components/CommandPalette.jsx | Client | Medium | Global search (Cmd+K) |
| ReferralBanner | components/ReferralBanner.jsx | Client | Low | Referral program |
| BlogComments | components/BlogComments.jsx | Client | Medium | Comments on blog posts |
| AdminNotifications | components/AdminNotifications.jsx | Client | Low | Real-time admin alerts |
| TrustBar | components/TrustBar.jsx | Client | Medium | Social proof stats |
| RecentlyViewedBar | components/RecentlyViewedBar.jsx | Client | Medium | Recently viewed products |
| ReviewSection | components/ReviewSection.jsx | Client | Medium | Product reviews |
| ShareButton | components/ShareButton.jsx | Client | Low | Social sharing |
| CookieConsent | components/CookieConsent.jsx | Client | Medium | GDPR consent |
| Turnstile | components/Turnstile.js | Client | High | Cloudflare human verification |

## Providers (Context)

| Provider | Path | Scope | Purpose |
|----------|------|-------|---------|
| AuthProvider | components/AuthProvider.js | Global | User auth state |
| CartProvider | components/CartProvider.js | Global | Shopping cart |
| WishlistProvider | components/WishlistProvider.js | Global | Wishlist items |
| NotificationProvider | components/NotificationProvider.js | Global | Notifications |
| SearchProvider | components/SearchContext.js | Global | Search state |
| ThemeProvider | components/ThemeProvider.js | Global | Dark/light mode |
| I18nProvider | components/I18nProvider.js | Global | Internationalization (deprecated) |
| AccessibilityChecker | components/AccessibilityChecker.jsx | Global | Axe-core dev testing |

## Admin Components

| Component | Path | Purpose |
|-----------|------|---------|
| Header | components/admin/Header.js | Admin header |
| Sidebar | components/admin/Sidebar.js | Admin navigation |
| DataTable | components/admin/DataTable.js | Data display |
| StatCard | components/admin/StatCard.js | Stats display |
| StatusBadge | components/admin/StatusBadge.js | Status indicator |
| EmptyState | components/admin/EmptyState.js | Empty data state |
| Toast | components/admin/Toast.js | Admin notifications |

## Third-Party Integrations

| Component | Path | Purpose |
|-----------|------|---------|
| OpenReplayProvider | components/OpenReplayProvider.jsx | Session recording |
| GoogleTranslate | components/GoogleTranslate.jsx | Auto-translation |
| LanguageSwitcher | components/LanguageSwitcher.jsx | Language selector |
| JsonLd | components/JsonLd.jsx | SEO structured data |

## Hooks

| Hook | Path | Purpose |
|------|------|---------|
| useDebounce | hooks/useDebounce.js | Debounce value |
| useRecentlyViewed | hooks/useRecentlyViewed.js | Track recently viewed |
| useMeilisearch | components/useMeilisearch.js | Enhanced search |

## Components by Type

**High Reusability**: Button, Card, Input, Toast, Skeleton, FadeInSection, OptimizedImage, Turnstile, Navbar, Footer

**Medium Reusability**: PageTransition, PageLoader, PageSuspense, TrustBar, RecentlyViewedBar, ReviewSection, CookieConsent, CommandPalette, BlogComments

**Low Reusability**: AIChatbot, ReferralBanner, AdminNotifications, FloatingActionButton, ShareButton, GoogleTranslate, LanguageSwitcher

## Tremor Dashboard Components

| Component | Purpose | Used In |
|-----------|---------|---------|
| Card | Container with decoration | /admin |
| Title | Section headings | /admin |
| Text | Descriptions | /admin |
| Metric | Large numbers | /admin |
| Badge | Status indicators | /admin |
| BadgeDelta | Trend arrows with % | /admin |
| ProgressBar | Target progress | /admin |
| Grid | Responsive layout | /admin |
| TabGroup, TabList, Tab, TabPanel | Tabbed interface | /admin |
| Table components | Data display | /admin |
| TextInput | Search input | /admin |
| Select, SelectItem | Dropdown filters | /admin |
| Flex | Layout alignment | /admin |
| Button | Pagination | /admin |
| AreaChart | Revenue chart | /admin |
| BarChart | Products chart | /admin |