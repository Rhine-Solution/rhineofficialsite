-- ================================================
-- SAMPLE PRODUCTS FOR PHP WEBSHOP
-- Run this in Supabase SQL Editor
-- ================================================

-- Create contacts table (if not exists)
CREATE TABLE IF NOT EXISTS public.contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on contacts
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit contact form" ON public.contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view own contacts" ON public.contacts FOR SELECT USING (auth.uid() IN (SELECT id FROM public.users WHERE email = auth.jwt()->>'email'));

-- Insert sample products
INSERT INTO public.products (name, description, price, stock, category, image_url) VALUES
('Wireless Headphones', 'Premium wireless headphones with noise cancellation and 30-hour battery life.', 149.99, 50, 'Electronics', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'),
('Smart Watch', 'Feature-rich smart watch with fitness tracking, heart rate monitor, and GPS.', 299.99, 30, 'Electronics', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'),
('Laptop Stand', 'Ergonomic aluminum laptop stand with adjustable height and angle.', 49.99, 100, 'Accessories', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400'),
('Mechanical Keyboard', 'RGB mechanical gaming keyboard with Cherry MX switches.', 129.99, 40, 'Electronics', 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400'),
('USB-C Hub', '7-in-1 USB-C hub with HDMI, USB 3.0, SD card reader, and power delivery.', 79.99, 60, 'Accessories', 'https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?w=400'),
('Wireless Mouse', 'Ergonomic wireless mouse with adjustable DPI and silent clicks.', 39.99, 80, 'Accessories', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400'),
('Desk Lamp', 'LED desk lamp with adjustable brightness and color temperature.', 69.99, 45, 'Home', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400'),
('Webcam HD', '1080p HD webcam with built-in microphone and autofocus.', 89.99, 35, 'Electronics', 'https://images.unsplash.com/photo-1587826080692-f439cd0b71da?w=400'),
('Phone Stand', 'Adjustable phone and tablet stand with non-slip base.', 24.99, 120, 'Accessories', 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=400'),
('Portable Charger', '20000mAh portable power bank with fast charging support.', 44.99, 70, 'Electronics', 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400');

-- Verify products were added
SELECT * FROM public.products ORDER BY created_at DESC;