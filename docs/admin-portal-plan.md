# Admin Portal - Implementation Plan (EXPANDED)

> **Created:** April 21, 2026  
> **Project:** Rhine Official Site  
> **Status:** Planning Phase (Expanded)

---

## 1. Current State Analysis

### What Already Exists (`/admin`)
- Basic dashboard with stats (users, orders, revenue, products)
- Sidebar navigation with menu items
- Products table with Edit/Delete buttons (non-functional edit)
- Recent Activity section
- Section switching (overview, products, orders, etc.)

### Current Data (Database)
| Table | Count | Notes |
|-------|-------|-------|
| users | 0 | No registered users yet |
| products | 21 | Service products (hosting, SSL, etc.) |
| orders | 0 | No real orders yet |
| bookings | 0 | No travel bookings yet |
| appointments | 0 | No appointments yet |
| contacts | 3 | Demo contact submissions |
| destinations | 10 | Travel destinations |
| reviews | 5 | Product reviews |
| projects | 8 | Portfolio projects |
| books | 8 | Programming books |

### Tech Stack for Admin
- **Framework:** Next.js 14 (App Router)
- **UI:** Tailwind CSS + Custom components (Card, Button, Input)
- **Data:** Supabase REST API (direct fetch)
- **Auth:** Supabase Auth with role check (admin)

---

## 2. Database Tables - Detailed Schema

### 2.1 Products Table
```sql
products:
  - id (uuid, primary key)
  - name (text, required)
  - description (text)
  - price (numeric, required)
  - stock (integer, default: 0)
  - category (text, required) -- hosting, domain, ssl, seo, server, development, service
  - image_url (text)
  - created_at (timestamp)
  - updated_at (timestamp)
```

**Categories for Products:**
- `hosting` - Web hosting packages
- `domain` - Domain registration
- `ssl` - SSL certificates
- `seo` - SEO services
- `server` - Dedicated servers
- `development` - Development services
- `service` - Other services

### 2.2 Orders Table
```sql
orders:
  - id (uuid, primary key)
  - user_id (uuid, foreign key to users)
  - total (numeric, required)
  - status (text) -- pending, processing, completed, cancelled, refunded
  - shipping_address (text)
  - created_at (timestamp)
  - updated_at (timestamp)
```

**Order Status Flow:**
```
pending → processing → completed
  ↓                    ↑
  └──── cancelled ←────┘
         ↓
      refunded
```

### 2.3 Order Items Table
```sql
order_items:
  - id (uuid, primary key)
  - order_id (uuid, foreign key to orders)
  - product_id (uuid, foreign key to products)
  - quantity (integer, default: 1)
  - price (numeric, required) -- price at time of purchase
```

### 2.4 Contacts Table
```sql
contacts:
  - id (uuid, primary key)
  - name (text, required)
  - email (text, required)
  - subject (text)
  - message (text, required)
  - is_read (boolean, default: false)
  - created_at (timestamp)
```

### 2.5 Bookings Table (Travel)
```sql
bookings:
  - id (uuid, primary key)
  - user_id (uuid, foreign key to users)
  - destination_id (uuid, foreign key to destinations)
  - status (text) -- pending, confirmed, cancelled
  - guest_name (text, required)
  - guest_email (text, required)
  - check_in (date, required)
  - check_out (date, required)
  - guests (integer, default: 1)
  - total_price (numeric, required)
  - special_requests (text)
  - created_at (timestamp)
  - updated_at (timestamp)
```

### 2.6 Destinations Table
```sql
destinations:
  - id (uuid, primary key)
  - name (text, required)
  - location (text, required)
  - description (text)
  - price (numeric, required)
  - duration_days (integer)
  - image_url (text)
  - is_active (boolean, default: true)
  - created_at (timestamp)
```

### 2.7 Users Table
```sql
users:
  - id (uuid, primary key)
  - email (text, unique, required)
  - role (text) -- admin, user, employee
  - created_at (timestamp)
```

---

## 3. Feature Requirements - Detailed

### 3.1 Product Management (EXPANDED)

