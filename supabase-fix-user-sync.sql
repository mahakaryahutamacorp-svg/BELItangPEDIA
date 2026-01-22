-- ============================================
-- FIX: Foreign Key Constraint Error for Seller Registration
-- Run this in Supabase SQL Editor
-- ============================================

-- STEP 1: Sync ALL users from auth.users to public.users
-- This ensures every authenticated user has a profile in the users table

INSERT INTO public.users (id, email, full_name, created_at, role, is_seller)
SELECT 
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'full_name', au.raw_user_meta_data->>'name', split_part(au.email, '@', 1)) as full_name,
    au.created_at,
    'user' as role,
    false as is_seller
FROM auth.users au
WHERE NOT EXISTS (
    SELECT 1 FROM public.users pu WHERE pu.id = au.id
);

-- STEP 2: Create a trigger to auto-create user profile on signup
-- This prevents future foreign key issues

-- First, create the function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, created_at, role, is_seller)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        NEW.created_at,
        'user',
        false
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Then create the trigger (drop first if exists)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- STEP 3: Verify the sync worked
SELECT 
    au.email as auth_email,
    pu.email as users_email,
    CASE WHEN pu.id IS NOT NULL THEN '✓ Synced' ELSE '✗ Missing' END as status
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
ORDER BY au.created_at DESC;

-- ============================================
-- SUCCESS! 
-- Now users can register as sellers without foreign key errors.
-- The trigger will automatically create user profiles for new signups.
-- ============================================
