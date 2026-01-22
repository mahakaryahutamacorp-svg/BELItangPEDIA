-- ============================================
-- BELItangPEDIA - Complete Fix for RLS & Admin/Seller Setup
-- Run this in Supabase SQL Editor
-- ============================================

-- ============================================
-- STEP 1: Add 'role' column to users table if not exists
-- ============================================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'role'
    ) THEN
        ALTER TABLE public.users ADD COLUMN role TEXT DEFAULT 'user';
    END IF;
END $$;

-- ============================================
-- STEP 2: Drop ALL existing policies to avoid conflicts
-- ============================================

-- Users table
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can insert own data" ON users;
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Anyone can view user profiles" ON users;
DROP POLICY IF EXISTS "Service role manages users" ON users;
DROP POLICY IF EXISTS "Public read users" ON users;

-- Stores table
DROP POLICY IF EXISTS "Users can create own store" ON stores;
DROP POLICY IF EXISTS "Users can update own store" ON stores;
DROP POLICY IF EXISTS "Users can delete own store" ON stores;
DROP POLICY IF EXISTS "Stores are viewable by everyone" ON stores;
DROP POLICY IF EXISTS "Anyone can view stores" ON stores;
DROP POLICY IF EXISTS "Owner can create store" ON stores;
DROP POLICY IF EXISTS "Owner can update store" ON stores;
DROP POLICY IF EXISTS "Owner can delete store" ON stores;
DROP POLICY IF EXISTS "Public read stores" ON stores;

-- ============================================
-- STEP 3: Create SIMPLE permissive policies
-- ============================================

-- USERS TABLE - Allow all authenticated users to read
CREATE POLICY "Public read users"
ON users FOR SELECT
TO public
USING (true);

-- Users can insert their own profile
CREATE POLICY "Users insert own profile"
ON users FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users update own profile"
ON users FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- STORES TABLE - Allow all to read
CREATE POLICY "Public read stores"
ON stores FOR SELECT
TO public
USING (true);

-- Users can create store
CREATE POLICY "Users create store"
ON stores FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update own store
CREATE POLICY "Users update own store"
ON stores FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Users can delete own store
CREATE POLICY "Users delete own store"
ON stores FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- ============================================
-- STEP 4: Set admin1 as admin and mark all admin users as sellers
-- ============================================

-- Set first admin as admin role
UPDATE public.users 
SET role = 'admin', is_seller = true
WHERE email = 'admin1@belitangpedia.com';

-- Set all other admins as sellers
UPDATE public.users 
SET is_seller = true
WHERE email LIKE 'admin%@belitangpedia.com';

-- ============================================
-- STEP 5: Create stores for all admin sellers who don't have one
-- ============================================

INSERT INTO public.stores (id, user_id, name, description, address, is_verified, created_at)
SELECT 
    gen_random_uuid(),
    u.id,
    'Toko ' || u.name,
    'Toko resmi dari ' || u.name || ' di BELItangPEDIA',
    'Jl. Merdeka, Belitang, OKU Timur, Sumatera Selatan',
    true,
    NOW()
FROM public.users u
WHERE u.email LIKE 'admin%@belitangpedia.com'
AND u.is_seller = true
AND NOT EXISTS (
    SELECT 1 FROM public.stores s WHERE s.user_id = u.id
);

-- ============================================
-- STEP 6: Verify the changes
-- ============================================

-- Check users
SELECT id, email, name, is_seller, role FROM public.users 
WHERE email LIKE 'admin%@belitangpedia.com'
ORDER BY email;

-- Check stores
SELECT s.id, s.name, u.email as owner, s.is_verified
FROM public.stores s
JOIN public.users u ON s.user_id = u.id
WHERE u.email LIKE 'admin%@belitangpedia.com'
ORDER BY u.email;

-- Check policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename IN ('users', 'stores')
ORDER BY tablename, policyname;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
-- All fixes applied:
-- 1. RLS policies fixed for users and stores tables
-- 2. admin1@belitangpedia.com set as admin role
-- 3. All admin accounts marked as sellers
-- 4. Stores created for all admin sellers
--
-- You can now:
-- - Login as admin1@belitangpedia.com to access /admin
-- - Login as any admin account to access /seller
-- ============================================