#### View Products Table
| Column | Type | Notes |
|--------|------|-------|
| Image | Thumbnail | 60x60px, rounded |
| Name | Text | Link to edit |
| Category | Badge | Color-coded by category |
| Price | Currency | Formatted as $X.XX |
| Stock | Number | Low stock warning if < 10 |
| Status | Badge | In Stock / Out of Stock |
| Actions | Buttons | Edit, Delete |

#### Add Product Form Fields
| Field | Type | Validation | Required |
|-------|------|-------------|----------|
| Name | Text input | Max 100 chars | Yes |
| Description | Textarea | Max 2000 chars | No |
| Price | Number input | Min 0, step 0.01 | Yes |
| Category | Select dropdown | From predefined list | Yes |
| Stock | Number input | Min 0, integer | Yes |
| Image URL | Text input | Valid URL format | No |

#### Edit Product
- Same fields as Add
- Pre-populated with existing values
- "Save Changes" button

#### Delete Product
- Confirmation dialog: "Are you sure you want to delete [Product Name]?"
- This action cannot be undone
- Also delete related order_items (optional - cascade?)

#### Search & Filter
- **Search:** By product name (real-time)
- **Filter by Category:** Dropdown with all categories
- **Filter by Status:** In Stock / Out of Stock / All
- **Sort by:** Name, Price (Low-High, High-Low), Date (Newest)

#### Bulk Actions
- Checkbox selection
- "Select All" option
- Bulk delete selected
- Bulk update stock

---

### 3.2 Order Management (EXPANDED)

#### View Orders Table
| Column | Type | Notes |
|--------|------|-------|
| Order ID | Text | First 8 chars + "..." |
| Customer | Text | Email or name |
| Items | Text | "X items" |
| Total | Currency | Formatted |
| Status | Badge | Color-coded |
| Date | Date | Formatted |
| Actions | Buttons | View Details, Update Status |

#### Status Badge Colors
- `pending` - Yellow/Amber
- `processing` - Blue
- `completed` - Green
- `cancelled` - Red
- `refunded` - Gray

#### Order Details Modal
- Order ID and Date
- Customer email and shipping address
- Order items list (product name, quantity, price)
- Subtotal, Tax (if any), Total
- Status change dropdown

#### Update Status Flow
1. Click "Update Status" on order row
2. Modal shows current status and dropdown
3. Select new status
4. Confirm - status updates in database
5. Toast notification: "Order status updated to [status]"

#### Filter Orders
- **By Status:** pending, processing, completed, cancelled, refunded
- **By Date:** Today, Last 7 days, Last 30 days, Custom range
- **Search:** By order ID or customer email

---

### 3.3 Contact Management (EXPANDED)

#### View Contacts Table
| Column | Type | Notes |
|--------|------|-------|
| Name | Text | - |
| Email | Text | Click to copy |
| Subject | Text | Truncated if long |
| Message | Text | Truncated, click to expand |
| Status | Badge | Unread (bold), Read |
| Date | Date | - |
| Actions | Buttons | Mark Read, Reply, Delete |

#### Contact Details
- Click row to expand full message
- Full message displayed
- Reply button → opens mailto: link

#### Actions
- **Mark as Read:** Toggle is_read flag
- **Delete:** Remove contact submission
- **Reply:** Open email client

#### Filter Contacts
- **By Status:** All, Unread, Read
- **By Date:** Recent first (default)
- **Search:** By name or email

---

### 3.4 Travel Bookings (EXPANDED)

#### View Bookings Table
| Column | Type | Notes |
|--------|------|-------|
| Destination | Text | Link to destination |
| Guest Name | Text | - |
| Guest Email | Text | Click to copy |
| Dates | Text | "MMM DD - MMM DD" |
| Guests | Number | - |
| Total | Currency | - |
| Status | Badge | pending, confirmed, cancelled |
| Actions | Buttons | View, Update Status |

#### Booking Status Colors
- `pending` - Yellow/Amber
- `confirmed` - Green
- `cancelled` - Red

#### Booking Details
- All booking fields
- Special requests (if any)
- Payment status (if tracked)

