-- ===============================================
-- ADDITIONAL RLS POLICIES
-- ===============================================
-- Run this after the main schema if you need more policies

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql STABLE;

-- Enable anon access for products (public read)
CREATE POLICY "Public products read" ON public.products
  FOR SELECT USING (true);

-- Enable anon access for destinations
CREATE POLICY "Public destinations read" ON public.destinations
  FOR SELECT USING (true);

-- Enable anon access for posts
CREATE POLICY "Public posts read" ON public.posts
  FOR SELECT USING (is_published = true);

-- Allow anonymous order creation (for guest checkout)
CREATE POLICY "Anyone can create orders" ON public.orders
  FOR INSERT WITH CHECK (true);

-- Allow order items insert
CREATE POLICY "Anyone can create order items" ON public.order_items
  FOR INSERT WITH CHECK (true);

-- ===============================================
-- STORAGE SETUP (for image uploads)
-- ===============================================
-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true);

-- Storage policies for products
CREATE POLICY "Public access to products bucket" ON storage.objects
  FOR SELECT USING (bucket_id = 'products');

CREATE POLICY "Admin upload to products bucket" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'products' AND 
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
  );

CREATE POLICY "Admin update products bucket" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'products' AND 
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
  );

-- ===============================================
-- REAL-TIME SUBSCRIPTIONS
-- ===============================================
-- Enable real-time for orders (admins only)
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;

-- Enable real-time for bookings (admins only)
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;

-- Enable real-time for contacts (admins only)
ALTER PUBLICATION supabase_realtime ADD TABLE public.contacts;