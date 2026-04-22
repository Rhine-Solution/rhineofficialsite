# Improvement Roadmap

## Completed Phases (from conversation history)

| Phase | Feature | Status |
|-------|---------|--------|
| 14 | Blog Comments | ✅ Complete |
| 15 | Admin Notifications | ✅ Complete |
| 16 | Global Search (CommandPalette) | ✅ Complete |
| 17 | i18n | ⚠️ Broken (replaced with Google Translate) |
| 18 | Sentry | ⚠️ Config but not active |
| 19 | OpenReplay | ⚠️ Optional |
| 20 | Meilisearch | ⚠️ Optional |
| 21 | AI Chatbot | ✅ Complete (local) |
| 22 | Accessibility Testing | ✅ Complete (axe-core dev) |
| 23 | Performance Budget CI | ✅ Complete (scripts) |
| 24 | Referral System | ❌ Incomplete - UI only |
| 25 | PDF Invoice | ❌ Incomplete - HTML only |

## Priority Matrix

### High Impact, Low Effort (Do First)
1. Connect Resend for email (15 min)
2. Fix global error with Sentry (10 min)
3. Remove unused packages (5 min)

### High Impact, High Effort (Schedule)
1. Complete Referral System (2 hours)
2. Implement PDF Invoices (1 hour)
3. Fix i18n Google Translate (30 min)

### Low Impact, Low Effort (When Time)
1. Add tests (ongoing)
2. SEO improvements (1 hour)
3. Accessibility fixes (1 hour)

### Low Impact, High Effort (Later)
1. Full TypeScript migration
2. Meilisearch full integration
3. OpenReplay activation

## Next 5 Actions for OpenCode

### Action 1: Complete Referral System
```
Create referrals table in Supabase, add referral_code to profiles,
create API endpoints for tracking referrals, update ReferralBanner
to use actual data
```

### Action 2: Implement PDF Invoices
```
Install @react-pdf/renderer, create InvoicePDF component,
add download button to /orders and /admin/orders,
connect to order data
```

### Action 3: Connect Email System
```
Add RESEND_API_KEY to .env.local, create email templates,
connect to order confirmation, contact form responses
```

### Action 4: Fix Google Translate
```
Debug why translation not working - may need explicit API key
or alternative widget approach
```

### Action 5: Enable Sentry
```
Restore Sentry in global-error.jsx, add DSN to env,
verify errors are being captured
```

## Estimated Times

| Task | Estimate |
|------|----------|
| Referral System | 2 hours |
| PDF Invoices | 1 hour |
| Email Setup | 30 minutes |
| Sentry Enable | 15 minutes |
| i18n Fix | 30 minutes |
| SEO Audit | 1 hour |

---

## Admin Portal Detailed Specifications

> Extracted from `docs/admin-portal-plan.md` (deprecated)

### UI/UX Specifications

#### Sidebar Navigation
| Item | Icon | Badge/Count |
|------|------|-------------|
| Dashboard | 📊 | - |
| Products | 🛒 | 21 |
| Orders | 📦 | 0 (if any) |
| Bookings | ✈️ | 0 (if any) |
| Contacts | 💬 | 3 (unread) |
| Users | 👥 | 0 |
| Reviews | ⭐ | 5 |
| Destinations | 🌍 | 10 |
| — | — | — |
| Analytics | 📈 | - |
| Settings | ⚙️ | - |

#### Responsive Breakpoints
| Breakpoint | Width | Sidebar Behavior |
|------------|-------|------------------|
| Mobile | < 768px | Hidden, hamburger menu |
| Tablet | 768-1024px | Collapsed icons only |
| Desktop | > 1024px | Full sidebar |

#### Component States
- **Buttons**: Default (indigo), Hover (lighter), Active (darker), Disabled (gray)
- **Table Rows**: Default, Hover (zinc-800/50), Selected (indigo-500/20)
- **Form Inputs**: Default, Focus (ring), Error (red border), Disabled

#### Toast Notifications
| Type | Color | Icon | Duration |
|------|-------|------|----------|
| Success | Green | ✓ | 3 sec |
| Error | Red | ✕ | 5 sec |
| Warning | Amber | ⚠ | 5 sec |
| Info | Blue | ℹ | 3 sec |

### Analytics Charts

#### Dashboard Overview Cards
- Total Revenue ($), Total Orders (#), Products (#), Contacts (#)

#### Chart Types Required
- Revenue Chart (Line - 12 months)
- Orders Chart (Bar - 7 days/12 months)
- Top Products (Horizontal Bar - top 5)
- Orders by Status (Donut chart)

### API Helper Functions (lib/admin-api.js)

```javascript
// Products
getProducts(filters), getProduct(id), createProduct(data),
updateProduct(id, data), deleteProduct(id), bulkDeleteProducts(ids)

// Orders
getOrders(filters), getOrder(id), updateOrderStatus(id, status)

// Contacts
getContacts(filters), markContactRead(id, isRead), deleteContact(id)

// Users
getUsers(), updateUserRole(id, role), toggleUserEnabled(id)

// Bookings
getBookings(filters), updateBookingStatus(id, status)

// Analytics
getRevenueData(period), getOrdersData(period), getTopProducts(limit)

// Export
exportToCSV(data, filename)
```

### Edge Cases to Handle

#### Products
- Duplicate names (allow but warn), long descriptions (truncate in table)
- Invalid image URLs (show placeholder), price of 0 (allow for free items)

#### Orders
- Deleted products (show "Product removed"), guest checkout (show "Guest")

#### Users
- Duplicate emails (prevent via unique constraint)
- Self-demotion (prevent admin from removing own admin)
- Deleting last admin (prevent)

### Dependencies
```bash
npm install chart.js react-chartjs-2 lucide-react date-fns
```