#### Update Booking Status
- Same pattern as orders
- Status: pending → confirmed → cancelled

---

### 3.5 User Management (EXPANDED)

#### View Users Table
| Column | Type | Notes |
|--------|------|-------|
| Avatar | Image | First letter fallback |
| Email | Text | - |
| Role | Badge | admin (red), user (blue), employee (green) |
| Created | Date | - |
| Actions | Buttons | Change Role, Disable |

#### Change User Role
- Modal with current role and dropdown
- Options: User, Employee, Admin
- Confirmation required
- Toast: "User role updated to [role]"

#### Disable User
- Confirmation: "Are you sure you want to disable this user?"
- Sets a flag (need to add `is_enabled` column)
- Disabled users cannot login

---

### 3.6 Destinations Management (EXPANDED)

#### View Destinations Table
Similar to products:
- Image, Name, Location, Price, Duration, Status

#### Add/Edit Destination
- Name, Location, Description
- Price, Duration (days)
- Image URL
- Active/Inactive toggle

---

## 4. UI/UX Requirements - Expanded

### 4.1 Layout Structure

```
┌────────────────────────────────────────────────────────────────────────┐
│  ADMIN HEADER                                                          │
│  ┌──────────┬─────────────────────────────┬──────────────────────────┐ │
│  │ Logo     │ Search Bar                  │ User Menu (Profile, Logout)│ │
│  └──────────┴─────────────────────────────┴──────────────────────────┘ │
├────────────┬────────────────────────────────────────────────────────────┤
│            │  BREADCRUMB: Home / Products / Edit Product              │
│  SIDEBAR   ├────────────────────────────────────────────────────────────┤
│            │                                                            │
│  Dashboard │  PAGE TITLE + ACTION BUTTON                               │
│  Products  │  ┌────────────────────────────────────────────────────┐  │
│  Orders    │  │                                                    │  │
│  Bookings  │  │              MAIN CONTENT AREA                     │  │
│  Contacts  │  │                                                    │  │
│  Users     │  │  - Tables with data                                │  │
│  ───────── │  │  - Forms                                           │  │
│  Analytics │  │  - Charts                                          │  │
│  Settings  │  │  - Cards                                           │  │
│            │  │                                                    │  │
│            │  └────────────────────────────────────────────────────┘  │
│            │                                                            │
└────────────┴────────────────────────────────────────────────────────────┘
```

### 4.2 Sidebar - Detailed

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

### 4.3 Responsive Breakpoints

| Breakpoint | Width | Sidebar Behavior |
|------------|-------|------------------|
| Mobile | < 768px | Hidden, hamburger menu |
| Tablet | 768-1024px | Collapsed icons only |
| Desktop | > 1024px | Full sidebar |

### 4.4 Component States

#### Buttons
- Default: bg-indigo-600, text-white
- Hover: bg-indigo-500, scale-105
- Active: bg-indigo-700
- Disabled: bg-zinc-600, text-zinc-400, cursor-not-allowed
- Loading: spinner icon, disabled

#### Table Rows
- Default: bg-transparent
- Hover: bg-zinc-800/50
- Selected: bg-indigo-500/20, border-indigo-500

#### Form Inputs
- Default: bg-zinc-900, border-zinc-700
- Focus: border-indigo-500, ring-2 ring-indigo-500/20
- Error: border-red-500, text-red-500 helper
- Disabled: bg-zinc-800, cursor-not-allowed

### 4.5 Toast Notifications

| Type | Color | Icon | Duration |
|------|-------|------|----------|
| Success | Green bg | ✓ | 3 sec |
| Error | Red bg | ✕ | 5 sec |
| Warning | Amber bg | ⚠ | 5 sec |
| Info | Blue bg | ℹ | 3 sec |

---

## 5. Analytics - Detailed Charts

