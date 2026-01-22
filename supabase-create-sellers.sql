-- ============================================
-- BELItangPEDIA - Create 10 Seller Accounts
-- Jalankan di Supabase SQL Editor
-- ============================================
-- Username: admin1 - admin10
-- Password: admin123
-- Email: admin1@belitangpedia.com - admin10@belitangpedia.com
-- ============================================

-- Enable pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================
-- STEP 1: Create Auth Users (Supabase Authentication)
-- ============================================

DO $$
DECLARE
  i INT;
  new_user_id UUID;
  user_email TEXT;
  user_name TEXT;
  user_phone TEXT;
  existing_user_id UUID;
BEGIN
  FOR i IN 1..10 LOOP
    user_email := 'admin' || i || '@belitangpedia.com';
    user_name := 'Admin Seller ' || i;
    user_phone := '08120000000' || LPAD(i::TEXT, 2, '0');
    
    -- Check if user already exists
    SELECT id INTO existing_user_id FROM auth.users WHERE email = user_email;
    
    IF existing_user_id IS NOT NULL THEN
      RAISE NOTICE 'User % already exists, skipping...', user_email;
      new_user_id := existing_user_id;
    ELSE
      -- Generate new UUID for user
      new_user_id := gen_random_uuid();
      
      -- ============================================
      -- Create Auth User in auth.users table
      -- ============================================
      INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        invited_at,
        confirmation_token,
        confirmation_sent_at,
        recovery_token,
        recovery_sent_at,
        email_change_token_new,
        email_change,
        email_change_sent_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        created_at,
        updated_at,
        phone,
        phone_confirmed_at,
        phone_change,
        phone_change_token,
        phone_change_sent_at,
        email_change_token_current,
        email_change_confirm_status,
        banned_until,
        reauthentication_token,
        reauthentication_sent_at,
        is_sso_user,
        deleted_at
      ) VALUES (
        '00000000-0000-0000-0000-000000000000',  -- instance_id
        new_user_id,                              -- id
        'authenticated',                          -- aud
        'authenticated',                          -- role
        user_email,                               -- email
        crypt('admin123', gen_salt('bf')),        -- encrypted_password (bcrypt hash)
        NOW(),                                    -- email_confirmed_at (auto-confirm)
        NULL,                                     -- invited_at
        '',                                       -- confirmation_token
        NULL,                                     -- confirmation_sent_at
        '',                                       -- recovery_token
        NULL,                                     -- recovery_sent_at
        '',                                       -- email_change_token_new
        '',                                       -- email_change
        NULL,                                     -- email_change_sent_at
        NULL,                                     -- last_sign_in_at
        '{"provider": "email", "providers": ["email"]}'::jsonb,  -- raw_app_meta_data
        jsonb_build_object('name', user_name, 'phone', user_phone, 'is_seller', true),  -- raw_user_meta_data
        FALSE,                                    -- is_super_admin
        NOW(),                                    -- created_at
        NOW(),                                    -- updated_at
        NULL,                                     -- phone
        NULL,                                     -- phone_confirmed_at
        '',                                       -- phone_change
        '',                                       -- phone_change_token
        NULL,                                     -- phone_change_sent_at
        '',                                       -- email_change_token_current
        0,                                        -- email_change_confirm_status
        NULL,                                     -- banned_until
        '',                                       -- reauthentication_token
        NULL,                                     -- reauthentication_sent_at
        FALSE,                                    -- is_sso_user
        NULL                                      -- deleted_at
      );
      
      -- ============================================
      -- Create Identity in auth.identities table
      -- ============================================
      INSERT INTO auth.identities (
        id,
        user_id,
        identity_data,
        provider,
        provider_id,
        last_sign_in_at,
        created_at,
        updated_at
      ) VALUES (
        new_user_id,                              -- id (same as user_id for email provider)
        new_user_id,                              -- user_id
        jsonb_build_object(
          'sub', new_user_id::TEXT,
          'email', user_email,
          'email_verified', true,
          'phone_verified', false
        ),                                        -- identity_data
        'email',                                  -- provider
        new_user_id::TEXT,                        -- provider_id
        NOW(),                                    -- last_sign_in_at
        NOW(),                                    -- created_at
        NOW()                                     -- updated_at
      );
      
      RAISE NOTICE 'Created auth user: %', user_email;
    END IF;
    
    -- ============================================
    -- Create User Profile in public.users table
    -- ============================================
    -- Check if profile exists
    IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = new_user_id) THEN
      INSERT INTO public.users (
        id,
        email,
        name,
        phone,
        avatar_url,
        is_seller,
        created_at,
        updated_at
      ) VALUES (
        new_user_id,
        user_email,
        user_name,
        user_phone,
        NULL,
        TRUE,
        NOW(),
        NOW()
      );
      RAISE NOTICE 'Created user profile: %', user_name;
    ELSE
      UPDATE public.users SET is_seller = TRUE, updated_at = NOW() WHERE id = new_user_id;
      RAISE NOTICE 'Updated user profile: %', user_name;
    END IF;
    
    -- ============================================
    -- Create Store for Seller
    -- ============================================
    -- Check if store exists
    IF NOT EXISTS (SELECT 1 FROM public.stores WHERE user_id = new_user_id) THEN
      INSERT INTO public.stores (
        id,
        user_id,
        name,
        description,
        logo_url,
        banner_url,
        address,
        latitude,
        longitude,
        rating,
        total_reviews,
        total_products,
        is_verified,
        created_at
      ) VALUES (
        gen_random_uuid(),
        new_user_id,
        'Toko Admin ' || i,
        'Toko resmi Admin Seller ' || i || ' di BELItangPEDIA. Menyediakan berbagai produk berkualitas untuk warga Belitang dan sekitarnya.',
        NULL,
        NULL,
        'Jl. Merdeka No. ' || (i * 10) || ', Belitang, OKU Timur, Sumatera Selatan 32382',
        -4.1234 + (i * 0.001),   -- Sample latitude
        104.5678 + (i * 0.001),  -- Sample longitude
        4.5,                      -- Initial rating
        0,
        0,
        TRUE,                     -- Verified seller
        NOW()
      );
      RAISE NOTICE 'Created store for: %', user_name;
    ELSE
      RAISE NOTICE 'Store already exists for: %', user_name;
    END IF;
    
  END LOOP;
  
  RAISE NOTICE '============================================';
  RAISE NOTICE 'SUCCESS! Seller accounts processing complete!';
  RAISE NOTICE '============================================';
  RAISE NOTICE 'Login credentials:';
  RAISE NOTICE 'Email: admin1@belitangpedia.com to admin10@belitangpedia.com';
  RAISE NOTICE 'Password: admin123';
  RAISE NOTICE '============================================';
