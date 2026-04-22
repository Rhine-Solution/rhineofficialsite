-- ============================================================
-- RHINE OFFICIAL SITE - RLS POLICIES
-- ============================================================
-- IMPORTANT: Run these commands AFTER enabling RLS on each table.
-- If RLS is not enabled yet, run these first:
--
-- ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
--
-- ============================================================

-- ============================================================
-- PRODUCTS TABLE RLS POLICIES
-- ============================================================
-- Policy 1: Public can SELECT (read) products
-- Policy 2: Only admins can INSERT, UPDATE, DELETE

-- Drop existing policies if they exist (safe to run multiple times)
DROP POLICY IF EXISTS "Products can be viewed by everyone" ON public.products;
DROP POLICY IF EXISTS "Only admins can modify products" ON public.products;

-- Public read access
CREATE POLICY "Products can be viewed by everyone" 
ON public.products FOR SELECT 
USING (true);

-- Admin-only write access (INSERT, UPDATE, DELETE)
-- This checks if the current user has role = 'admin' in the users table
CREATE POLICY "Only admins can modify products" 
ON public.products FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() 
        AND role = 'admin'
    )
);

-- ============================================================
-- ORDERS TABLE RLS POLICIES
-- ============================================================
-- Policy 1: Users can SELECT their own orders
-- Policy 2: Admins can SELECT all orders
-- Policy 3: Authenticated users can INSERT (create orders)
-- Policy 4: Users can UPDATE their own orders

DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update own orders" ON public.orders;

-- Users can view their own orders, admins can view all
CREATE POLICY "Users can view own orders" 
ON public.orders FOR SELECT 
USING (
    auth.uid() = user_id 
    OR EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() 
        AND role = 'admin'
    )
);

-- Authenticated users can create orders
CREATE POLICY "Users can create orders" 
ON public.orders FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Users can update their own orders
CREATE POLICY "Users can update own orders" 
ON public.orders FOR UPDATE 
USING (auth.uid() = user_id);

-- ============================================================
-- CONTACTS TABLE RLS POLICIES
-- ============================================================
-- Policy 1: Anyone can INSERT (submit contact form - public access)
-- Policy 2: Only admins can SELECT (view all contacts)
-- Policy 3: Only admins can DELETE

DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.contacts;
DROP POLICY IF EXISTS "Users can view own contacts" ON public.contacts;

-- Anyone can submit the contact form (no auth required)
CREATE POLICY "Anyone can submit contact form" 
ON public.contacts FOR INSERT 
WITH CHECK (true);

-- Only admins can SELECT (view) contacts
CREATE POLICY "Only admins can view all contacts" 
ON public.contacts FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() 
        AND role = 'admin'
    )
);

-- Only admins can DELETE contacts
CREATE POLICY "Only admins can delete contacts" 
ON public.contacts FOR DELETE 
USING (
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() 
        AND role = 'admin'
    )
);

-- ============================================================
-- VERIFICATION QUERIES (Run these to confirm)
-- ============================================================
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
-- FROM pg_policies 
-- WHERE schemaname = 'public' 
-- AND tablename IN ('products', 'orders', 'contacts');