### 5.1 Dashboard Overview Cards
```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Total Revenue│ │ Total Orders │ │   Products   │ │   Contacts   │
│   $12,450    │ │      45      │ │      21      │ │      12      │
│  +12% this m │ │  +5 this mo  │ │    steady    │ │  +3 this mo  │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

### 5.2 Revenue Chart (Line)
- X-axis: Last 12 months
- Y-axis: Revenue in dollars
- Tooltip: Month + exact revenue
- Legend: Total Revenue

### 5.3 Orders Chart (Bar)
- X-axis: Last 7 days (or 12 months)
- Y-axis: Number of orders
- Color: Indigo bars
- Hover: Show exact count

### 5.4 Top Products (Horizontal Bar)
- Top 5 products by sales
- Product name + total revenue generated

### 5.5 Orders by Status (Donut)
- Segments: pending (yellow), processing (blue), completed (green), cancelled (red)
- Legend with percentages

---

## 6. File Structure - Expanded

```
nextjs/
├── app/
│   └── admin/
│       ├── page.js                    # Main dashboard (overview)
│       ├── layout.js                  # Admin layout wrapper
│       ├── products/
│       │   ├── page.js                # Products list
│       │   └── [id]/page.js           # Edit product
│       ├── orders/
│       │   ├── page.js                # Orders list
│       │   └── [id]/page.js           # Order details
│       ├── bookings/
│       │   └── page.js                # Travel bookings
│       ├── contacts/
│       │   └── page.js                # Contact submissions
│       ├── users/
│       │   └── page.js                # User management
│       ├── destinations/
│       │   └── page.js                # Travel destinations
│       ├── reviews/
│       │   └── page.js                # Reviews management
│       ├── analytics/
│       │   └── page.js                # Charts & reports
│       └── settings/
│           └── page.js                # Site settings
│
├── components/
│   └── admin/
│       ├── Sidebar.js                 # Admin sidebar
│       ├── Header.js                   # Admin header
│       ├── DataTable.js               # Reusable table
│       ├── StatCard.js                # Stats display
│       ├── StatusBadge.js             # Status indicator
│       ├── ConfirmDialog.js           # Delete confirmation
│       ├── Toast.js                   # Notifications
│       ├── Modal.js                   # Reusable modal
│       ├── Pagination.js              # Pagination
│       ├── SearchBar.js               # Search input
│       ├── FilterDropdown.js          # Filter select
│       ├── ChartCard.js               # Chart wrapper
│       └── EmptyState.js              # No data state
│
├── lib/
│   └── admin-api.js                   # Helper functions for API calls
```

---

## 7. API Functions - Helper Module

Create `lib/admin-api.js` with functions:

```javascript
// Products
export async function getProducts(filters)
export async function getProduct(id)
export async function createProduct(data)
export async function updateProduct(id, data)
export async function deleteProduct(id)
export async function bulkDeleteProducts(ids)

// Orders
export async function getOrders(filters)
export async function getOrder(id)
export async function updateOrderStatus(id, status)

// Contacts
export async function getContacts(filters)
export async function markContactRead(id, isRead)
export async function deleteContact(id)

// Users
export async function getUsers()
export async function updateUserRole(id, role)
export async function toggleUserEnabled(id)

// Bookings
export async function getBookings(filters)
export async function updateBookingStatus(id, status)

// Analytics
export async function getRevenueData(period)
export async function getOrdersData(period)
export async function getTopProducts(limit)

// Export
export async function exportToCSV(data, filename)
```

---

## 8. Error Handling Strategy

### 8.1 API Errors
| Error Type | User Message | Action |
|------------|--------------|--------|
| Network Error | "Unable to connect. Please check your internet." | Retry button |
| 404 Not Found | "Data not found." | Show empty state |
| 403 Forbidden | "You don't have permission." | Redirect to dashboard |
| 500 Server Error | "Something went wrong. Please try again." | Retry button |
| Validation Error | Show field-specific errors | Highlight fields |

### 8.2 Form Validation
- Required fields: Show "This field is required"
- Email: Show "Please enter a valid email"
- Number: Show "Please enter a valid number"
- URL: Show "Please enter a valid URL"

### 8.3 Loading States
- Table: Show skeleton rows (5 rows)
- Cards: Show skeleton cards
- Forms: Show spinner in button
- Initial load: Full page spinner

---

## 9. Security Considerations

### 9.1 Implemented
- ✅ Admin role check on page load
- ✅ Database RLS policies
- ✅ .env.local not committed

### 9.2 To Implement
- ✅ Input sanitization on all forms
- ✅ CSRF protection (Next.js built-in)
- ✅ Rate limiting on bulk actions
- ✅ Audit logging (optional)
- ✅ Session timeout

### 9.3 Audit Log (Optional)
Create `admin_audit_log` table:
```sql
admin_audit_log:
  - id (uuid)
  - admin_user_id (uuid)
  - action (text) -- create, update, delete
  - entity_type (text) -- product, order, etc.
  - entity_id (uuid)
  - old_value (jsonb)
  - new_value (jsonb)
  - created_at (timestamp)