END $$;

-- ============================================
-- VERIFICATION: Check created users
-- ============================================

-- View auth users
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  raw_user_meta_data->>'name' as name,
  raw_user_meta_data->>'is_seller' as is_seller
FROM auth.users 
WHERE email LIKE 'admin%@belitangpedia.com'
ORDER BY email;

-- View public user profiles
SELECT 
  id,
  email,
  name,
  phone,
  is_seller,
  created_at
FROM public.users 
WHERE email LIKE 'admin%@belitangpedia.com'
ORDER BY email;

-- View stores
SELECT 
  s.id as store_id,
  s.name as store_name,
  u.email as owner_email,
  s.address,
  s.is_verified
FROM public.stores s
JOIN public.users u ON s.user_id = u.id
WHERE u.email LIKE 'admin%@belitangpedia.com'
ORDER BY u.email;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
-- 10 Seller accounts created successfully!
-- 
-- Login Information:
-- ==================
-- Email: admin1@belitangpedia.com  |  Password: admin123
-- Email: admin2@belitangpedia.com  |  Password: admin123
-- Email: admin3@belitangpedia.com  |  Password: admin123
-- Email: admin4@belitangpedia.com  |  Password: admin123
-- Email: admin5@belitangpedia.com  |  Password: admin123
-- Email: admin6@belitangpedia.com  |  Password: admin123
-- Email: admin7@belitangpedia.com  |  Password: admin123
-- Email: admin8@belitangpedia.com  |  Password: admin123
-- Email: admin9@belitangpedia.com  |  Password: admin123
-- Email: admin10@belitangpedia.com |  Password: admin123
-- ============================================
