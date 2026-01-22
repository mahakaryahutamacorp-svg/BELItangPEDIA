-- ============================================
-- BELItangPEDIA - Fix Seller Auth Accounts
-- Jalankan di Supabase SQL Editor
-- ============================================

-- STEP 1: Check what's in auth.users
SELECT id, email, encrypted_password IS NOT NULL as has_password, created_at 
FROM auth.users 
WHERE email LIKE 'admin%@belitangpedia.com'
ORDER BY email;

-- STEP 2: Check auth.identities
SELECT user_id, provider, provider_id, created_at 
FROM auth.identities 
WHERE provider_id IN (
  SELECT id::text FROM auth.users WHERE email LIKE 'admin%@belitangpedia.com'
);