```

---

## 10. Edge Cases to Handle

### Products
- Duplicate product names (allow but warn)
- Very long descriptions (truncate in table, show full in edit)
- Invalid image URLs (show placeholder image)
- Price of 0 (allow for free items)

### Orders
- Orders with deleted products (show "Product removed")
- Guest checkout (no user_id) - show "Guest"
- Very long addresses (truncate)

### Users
- Duplicate emails (prevent via unique constraint)
- Self-demotion (prevent admin from removing own admin)
- Deleting last admin (prevent)

### General
- Empty states for all tables
- Very large datasets (pagination, lazy loading)
- Concurrent edits (last write wins with warning)

---

## 11. Implementation Tasks - Expanded Checklist

### Phase 1: Foundation
- [ ] Create admin layout with glassmorphism sidebar
- [ ] Implement responsive sidebar (mobile hamburger)
- [ ] Add authentication check (admin role only)
- [ ] Create reusable DataTable component
- [ ] Create StatCard component
- [ ] Create StatusBadge component
- [ ] Create ConfirmDialog component
- [ ] Create Toast notification system
- [ ] Create empty state component
- [ ] Add loading skeleton components

### Phase 2: Products Management
- [ ] View all products in table
- [ ] Add new product form
- [ ] Edit product (modal/page)
- [ ] Delete product with confirmation
- [ ] Bulk delete products
- [ ] Search products by name
- [ ] Filter products by category
- [ ] Sort products

### Phase 3: Orders Management
- [ ] View all orders in table
- [ ] Update order status
- [ ] View order details
- [ ] Filter orders by status
- [ ] Filter orders by date
- [ ] Search orders

### Phase 4: Contacts & Bookings
- [ ] View contact submissions
- [ ] Mark contacts as read/unread
- [ ] Delete contacts
- [ ] View travel bookings
- [ ] Update booking status

### Phase 5: User & Content Management
- [ ] View users list
- [ ] Change user role
- [ ] View travel destinations
- [ ] Add/Edit destinations
- [ ] View reviews
- [ ] Delete reviews

### Phase 6: Analytics
- [ ] Revenue chart
- [ ] Orders chart
- [ ] Top products widget
- [ ] Orders by status donut chart
- [ ] Export to CSV (orders)
- [ ] Export to CSV (contacts)

### Phase 7: Polish
- [ ] Pagination for all tables
- [ ] Toast notifications for all actions
- [ ] Loading states
- [ ] Error handling UI
- [ ] Mobile responsive testing

---

## 12. Dependencies

```bash
# Core
npm install chart.js react-chartjs-2 lucide-react date-fns

# Optional (if using)
# npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
# npm install @radix-ui/react-toast
```

---

## 13. Open Questions - ANSWERS NEEDED

1. **Product Images:** URL input (simpler for now)
2. **Email:** Send via Resend from admin (future feature)
3. **Multi-language:** English only for now
4. **User Registration:** Manual role assignment by admin

---

## 14. Next Steps

1. ✅ **Plan expanded** - This document
2. ⏳ **User approval** - Waiting for go-ahead
3. ⏳ **Install dependencies** - Run npm install
4. ⏳ **Start Phase 1** - Build foundation

---

*Document Version: 1.1 (Expanded)*  
*Last Updated: April 21, 2026*  
*Total Lines: ~600*