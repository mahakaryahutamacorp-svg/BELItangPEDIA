-- =====================================================
-- SUPABASE STORAGE BUCKETS & POLICIES
-- BELItangPEDIA Marketplace
-- =====================================================
-- Jalankan SQL ini di Supabase SQL Editor
-- =====================================================

-- =====================================================
-- 1. CREATE STORAGE BUCKETS
-- =====================================================

-- Bucket untuk Banner Homepage
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'banners',
  'banners',
  true,
  5242880, -- 5MB max
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Bucket untuk Flash Sale Images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'flashsale',
  'flashsale',
  true,
  5242880, -- 5MB max
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Bucket untuk Product Images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'products',
  'products',
  true,
  10485760, -- 10MB max
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Bucket untuk Store Logos & Covers
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'stores',
  'stores',
  true,
  5242880, -- 5MB max
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Bucket untuk User Avatars
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  2097152, -- 2MB max
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Bucket untuk Category Icons
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'categories',
  'categories',
  true,
  1048576, -- 1MB max
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
) ON CONFLICT (id) DO NOTHING;

-- Bucket untuk Promo/Campaign Images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'promos',
  'promos',
  true,
  5242880, -- 5MB max
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;


-- =====================================================
-- 2. STORAGE POLICIES - BANNERS BUCKET
-- =====================================================

-- Allow public read access to banners
CREATE POLICY "Public can view banners"
ON storage.objects FOR SELECT
USING (bucket_id = 'banners');

-- Allow authenticated admins to upload banners
CREATE POLICY "Admins can upload banners"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'banners' 
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- Allow admins to update banners
CREATE POLICY "Admins can update banners"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'banners' 
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- Allow admins to delete banners
CREATE POLICY "Admins can delete banners"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'banners' 
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);


-- =====================================================
-- 3. STORAGE POLICIES - FLASHSALE BUCKET
-- =====================================================

-- Allow public read access to flashsale images
CREATE POLICY "Public can view flashsale"
ON storage.objects FOR SELECT
USING (bucket_id = 'flashsale');

-- Allow admins to upload flashsale images
CREATE POLICY "Admins can upload flashsale"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'flashsale' 
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- Allow admins to update flashsale images
CREATE POLICY "Admins can update flashsale"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'flashsale' 
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- Allow admins to delete flashsale images
CREATE POLICY "Admins can delete flashsale"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'flashsale' 
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);


-- =====================================================
-- 4. STORAGE POLICIES - PRODUCTS BUCKET
-- =====================================================

-- Allow public read access to product images
CREATE POLICY "Public can view products"
ON storage.objects FOR SELECT
USING (bucket_id = 'products');

-- Allow sellers to upload their product images
CREATE POLICY "Sellers can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'products' 
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role IN ('seller', 'admin')
  )
);

-- Allow sellers to update their product images
CREATE POLICY "Sellers can update product images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'products' 
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role IN ('seller', 'admin')
  )
);

-- Allow sellers to delete their product images
CREATE POLICY "Sellers can delete product images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'products' 
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role IN ('seller', 'admin')
  )
);


-- =====================================================
-- 5. STORAGE POLICIES - STORES BUCKET
-- =====================================================

-- Allow public read access to store images
CREATE POLICY "Public can view store images"
ON storage.objects FOR SELECT
USING (bucket_id = 'stores');

-- Allow sellers to upload store images
CREATE POLICY "Sellers can upload store images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'stores' 
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role IN ('seller', 'admin')
  )
);

-- Allow sellers to update store images
CREATE POLICY "Sellers can update store images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'stores' 
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role IN ('seller', 'admin')
  )
);

-- Allow sellers to delete store images
CREATE POLICY "Sellers can delete store images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'stores' 
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role IN ('seller', 'admin')
  )
);


-- =====================================================
-- 6. STORAGE POLICIES - AVATARS BUCKET
-- =====================================================

-- Allow public read access to avatars
CREATE POLICY "Public can view avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Allow users to upload their own avatar
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to update their own avatar
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own avatar
CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);


-- =====================================================
-- 7. STORAGE POLICIES - CATEGORIES BUCKET
-- =====================================================

-- Allow public read access to category icons
CREATE POLICY "Public can view categories"
ON storage.objects FOR SELECT
USING (bucket_id = 'categories');

-- Allow admins to manage category icons
CREATE POLICY "Admins can upload categories"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'categories' 
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

CREATE POLICY "Admins can update categories"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'categories' 
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

CREATE POLICY "Admins can delete categories"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'categories' 
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);


-- =====================================================
-- 8. STORAGE POLICIES - PROMOS BUCKET
-- =====================================================

-- Allow public read access to promo images
CREATE POLICY "Public can view promos"
ON storage.objects FOR SELECT
USING (bucket_id = 'promos');

-- Allow admins to manage promo images
CREATE POLICY "Admins can upload promos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'promos' 
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

CREATE POLICY "Admins can update promos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'promos' 
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

CREATE POLICY "Admins can delete promos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'promos' 
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);


-- =====================================================
-- 9. DATABASE TABLES FOR DYNAMIC CONTENT
-- =====================================================

-- Table for Homepage Banners
CREATE TABLE IF NOT EXISTS public.banners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  link_url TEXT,
  button_text VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for Flash Sales
CREATE TABLE IF NOT EXISTS public.flash_sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  banner_image TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for Flash Sale Products
CREATE TABLE IF NOT EXISTS public.flash_sale_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  flash_sale_id UUID REFERENCES public.flash_sales(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  flash_price DECIMAL(12,2) NOT NULL,
  stock_limit INTEGER,
  sold_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(flash_sale_id, product_id)
);

-- Enable RLS on new tables
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flash_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flash_sale_products ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Banners
CREATE POLICY "Public can view active banners"
ON public.banners FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage banners"
ON public.banners FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- RLS Policies for Flash Sales
CREATE POLICY "Public can view active flash sales"
ON public.flash_sales FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage flash sales"
ON public.flash_sales FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- RLS Policies for Flash Sale Products
CREATE POLICY "Public can view flash sale products"
ON public.flash_sale_products FOR SELECT
USING (true);

CREATE POLICY "Admins can manage flash sale products"
ON public.flash_sale_products FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);


-- =====================================================
-- 10. SAMPLE DATA FOR BANNERS
-- =====================================================

INSERT INTO public.banners (title, subtitle, image_url, link_url, button_text, display_order) VALUES
('Dukung UMKM Lokal', 'Belanja dari toko-toko terpercaya di Belitang', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200', '/products', 'Belanja Sekarang', 1),
('Flash Sale Setiap Hari', 'Diskon hingga 70% untuk produk pilihan', 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200', '/flash-sale', 'Lihat Promo', 2),
('Pengiriman Cepat', 'Sampai dalam 1-2 jam untuk area Belitang', 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=1200', '/about', 'Pelajari Lebih', 3);


-- =====================================================
-- 11. SAMPLE FLASH SALE
-- =====================================================

INSERT INTO public.flash_sales (name, description, start_time, end_time) VALUES
('Flash Sale Akhir Pekan', 'Diskon spesial untuk produk pilihan', NOW(), NOW() + INTERVAL '2 days');


-- =====================================================
-- SELESAI! 
-- =====================================================
-- Setelah menjalankan SQL ini, Anda bisa:
-- 1. Upload banner di: Storage > banners
-- 2. Upload flash sale images di: Storage > flashsale
-- 3. Upload product images di: Storage > products
-- 4. Manage banners di: Table Editor > banners
-- 5. Manage flash sales di: Table Editor > flash_sales
-- =====================================================
